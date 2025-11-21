import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";

interface RoleRevealProps {
  isImposter: boolean;
  secretWord?: string;
  onRevealComplete: () => void;
}

export function RoleReveal({ isImposter, secretWord, onRevealComplete }: RoleRevealProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onRevealComplete, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRevealComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl space-y-8 text-center animate-in fade-in zoom-in duration-500">
        {isImposter ? (
          <>
            <div className="space-y-4">
              <div className="inline-block p-4 bg-destructive/20 rounded-full mb-4 animate-pulse">
                <EyeOff className="w-16 h-16 md:w-24 md:h-24 text-destructive" />
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-destructive animate-pulse">
                YOU ARE THE IMPOSTER
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                You don't know the secret word
              </p>
            </div>
            <Card className="border-2 border-destructive bg-destructive/10">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">Your Mission:</h2>
                <ul className="text-lg text-left space-y-2 max-w-md mx-auto">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Listen carefully to others' clues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Give vague clues to blend in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Guess the word if you survive voting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="inline-block p-4 bg-primary/20 rounded-full mb-4">
                <Eye className="w-16 h-16 md:w-24 md:h-24 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                THE SECRET WORD IS
              </h1>
            </div>
            <Card className="border-4 border-primary bg-primary/10">
              <CardContent className="p-12">
                <p className="font-display text-6xl md:text-8xl font-bold text-primary" data-testid="text-secret-word">
                  {secretWord}
                </p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">Your Mission:</h2>
                <ul className="text-lg text-left space-y-2 max-w-md mx-auto">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Give clues without saying the word</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Help others identify the imposter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Don't make it too obvious!</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        <div className="pt-4">
          <p className="text-xl text-muted-foreground">
            Game starts in{" "}
            <Badge variant="default" className="text-2xl px-4 py-2">
              {countdown}
            </Badge>
          </p>
        </div>
      </div>
    </div>
  );
}
