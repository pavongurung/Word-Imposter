import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import Home from "./Home";
import Lobby from "./Lobby";
import GamePlay from "./GamePlay";
import Voting from "./Voting";
import Results from "./Results";
import { RoleReveal } from "@/components/RoleReveal";
import { 
  GameRoom, 
  Player, 
  GamePhase, 
  WSMessage, 
  WSMessageType, 
  RoomSettings,
  Clue,
  WordCategory,
  WordDifficulty,
} from "@shared/schema";
import { getRandomColor } from "@/lib/colors";
import { useToast } from "@/hooks/use-toast";

export default function Game() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [playerId, setPlayerId] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [myRole, setMyRole] = useState<{ isImposter: boolean; secretWord?: string } | null>(null);
  const [showRoleReveal, setShowRoleReveal] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Connect to WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
      setWs(socket);
      reconnectAttempts.current = 0;
    };

    socket.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to game server",
        variant: "destructive",
      });
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
      setWs(null);

      // Attempt to reconnect
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        setTimeout(() => {
          console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`);
          // Trigger reconnection by updating state
          window.location.reload();
        }, 2000);
      } else {
        toast({
          title: "Connection Lost",
          description: "Please refresh the page to reconnect",
          variant: "destructive",
        });
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = useCallback((message: WSMessage) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }, [ws]);

  const handleMessage = useCallback((message: WSMessage) => {
    console.log("Received message:", message.type, message.payload);

    switch (message.type) {
      case WSMessageType.ROOM_CREATED:
      case WSMessageType.ROOM_JOINED:
        setPlayerId(message.payload.playerId);
        setRoom(message.payload.room);
        break;

      case WSMessageType.ROOM_STATE:
      case WSMessageType.PLAYER_JOINED:
      case WSMessageType.PLAYER_LEFT:
      case WSMessageType.SETTINGS_UPDATED:
        setRoom(message.payload.room);
        break;

      case WSMessageType.GAME_STARTED:
        setRoom(message.payload.room);
        setShowRoleReveal(true);
        break;

      case WSMessageType.ROLE_ASSIGNED:
        setMyRole({
          isImposter: message.payload.isImposter,
          secretWord: message.payload.secretWord,
        });
        break;

      case WSMessageType.TURN_CHANGED:
      case WSMessageType.CLUE_SUBMITTED:
        setRoom(message.payload.room);
        break;

      case WSMessageType.VOTING_STARTED:
        setRoom(message.payload.room);
        break;

      case WSMessageType.VOTE_SUBMITTED:
        setRoom(message.payload.room);
        break;

      case WSMessageType.GAME_ENDED:
        setRoom(message.payload.room);
        break;

      case WSMessageType.ERROR:
        toast({
          title: "Error",
          description: message.payload.message,
          variant: "destructive",
        });
        break;
    }
  }, [toast]);

  const handleCreateRoom = (name: string) => {
    setPlayerName(name);
    sendMessage({
      type: WSMessageType.CREATE_ROOM,
      payload: { playerName: name, color: getRandomColor() },
    });
  };

  const handleJoinRoom = (name: string, roomCode: string) => {
    setPlayerName(name);
    sendMessage({
      type: WSMessageType.JOIN_ROOM,
      payload: { playerName: name, roomCode, color: getRandomColor() },
    });
  };

  const handleUpdateSettings = (settings: Partial<RoomSettings>) => {
    sendMessage({
      type: WSMessageType.UPDATE_SETTINGS,
      payload: { settings },
    });
  };

  const handleStartGame = () => {
    sendMessage({
      type: WSMessageType.START_GAME,
      payload: {},
    });
  };

  const handleSubmitClue = (clue: string) => {
    sendMessage({
      type: WSMessageType.SUBMIT_CLUE,
      payload: { clue },
    });
  };

  const handleSubmitVote = (votedPlayerId: string) => {
    sendMessage({
      type: WSMessageType.SUBMIT_VOTE,
      payload: { votedPlayerId },
    });
  };

  const handlePlayAgain = () => {
    sendMessage({
      type: WSMessageType.NEXT_ROUND,
      payload: {},
    });
  };

  const handleLeaveRoom = () => {
    sendMessage({
      type: WSMessageType.LEAVE_ROOM,
      payload: {},
    });
    setRoom(null);
    setMyRole(null);
    setShowRoleReveal(false);
  };

  const currentPlayer = room?.players.find((p) => p.id === playerId);

  // Show home screen if not in a room
  if (!room) {
    return <Home onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
  }

  // Show role reveal overlay
  if (showRoleReveal && myRole && room.phase === GamePhase.ROLE_REVEAL) {
    return (
      <RoleReveal
        isImposter={myRole.isImposter}
        secretWord={myRole.secretWord}
        onRevealComplete={() => setShowRoleReveal(false)}
      />
    );
  }

  // Show appropriate screen based on game phase
  switch (room.phase) {
    case GamePhase.LOBBY:
      return (
        <Lobby
          roomCode={room.code}
          players={room.players}
          currentPlayerId={playerId}
          settings={room.settings}
          onUpdateSettings={handleUpdateSettings}
          onStartGame={handleStartGame}
          onLeaveRoom={handleLeaveRoom}
        />
      );

    case GamePhase.ROLE_REVEAL:
    case GamePhase.GIVING_CLUES:
      return (
        <GamePlay
          players={room.players}
          currentPlayerId={playerId}
          currentTurn={room.currentTurn || 0}
          currentRound={room.currentRound || 1}
          totalRounds={room.settings.clueRounds}
          clues={room.clues || []}
          isImposter={myRole?.isImposter || false}
          secretWord={myRole?.secretWord}
          onSubmitClue={handleSubmitClue}
        />
      );

    case GamePhase.VOTING:
      return (
        <Voting
          players={room.players}
          currentPlayerId={playerId}
          hasVoted={currentPlayer?.hasVoted || false}
          votedPlayerId={currentPlayer?.votedFor}
          onSubmitVote={handleSubmitVote}
        />
      );

    case GamePhase.RESULTS:
      // Calculate vote results
      const voteResults: { playerId: string; playerName: string; voteCount: number }[] = [];
      const voteCounts: Record<string, number> = {};
      
      room.players.forEach((player) => {
        if (player.votedFor) {
          voteCounts[player.votedFor] = (voteCounts[player.votedFor] || 0) + 1;
        }
      });

      Object.entries(voteCounts).forEach(([id, count]) => {
        const player = room.players.find((p) => p.id === id);
        if (player) {
          voteResults.push({ playerId: id, playerName: player.name, voteCount: count });
        }
      });

      voteResults.sort((a, b) => b.voteCount - a.voteCount);

      const mostVotedPlayer = voteResults[0]?.playerId;
      const imposterCaught = mostVotedPlayer === room.imposterId;

      return (
        <Results
          players={room.players}
          imposterId={room.imposterId || ""}
          secretWord={room.secretWord || ""}
          voteResults={voteResults}
          imposterCaught={imposterCaught}
          currentPlayerId={playerId}
          isHost={currentPlayer?.isHost || false}
          onPlayAgain={handlePlayAgain}
        />
      );

    default:
      return <div>Unknown game state</div>;
  }
}
