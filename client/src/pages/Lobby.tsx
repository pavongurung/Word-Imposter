import { useState } from "react";
import { Player, RoomSettings, WordCategory, WordDifficulty, categoryMeta } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Copy, Crown, Play, Settings, Users, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LobbyProps {
  roomCode: string;
  players: Player[];
  currentPlayerId: string;
  settings: RoomSettings;
  onUpdateSettings: (settings: Partial<RoomSettings>) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export default function Lobby({
  roomCode,
  players,
  currentPlayerId,
  settings,
  onUpdateSettings,
  onStartGame,
  onLeaveRoom,
}: LobbyProps) {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const isHost = players.find((p) => p.id === currentPlayerId)?.isHost || false;
  const canStart = players.length >= 4 && players.length <= 10;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast({
      title: "Room code copied!",
      description: "Share it with your friends to join",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary">
            Game Lobby
          </h1>
          
          {/* Room Code */}
          <Card className="inline-block border-2">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Room Code</p>
                <p className="font-mono text-4xl font-bold tracking-widest text-primary" data-testid="text-room-code">
                  {roomCode}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyRoomCode}
                className="shrink-0"
                data-testid="button-copy-code"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Players Grid */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="w-6 h-6" />
              Players ({players.length}/10)
            </CardTitle>
            {isHost && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                data-testid="button-toggle-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                {showSettings ? "Hide" : "Settings"}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Settings Panel */}
            {showSettings && isHost && (
              <Card className="bg-muted/50">
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-base">Category</Label>
                      <Select
                        value={settings.category}
                        onValueChange={(value) => onUpdateSettings({ category: value as WordCategory })}
                      >
                        <SelectTrigger id="category" data-testid="select-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryMeta).map(([key, { name, emoji }]) => (
                            <SelectItem key={key} value={key}>
                              <span className="flex items-center gap-2">
                                <span>{emoji}</span>
                                <span>{name}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-base">Difficulty</Label>
                      <Select
                        value={settings.difficulty}
                        onValueChange={(value) => onUpdateSettings({ difficulty: value as WordDifficulty })}
                      >
                        <SelectTrigger id="difficulty" data-testid="select-difficulty">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={WordDifficulty.EASY}>Easy</SelectItem>
                          <SelectItem value={WordDifficulty.MEDIUM}>Medium</SelectItem>
                          <SelectItem value={WordDifficulty.HARD}>Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rounds" className="text-base">Clue Rounds</Label>
                      <Select
                        value={settings.clueRounds.toString()}
                        onValueChange={(value) => onUpdateSettings({ clueRounds: parseInt(value) })}
                      >
                        <SelectTrigger id="rounds" data-testid="select-rounds">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 Rounds</SelectItem>
                          <SelectItem value="3">3 Rounds</SelectItem>
                          <SelectItem value="4">4 Rounds</SelectItem>
                          <SelectItem value="5">5 Rounds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="phrases" className="text-base cursor-pointer">
                        Allow Phrases
                      </Label>
                      <Switch
                        id="phrases"
                        checked={settings.allowPhrases}
                        onCheckedChange={(checked) => onUpdateSettings({ allowPhrases: checked })}
                        data-testid="switch-phrases"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Settings Display */}
            {!showSettings && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {categoryMeta[settings.category].emoji} {categoryMeta[settings.category].name}
                </Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {settings.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {settings.clueRounds} Rounds
                </Badge>
                {settings.allowPhrases && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    Phrases Allowed
                  </Badge>
                )}
              </div>
            )}

            {/* Player List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {players.map((player) => (
                <Card
                  key={player.id}
                  className={player.id === currentPlayerId ? "border-2 border-primary" : ""}
                  data-testid={`card-player-${player.id}`}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <PlayerAvatar name={player.name} color={player.color} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg truncate" data-testid={`text-player-name-${player.id}`}>
                        {player.name}
                      </p>
                      {player.isHost && (
                        <Badge variant="default" className="mt-1">
                          <Crown className="w-3 h-3 mr-1" />
                          Host
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Waiting Message */}
            {players.length < 4 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-lg">
                  Waiting for more players... ({4 - players.length} more needed)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onLeaveRoom}
            className="flex-1"
            data-testid="button-leave"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Leave Room
          </Button>
          {isHost && (
            <Button
              size="lg"
              onClick={onStartGame}
              disabled={!canStart}
              className="flex-1 text-lg font-semibold"
              data-testid="button-start-game"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          )}
        </div>

        {isHost && !canStart && (
          <p className="text-center text-muted-foreground">
            {players.length < 4
              ? "Need at least 4 players to start"
              : "Maximum 10 players allowed"}
          </p>
        )}
      </div>
    </div>
  );
}
