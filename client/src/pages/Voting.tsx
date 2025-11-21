import { useState } from "react";
import { Player } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Vote, CheckCircle2 } from "lucide-react";

interface VotingProps {
  players: Player[];
  currentPlayerId: string;
  hasVoted: boolean;
  votedPlayerId?: string;
  onSubmitVote: (playerId: string) => void;
}

export default function Voting({
  players,
  currentPlayerId,
  hasVoted,
  votedPlayerId,
  onSubmitVote,
}: VotingProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(votedPlayerId || null);
  const votablePlayer = players.filter((p) => p.id !== currentPlayerId);
  const votedCount = players.filter((p) => p.hasVoted).length;

  const handleVote = () => {
    if (selectedPlayer) {
      onSubmitVote(selectedPlayer);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-destructive/10 p-4">
      <div className="max-w-6xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-accent/20 rounded-full mb-2">
            <Vote className="w-12 h-12 md:w-16 md:h-16 text-accent" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            Vote for the Imposter
          </h1>
          <p className="text-xl text-muted-foreground">
            Who do you think is the imposter?
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {votedCount} / {players.length} voted
            </Badge>
          </div>
        </div>

        {/* Voting Cards */}
        {hasVoted ? (
          <Card className="border-2 border-primary">
            <CardContent className="p-8 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">Vote Submitted!</h2>
              <p className="text-muted-foreground">
                Waiting for other players to vote...
              </p>
              {votedPlayerId && (
                <div className="flex justify-center pt-4">
                  <Card className="bg-primary/10">
                    <CardContent className="p-6 flex items-center gap-4">
                      <PlayerAvatar
                        name={players.find((p) => p.id === votedPlayerId)?.name || ""}
                        color={players.find((p) => p.id === votedPlayerId)?.color || ""}
                        size="lg"
                      />
                      <div>
                        <p className="text-sm text-muted-foreground">You voted for</p>
                        <p className="text-xl font-bold">
                          {players.find((p) => p.id === votedPlayerId)?.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Select a Player</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {votablePlayer.map((player) => (
                    <Card
                      key={player.id}
                      className={`cursor-pointer transition-all hover-elevate ${
                        selectedPlayer === player.id
                          ? "border-2 border-accent ring-2 ring-accent ring-offset-2"
                          : "border-2 border-transparent"
                      }`}
                      onClick={() => setSelectedPlayer(player.id)}
                      data-testid={`card-vote-${player.id}`}
                    >
                      <CardContent className="p-6 flex flex-col items-center gap-3">
                        <PlayerAvatar
                          name={player.name}
                          color={player.color}
                          size="xl"
                        />
                        <p className="font-semibold text-xl text-center" data-testid={`text-vote-name-${player.id}`}>
                          {player.name}
                        </p>
                        {selectedPlayer === player.id && (
                          <Badge variant="default" className="mt-2">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleVote}
                disabled={!selectedPlayer}
                className="px-12 text-lg font-semibold"
                data-testid="button-submit-vote"
              >
                <Vote className="w-5 h-5 mr-2" />
                Submit Vote
              </Button>
            </div>
          </>
        )}

        {/* Player Vote Status */}
        <Card>
          <CardHeader>
            <CardTitle>Vote Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg ${
                    player.hasVoted ? "bg-primary/20" : "bg-muted/30"
                  }`}
                >
                  <PlayerAvatar
                    name={player.name}
                    color={player.color}
                    size="md"
                  />
                  <p className="text-sm font-medium text-center truncate w-full">
                    {player.name}
                  </p>
                  {player.hasVoted && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
