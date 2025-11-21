import { GameRoom, Player, GamePhase, Clue, RoomSettings, WordCategory, WordDifficulty } from "@shared/schema";
import { randomUUID } from "crypto";
import { getRandomWord } from "./words";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export interface IStorage {
  // Room management
  createRoom(settings: RoomSettings): GameRoom;
  getRoom(code: string): GameRoom | undefined;
  updateRoom(code: string, room: Partial<GameRoom>): GameRoom | undefined;
  deleteRoom(code: string): void;
  
  // Player management
  addPlayer(roomCode: string, player: Omit<Player, "roomCode">): GameRoom | undefined;
  removePlayer(roomCode: string, playerId: string): GameRoom | undefined;
  updatePlayer(roomCode: string, playerId: string, updates: Partial<Player>): GameRoom | undefined;
  
  // Game actions
  startGame(roomCode: string): { room: GameRoom; imposter: Player; secretWord: string } | undefined;
  submitClue(roomCode: string, playerId: string, clue: string): GameRoom | undefined;
  submitVote(roomCode: string, playerId: string, votedForId: string): GameRoom | undefined;
  nextRound(roomCode: string): GameRoom | undefined;
}

export class MemStorage implements IStorage {
  private rooms: Map<string, GameRoom>;

  constructor() {
    this.rooms = new Map();
  }

  createRoom(settings: RoomSettings): GameRoom {
    let code: string;
    do {
      code = this.generateUniqueRoomCode();
    } while (this.rooms.has(code));

    const room: GameRoom = {
      code,
      players: [],
      phase: GamePhase.LOBBY,
      settings,
      createdAt: Date.now(),
    };

    this.rooms.set(code, room);
    return room;
  }

  private generateUniqueRoomCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  getRoom(code: string): GameRoom | undefined {
    return this.rooms.get(code);
  }

  updateRoom(code: string, updates: Partial<GameRoom>): GameRoom | undefined {
    const room = this.rooms.get(code);
    if (!room) return undefined;

    const updated = { ...room, ...updates };
    this.rooms.set(code, updated);
    return updated;
  }

  deleteRoom(code: string): void {
    this.rooms.delete(code);
  }

  addPlayer(roomCode: string, player: Omit<Player, "roomCode">): GameRoom | undefined {
    const room = this.rooms.get(roomCode);
    if (!room) return undefined;

    const newPlayer: Player = {
      ...player,
      roomCode,
      isHost: room.players.length === 0,
    };

    room.players.push(newPlayer);
    this.rooms.set(roomCode, room);
    return room;
  }

  removePlayer(roomCode: string, playerId: string): GameRoom | undefined {
    const room = this.rooms.get(roomCode);
    if (!room) return undefined;

    const playerIndex = room.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return undefined;

    const wasHost = room.players[playerIndex].isHost;
    room.players.splice(playerIndex, 1);

    // If host left and there are still players, assign new host
    if (wasHost && room.players.length > 0) {
      room.players[0].isHost = true;
    }

    // Delete room if empty
    if (room.players.length === 0) {
      this.deleteRoom(roomCode);
      return undefined;
    }

    this.rooms.set(roomCode, room);
    return room;
  }

  updatePlayer(roomCode: string, playerId: string, updates: Partial<Player>): GameRoom | undefined {
    const room = this.rooms.get(roomCode);
    if (!room) return undefined;

    const playerIndex = room.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return undefined;

    room.players[playerIndex] = { ...room.players[playerIndex], ...updates };
    this.rooms.set(roomCode, room);
    return room;
  }

  startGame(roomCode: string): { room: GameRoom; imposter: Player; secretWord: string } | undefined {
    const room = this.rooms.get(roomCode);
    if (!room || room.players.length < 4 || room.players.length > 10) {
      return undefined;
    }

    // Select random imposter
    const imposterIndex = Math.floor(Math.random() * room.players.length);
    const imposter = room.players[imposterIndex];

    // Get random word
    const secretWord = getRandomWord(room.settings.category, room.settings.difficulty);

    // Update room state
    room.phase = GamePhase.ROLE_REVEAL;
    room.secretWord = secretWord;
    room.imposterId = imposter.id;
    room.currentTurn = 0;
    room.currentRound = 1;
    room.clues = [];

    // Mark imposter in players
    room.players.forEach((player) => {
      player.isImposter = player.id === imposter.id;
      player.hasVoted = false;
      player.votedFor = undefined;
    });

    this.rooms.set(roomCode, room);
    return { room, imposter, secretWord };
  }

  submitClue(roomCode: string, playerId: string, clueText: string): GameRoom | undefined {
    const room = this.rooms.get(roomCode);
    if (!room || room.phase !== GamePhase.GIVING_CLUES) {
      return undefined;
    }

    const currentPlayer = room.players[room.currentTurn! % room.players.length];
    if (currentPlayer.id !== playerId) {
      return undefined;
    }

    // Add clue
    const player = room.players.find((p) => p.id === playerId);
    if (!player) return undefined;

    const clue: Clue = {
      playerId,
      playerName: player.name,
      clue: clueText,
      timestamp: Date.now(),
    };

    room.clues = room.clues || [];
    room.clues.push(clue);

    // Advance turn
    room.currentTurn!++;

    // Check if round is complete
    if (room.currentTurn! >= room.players.length * room.currentRound!) {
      // Check if all rounds are complete
      if (room.currentRound! >= room.settings.clueRounds) {
        // Move to voting
        room.phase = GamePhase.VOTING;
      } else {
        // Next round
        room.currentRound!++;
      }
    }

    this.rooms.set(roomCode, room);
    return room;
  }

  submitVote(roomCode: string, playerId: string, votedForId: string): GameRoom | undefined {
    const room = this.rooms.get(roomCode);
    if (!room || room.phase !== GamePhase.VOTING) {
      return undefined;
    }

    const playerIndex = room.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return undefined;

    // Update player vote
    room.players[playerIndex].hasVoted = true;
    room.players[playerIndex].votedFor = votedForId;

    // Check if all players have voted
    const allVoted = room.players.every((p) => p.hasVoted);
    if (allVoted) {
      room.phase = GamePhase.RESULTS;
    }

    this.rooms.set(roomCode, room);
    return room;
  }

  nextRound(roomCode: string): GameRoom | undefined {
    const room = this.rooms.get(roomCode);
    if (!room || room.phase !== GamePhase.RESULTS) {
      return undefined;
    }

    // Reset to lobby for new game
    room.phase = GamePhase.LOBBY;
    room.secretWord = undefined;
    room.imposterId = undefined;
    room.currentTurn = undefined;
    room.currentRound = undefined;
    room.clues = [];

    room.players.forEach((player) => {
      player.isImposter = undefined;
      player.hasVoted = false;
      player.votedFor = undefined;
    });

    this.rooms.set(roomCode, room);
    return room;
  }
}

export const storage = new MemStorage();
