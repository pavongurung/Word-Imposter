import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Player, Clue } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const clueSchema = z.object({
  clue: z.string().min(1, "Clue is required").max(50, "Clue must be 50 characters or less"),
});

interface GamePlayProps {
  players: Player[];
  currentPlayerId: string;
  currentTurn: number;
  currentRound: number;
  totalRounds: number;
  clues: Clue[];
  isImposter: boolean;
  secretWord?: string;
  onSubmitClue: (clue: string) => void;
}

export default function GamePlay({
  players,
  currentPlayerId,
  currentTurn,
  currentRound,
  totalRounds,
  clues,
  isImposter,
  secretWord,
  onSubmitClue,
}: GamePlayProps) {
  const currentPlayer = players[currentTurn % players.length];
  const isMyTurn = currentPlayer?.id === currentPlayerId;
  const progressPercent = ((currentRound - 1) / totalRounds) * 100;

  const form = useForm<z.infer<typeof clueSchema>>({
    resolver: zodResolver(clueSchema),
    defaultValues: {
      clue: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof clueSchema>) => {
    onSubmitClue(values.clue);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4" data-testid="gameplay-screen">
      <div className="max-w-6xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold" data-testid="text-round">
            Round {currentRound} of {totalRounds}
          </h1>
          <Progress value={progressPercent} className="h-2 max-w-md mx-auto" data-testid="progress-round" />
          
          {/* Secret Word Reminder (Only for non-imposters) */}
          {!isImposter && secretWord && (
            <Card className="inline-block border-2 border-primary">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Secret Word</p>
                <p className="font-display text-3xl font-bold text-primary" data-testid="text-secret-word-reminder">
                  {secretWord}
                </p>
              </CardContent>
            </Card>
          )}
          {isImposter && (
            <Badge variant="destructive" className="text-base px-4 py-2" data-testid="badge-imposter">
              You are the Imposter
            </Badge>
          )}
        </div>

        {/* Current Turn */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-3">
              {isMyTurn ? (
                <>
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <span className="text-primary">Your Turn!</span>
                </>
              ) : (
                <>
                  <span>{currentPlayer?.name}'s Turn</span>
                  <ArrowRight className="w-6 h-6 animate-pulse" />
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isMyTurn ? (
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="text-center space-y-2">
                  <p className="text-lg text-muted-foreground" data-testid="text-clue-instruction">
                    {isImposter
                      ? "Give a vague clue to blend in without revealing you don't know the word"
                      : "Give a clue about the secret word without saying it directly"}
                  </p>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-3" data-testid="form-submit-clue">
                    <FormField
                      control={form.control}
                      name="clue"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Enter your clue..."
                              {...field}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  form.handleSubmit(handleSubmit)();
                                }
                              }}
                              className="text-lg h-12"
                              maxLength={50}
                              autoFocus
                              data-testid="input-clue"
                            />
                          </FormControl>
                          <FormMessage data-testid="error-clue" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="px-8"
                      data-testid="button-submit-clue"
                    >
                      Submit
                    </Button>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <PlayerAvatar
                    name={currentPlayer?.name || ""}
                    color={currentPlayer?.color || ""}
                    size="xl"
                    className="animate-pulse ring-4 ring-primary ring-offset-4"
                  />
                </div>
                <p className="text-xl text-muted-foreground">
                  Waiting for {currentPlayer?.name} to give a clue...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Previous Clues */}
        {clues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Previous Clues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clues.map((clue, index) => {
                  const player = players.find((p) => p.id === clue.playerId);
                  return (
                    <Card
                      key={index}
                      className="bg-muted/50"
                      data-testid={`card-clue-${index}`}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <PlayerAvatar
                          name={player?.name || ""}
                          color={player?.color || ""}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground">
                            {clue.playerName}
                          </p>
                          <p
                            className="text-xl font-semibold truncate"
                            data-testid={`text-clue-${index}`}
                          >
                            {clue.clue}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Player Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg ${
                    player.id === currentPlayer?.id
                      ? "bg-primary/20 ring-2 ring-primary"
                      : "bg-muted/30"
                  }`}
                  data-testid={`player-indicator-${player.id}`}
                >
                  <PlayerAvatar
                    name={player.name}
                    color={player.color}
                    size="md"
                  />
                  <p className="text-sm font-medium text-center truncate w-full">
                    {player.name}
                  </p>
                  {player.id === currentPlayer?.id && (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
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
