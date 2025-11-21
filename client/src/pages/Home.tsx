import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Users, Play } from "lucide-react";
import { formatRoomCode } from "@/lib/utils";

interface HomeProps {
  onCreateRoom: (playerName: string) => void;
  onJoinRoom: (playerName: string, roomCode: string) => void;
}

const createRoomSchema = z.object({
  playerName: z.string().min(1, "Name is required").max(20, "Name must be 20 characters or less"),
});

const joinRoomSchema = z.object({
  playerName: z.string().min(1, "Name is required").max(20, "Name must be 20 characters or less"),
  roomCode: z.string().length(6, "Room code must be 6 characters"),
});

export default function Home({ onCreateRoom, onJoinRoom }: HomeProps) {
  const [mode, setMode] = useState<"create" | "join" | null>(null);

  const createForm = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      playerName: "",
    },
  });

  const joinForm = useForm<z.infer<typeof joinRoomSchema>>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      playerName: "",
      roomCode: "",
    },
  });

  const handleCreate = (values: z.infer<typeof createRoomSchema>) => {
    onCreateRoom(values.playerName);
  };

  const handleJoin = (values: z.infer<typeof joinRoomSchema>) => {
    onJoinRoom(values.playerName, formatRoomCode(values.roomCode));
  };

  const handleBack = () => {
    setMode(null);
    createForm.reset();
    joinForm.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4" data-testid="home-screen">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-display text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse" data-testid="text-title">
            IMPOSTER
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium" data-testid="text-subtitle">
            The Word Game
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto" data-testid="text-description">
            One player is secretly the imposter. Can you spot them before it's too late?
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-display" data-testid="text-card-title">
              {mode === null && "Get Started"}
              {mode === "create" && "Create a Room"}
              {mode === "join" && "Join a Room"}
            </CardTitle>
            <CardDescription className="text-base" data-testid="text-card-description">
              {mode === null && "Create a new game or join an existing one"}
              {mode === "create" && "Enter your name to create a new game room"}
              {mode === "join" && "Enter your name and the room code"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mode === null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="h-24 text-xl font-semibold flex-col gap-2"
                  onClick={() => setMode("create")}
                  data-testid="button-create-room"
                >
                  <Play className="w-8 h-8" />
                  Create Room
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-24 text-xl font-semibold flex-col gap-2"
                  onClick={() => setMode("join")}
                  data-testid="button-join-room"
                >
                  <Users className="w-8 h-8" />
                  Join Room
                </Button>
              </div>
            ) : mode === "create" ? (
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-6" data-testid="form-create-room">
                  <FormField
                    control={createForm.control}
                    name="playerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Your Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            {...field}
                            maxLength={20}
                            className="text-lg h-12"
                            data-testid="input-player-name"
                            autoFocus
                          />
                        </FormControl>
                        <FormMessage data-testid="error-player-name" />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={handleBack}
                      data-testid="button-back"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 text-lg font-semibold"
                      data-testid="button-continue"
                    >
                      Create Game
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...joinForm}>
                <form onSubmit={joinForm.handleSubmit(handleJoin)} className="space-y-6" data-testid="form-join-room">
                  <FormField
                    control={joinForm.control}
                    name="playerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Your Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            {...field}
                            maxLength={20}
                            className="text-lg h-12"
                            data-testid="input-player-name"
                            autoFocus
                          />
                        </FormControl>
                        <FormMessage data-testid="error-player-name" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={joinForm.control}
                    name="roomCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Room Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter 6-digit code"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            maxLength={6}
                            className="text-lg h-12 font-mono tracking-widest"
                            data-testid="input-room-code"
                          />
                        </FormControl>
                        <FormMessage data-testid="error-room-code" />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={handleBack}
                      data-testid="button-back"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 text-lg font-semibold"
                      data-testid="button-continue"
                    >
                      Join Game
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground" data-testid="text-players">
            4-10 players • Ages 10+ • 10-20 minutes
          </p>
          <p className="text-xs text-muted-foreground" data-testid="text-tagline">
            Perfect for parties, family game nights, and friends
          </p>
        </div>
      </div>
    </div>
  );
}
