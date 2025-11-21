import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import {
  WSMessage,
  WSMessageType,
  Player,
  GamePhase,
  WordCategory,
  WordDifficulty,
  RoomSettings,
} from "@shared/schema";
import { randomUUID } from "crypto";

// Map of player IDs to their WebSocket connections
const playerConnections = new Map<string, WebSocket>();
// Map of player IDs to their room codes
const playerRooms = new Map<string, string>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Create WebSocket server on /ws path
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection");
    let playerId: string | undefined;
    let roomCode: string | undefined;

    ws.on("message", async (data: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());
        console.log("Received message:", message.type);

        switch (message.type) {
          case WSMessageType.CREATE_ROOM: {
            const { playerName, color } = message.payload;
            
            // Create default settings
            const settings: RoomSettings = {
              category: WordCategory.FOOD,
              difficulty: WordDifficulty.MEDIUM,
              clueRounds: 3,
              allowPhrases: false,
            };

            // Create room
            const room = storage.createRoom(settings);
            roomCode = room.code;

            // Create player
            playerId = randomUUID();
            const player: Omit<Player, "roomCode"> = {
              id: playerId,
              name: playerName,
              isHost: true,
              color,
            };

            // Add player to room
            const updatedRoom = storage.addPlayer(roomCode, player);
            if (!updatedRoom) {
              sendError(ws, "Failed to create room");
              return;
            }

            // Store connection
            playerConnections.set(playerId, ws);
            playerRooms.set(playerId, roomCode);

            // Send response
            send(ws, {
              type: WSMessageType.ROOM_CREATED,
              payload: { playerId, room: updatedRoom },
            });

            break;
          }

          case WSMessageType.JOIN_ROOM: {
            const { playerName, roomCode: joinCode, color } = message.payload;
            
            // Get room
            const room = storage.getRoom(joinCode);
            if (!room) {
              sendError(ws, "Room not found");
              return;
            }

            if (room.phase !== GamePhase.LOBBY) {
              sendError(ws, "Game already in progress");
              return;
            }

            if (room.players.length >= 10) {
              sendError(ws, "Room is full");
              return;
            }

            // Create player
            playerId = randomUUID();
            roomCode = joinCode;
            const player: Omit<Player, "roomCode"> = {
              id: playerId,
              name: playerName,
              isHost: false,
              color,
            };

            // Add player to room
            const updatedRoom = storage.addPlayer(roomCode, player);
            if (!updatedRoom) {
              sendError(ws, "Failed to join room");
              return;
            }

            // Store connection
            playerConnections.set(playerId, ws);
            playerRooms.set(playerId, roomCode);

            // Send response to new player
            send(ws, {
              type: WSMessageType.ROOM_JOINED,
              payload: { playerId, room: updatedRoom },
            });

            // Notify all players in room including the joining player
            broadcastToRoom(roomCode, {
              type: WSMessageType.PLAYER_JOINED,
              payload: { room: updatedRoom },
            });

            break;
          }

          case WSMessageType.LEAVE_ROOM: {
            if (!playerId || !roomCode) return;

            const room = storage.removePlayer(roomCode, playerId);
            
            // Clean up connections
            playerConnections.delete(playerId);
            playerRooms.delete(playerId);

            // Notify remaining players
            if (room) {
              broadcastToRoom(roomCode, {
                type: WSMessageType.PLAYER_LEFT,
                payload: { room },
              });
            }

            break;
          }

          case WSMessageType.UPDATE_SETTINGS: {
            if (!playerId || !roomCode) return;

            const room = storage.getRoom(roomCode);
            if (!room) {
              sendError(ws, "Room not found");
              return;
            }

            // Check if player is host
            const player = room.players.find((p) => p.id === playerId);
            if (!player?.isHost) {
              sendError(ws, "Only host can update settings");
              return;
            }

            // Update settings
            const updatedRoom = storage.updateRoom(roomCode, {
              settings: { ...room.settings, ...message.payload.settings },
            });

            if (!updatedRoom) {
              sendError(ws, "Failed to update settings");
              return;
            }

            // Broadcast to all players
            broadcastToRoom(roomCode, {
              type: WSMessageType.SETTINGS_UPDATED,
              payload: { room: updatedRoom },
            });

            break;
          }

          case WSMessageType.START_GAME: {
            if (!playerId || !roomCode) return;

            const room = storage.getRoom(roomCode);
            if (!room) {
              sendError(ws, "Room not found");
              return;
            }

            // Check if player is host
            const player = room.players.find((p) => p.id === playerId);
            if (!player?.isHost) {
              sendError(ws, "Only host can start game");
              return;
            }

            // Start game
            const result = storage.startGame(roomCode);
            if (!result) {
              sendError(ws, "Failed to start game");
              return;
            }

            const { room: updatedRoom, imposter, secretWord } = result;

            // Send role assignments to each player
            updatedRoom.players.forEach((p) => {
              const playerWs = playerConnections.get(p.id);
              if (playerWs && playerWs.readyState === WebSocket.OPEN) {
                send(playerWs, {
                  type: WSMessageType.ROLE_ASSIGNED,
                  payload: {
                    isImposter: p.id === imposter.id,
                    secretWord: p.id === imposter.id ? undefined : secretWord,
                  },
                });
              }
            });

            // Broadcast game started to all players
            broadcastToRoom(roomCode, {
              type: WSMessageType.GAME_STARTED,
              payload: { room: updatedRoom },
            });

            // After role reveal, start giving clues
            setTimeout(() => {
              const room = storage.updateRoom(roomCode, {
                phase: GamePhase.GIVING_CLUES,
              });
              if (room) {
                broadcastToRoom(roomCode, {
                  type: WSMessageType.TURN_CHANGED,
                  payload: { room },
                });
              }
            }, 6000); // 6 second delay for role reveal

            break;
          }

          case WSMessageType.SUBMIT_CLUE: {
            if (!playerId || !roomCode) return;

            const { clue } = message.payload;
            const updatedRoom = storage.submitClue(roomCode, playerId, clue);
            
            if (!updatedRoom) {
              sendError(ws, "Failed to submit clue");
              return;
            }

            // Check if moved to voting
            if (updatedRoom.phase === GamePhase.VOTING) {
              broadcastToRoom(roomCode, {
                type: WSMessageType.VOTING_STARTED,
                payload: { room: updatedRoom },
              });
            } else {
              // Broadcast clue and turn change
              broadcastToRoom(roomCode, {
                type: WSMessageType.CLUE_SUBMITTED,
                payload: { room: updatedRoom },
              });
            }

            break;
          }

          case WSMessageType.SUBMIT_VOTE: {
            if (!playerId || !roomCode) return;

            const { votedPlayerId } = message.payload;
            const updatedRoom = storage.submitVote(roomCode, playerId, votedPlayerId);
            
            if (!updatedRoom) {
              sendError(ws, "Failed to submit vote");
              return;
            }

            // Broadcast vote update
            if (updatedRoom.phase === GamePhase.RESULTS) {
              broadcastToRoom(roomCode, {
                type: WSMessageType.GAME_ENDED,
                payload: { room: updatedRoom },
              });
            } else {
              broadcastToRoom(roomCode, {
                type: WSMessageType.VOTE_SUBMITTED,
                payload: { room: updatedRoom },
              });
            }

            break;
          }

          case WSMessageType.NEXT_ROUND: {
            if (!playerId || !roomCode) return;

            const room = storage.getRoom(roomCode);
            if (!room) {
              sendError(ws, "Room not found");
              return;
            }

            // Check if player is host
            const player = room.players.find((p) => p.id === playerId);
            if (!player?.isHost) {
              sendError(ws, "Only host can start next round");
              return;
            }

            const updatedRoom = storage.nextRound(roomCode);
            if (!updatedRoom) {
              sendError(ws, "Failed to start next round");
              return;
            }

            // Broadcast back to lobby
            broadcastToRoom(roomCode, {
              type: WSMessageType.ROOM_STATE,
              payload: { room: updatedRoom },
            });

            break;
          }

          default:
            console.warn("Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("Error handling message:", error);
        sendError(ws, "Internal server error");
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
      
      // Clean up player
      if (playerId && roomCode) {
        const room = storage.removePlayer(roomCode, playerId);
        playerConnections.delete(playerId);
        playerRooms.delete(playerId);

        // Notify remaining players
        if (room) {
          broadcastToRoom(roomCode, {
            type: WSMessageType.PLAYER_LEFT,
            payload: { room },
          });
        }
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  function send(ws: WebSocket, message: WSMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  function sendError(ws: WebSocket, errorMessage: string) {
    send(ws, {
      type: WSMessageType.ERROR,
      payload: { message: errorMessage },
    });
  }

  function broadcastToRoom(roomCode: string, message: WSMessage) {
    const room = storage.getRoom(roomCode);
    if (!room) return;

    room.players.forEach((player) => {
      const playerWs = playerConnections.get(player.id);
      if (playerWs && playerWs.readyState === WebSocket.OPEN) {
        send(playerWs, message);
      }
    });
  }

  return httpServer;
}
