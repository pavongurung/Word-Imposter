import { Player } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Trophy, X, Eye, Users, RotateCcw } from "lucide-react";

interface VoteResult {
  playerId: string;
  playerName: string;
  voteCount: number;
}

interface ResultsProps {
  players: Player[];
  imposterId: string;
  secretWord: string;
  voteResults: VoteResult[];
  imposterCaught: boolean;
  currentPlayerId: string;
  isHost: boolean;
  onPlayAgain: () => void;
}

export default function Results({
  players,
  imposterId,
  secretWord,
  voteResults,
  imposterCaught,
  currentPlayerId,
  isHost,
  onPlayAgain,
}: ResultsProps) {
  const imposter = players.find((p) => p.id === imposterId);
  const mostVoted = voteResults.length > 0 ? voteResults[0] : null;
  const wasImposter = currentPlayerId === imposterId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        {/* Result Header */}
        <div className="text-center space-y-6">
          <div
            className={`inline-block p-6 rounded-full mb-4 ${
              imposterCaught ? "bg-primary/20" : "bg-destructive/20"
            }`}
          >
            {imposterCaught ? (
              <Trophy className="w-16 h-16 md:w-24 md:h-24 text-primary" />
            ) : (
              <X className="w-16 h-16 md:w-24 md:h-24 text-destructive" />
            )}
          </div>

          <div className="space-y-2">
            <h1
              className={`font-display text-5xl md:text-6xl font-bold ${
                imposterCaught ? "text-primary" : "text-destructive"
              }`}
            >
              {imposterCaught ? "IMPOSTER CAUGHT!" : "IMPOSTER WINS!"}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              {imposterCaught
                ? "The team successfully identified the imposter"
                : "The imposter managed to blend in"}
            </p>
          </div>
        </div>

        {/* Secret Word Reveal */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Eye className="w-6 h-6" />
              Secret Word
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-6xl md:text-7xl font-bold text-center text-primary" data-testid="text-final-word">
              {secretWord}
            </p>
          </CardContent>
        </Card>

        {/* Imposter Reveal */}
        <Card className="border-2 border-destructive">
          <CardHeader>
            <CardTitle className="text-center">The Imposter Was...</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-6">
            <PlayerAvatar
              name={imposter?.name || ""}
              color={imposter?.color || ""}
              size="xl"
              className="ring-4 ring-destructive ring-offset-4"
            />
            <div className="text-center">
              <p className="text-3xl font-bold" data-testid="text-imposter-name">
                {imposter?.name}
              </p>
              <Badge variant="destructive" className="mt-2 text-base px-4 py-1">
                Imposter
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Vote Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Vote Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {voteResults.map((result, index) => {
              const player = players.find((p) => p.id === result.playerId);
              const isImposter = result.playerId === imposterId;
              return (
                <Card
                  key={result.playerId}
                  className={`${
                    index === 0
                      ? "border-2 border-accent"
                      : "bg-muted/30"
                  }`}
                  data-testid={`card-vote-result-${result.playerId}`}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <PlayerAvatar
                        name={player?.name || ""}
                        color={player?.color || ""}
                        size="md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg">
                            {result.playerName}
                          </p>
                          {isImposter && (
                            <Badge variant="destructive" className="text-xs">
                              Imposter
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.voteCount} {result.voteCount === 1 ? "vote" : "votes"}
                        </p>
                      </div>
                    </div>
                    {index === 0 && (
                      <Badge variant="default" className="text-base px-3 py-1">
                        Most Votes
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        {/* Personal Result */}
        {wasImposter && (
          <Card className={imposterCaught ? "border-2 border-destructive" : "border-2 border-primary"}>
            <CardContent className="p-8 text-center space-y-2">
              <h2 className="text-2xl font-bold">
                {imposterCaught ? "You were caught!" : "You survived!"}
              </h2>
              <p className="text-muted-foreground">
                {imposterCaught
                  ? "Better luck blending in next time"
                  : "Congratulations on staying hidden"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Play Again Button */}
        {isHost && (
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={onPlayAgain}
              className="px-12 text-lg font-semibold"
              data-testid="button-play-again"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
          </div>
        )}

        {!isHost && (
          <p className="text-center text-muted-foreground">
            Waiting for host to start a new round...
          </p>
        )}
      </div>
    </div>
  );
}
