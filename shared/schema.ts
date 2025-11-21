import { z } from "zod";

// Player schema
export const playerSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(20),
  roomCode: z.string(),
  isHost: z.boolean(),
  color: z.string(),
  isImposter: z.boolean().optional(),
  hasVoted: z.boolean().optional(),
  votedFor: z.string().optional(),
});

export type Player = z.infer<typeof playerSchema>;

// Game state enum
export enum GamePhase {
  LOBBY = "LOBBY",
  ROLE_REVEAL = "ROLE_REVEAL",
  GIVING_CLUES = "GIVING_CLUES",
  VOTING = "VOTING",
  RESULTS = "RESULTS",
}

// Word difficulty
export enum WordDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

// Word categories
export enum WordCategory {
  FOOD = "FOOD",
  ANIMALS = "ANIMALS",
  MOVIES_TV = "MOVIES_TV",
  SPORTS = "SPORTS",
  PLACES = "PLACES",
  JOBS = "JOBS",
  OBJECTS = "OBJECTS",
  VEHICLES = "VEHICLES",
  HOLIDAYS = "HOLIDAYS",
  SCHOOL = "SCHOOL",
  SILLY = "SILLY",
  FANTASY = "FANTASY",
  TECHNOLOGY = "TECHNOLOGY",
  NATURE = "NATURE",
  MUSIC = "MUSIC",
}

// Clue schema
export const clueSchema = z.object({
  playerId: z.string(),
  playerName: z.string(),
  clue: z.string().min(1).max(50),
  timestamp: z.number(),
});

export type Clue = z.infer<typeof clueSchema>;

// Room settings schema
export const roomSettingsSchema = z.object({
  category: z.nativeEnum(WordCategory),
  difficulty: z.nativeEnum(WordDifficulty),
  clueRounds: z.number().min(2).max(5),
  allowPhrases: z.boolean(),
});

export type RoomSettings = z.infer<typeof roomSettingsSchema>;

// Game room schema
export const gameRoomSchema = z.object({
  code: z.string(),
  players: z.array(playerSchema),
  phase: z.nativeEnum(GamePhase),
  settings: roomSettingsSchema,
  secretWord: z.string().optional(),
  imposterId: z.string().optional(),
  currentTurn: z.number().optional(),
  currentRound: z.number().optional(),
  clues: z.array(clueSchema).optional(),
  votes: z.record(z.string()).optional(), // playerId -> votedForPlayerId
  createdAt: z.number(),
});

export type GameRoom = z.infer<typeof gameRoomSchema>;

// WebSocket message types
export enum WSMessageType {
  // Client -> Server
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  UPDATE_SETTINGS = "UPDATE_SETTINGS",
  START_GAME = "START_GAME",
  SUBMIT_CLUE = "SUBMIT_CLUE",
  SUBMIT_VOTE = "SUBMIT_VOTE",
  NEXT_ROUND = "NEXT_ROUND",
  
  // Server -> Client
  ROOM_CREATED = "ROOM_CREATED",
  ROOM_JOINED = "ROOM_JOINED",
  ROOM_STATE = "ROOM_STATE",
  PLAYER_JOINED = "PLAYER_JOINED",
  PLAYER_LEFT = "PLAYER_LEFT",
  SETTINGS_UPDATED = "SETTINGS_UPDATED",
  GAME_STARTED = "GAME_STARTED",
  ROLE_ASSIGNED = "ROLE_ASSIGNED",
  TURN_CHANGED = "TURN_CHANGED",
  CLUE_SUBMITTED = "CLUE_SUBMITTED",
  VOTING_STARTED = "VOTING_STARTED",
  VOTE_SUBMITTED = "VOTE_SUBMITTED",
  GAME_ENDED = "GAME_ENDED",
  ERROR = "ERROR",
}

export const wsMessageSchema = z.object({
  type: z.nativeEnum(WSMessageType),
  payload: z.any(),
});

export type WSMessage = z.infer<typeof wsMessageSchema>;

// Category display names and emoji
export const categoryMeta: Record<WordCategory, { name: string; emoji: string }> = {
  [WordCategory.FOOD]: { name: "Food", emoji: "🍕" },
  [WordCategory.ANIMALS]: { name: "Animals", emoji: "🦁" },
  [WordCategory.MOVIES_TV]: { name: "Movies & TV", emoji: "🎬" },
  [WordCategory.SPORTS]: { name: "Sports & Games", emoji: "⚽" },
  [WordCategory.PLACES]: { name: "Places", emoji: "🗺️" },
  [WordCategory.JOBS]: { name: "Jobs", emoji: "👨‍💼" },
  [WordCategory.OBJECTS]: { name: "Objects", emoji: "📦" },
  [WordCategory.VEHICLES]: { name: "Vehicles", emoji: "🚗" },
  [WordCategory.HOLIDAYS]: { name: "Holidays", emoji: "🎉" },
  [WordCategory.SCHOOL]: { name: "School", emoji: "📚" },
  [WordCategory.SILLY]: { name: "Silly & Random", emoji: "🤪" },
  [WordCategory.FANTASY]: { name: "Fantasy", emoji: "🐉" },
  [WordCategory.TECHNOLOGY]: { name: "Technology", emoji: "💻" },
  [WordCategory.NATURE]: { name: "Nature", emoji: "🌲" },
  [WordCategory.MUSIC]: { name: "Music", emoji: "🎵" },
};
