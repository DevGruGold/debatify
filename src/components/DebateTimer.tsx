import { useEffect, useState } from "react";

interface DebateTimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export const DebateTimer = ({ duration, onTimeUp, isActive }: DebateTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return duration; // Reset to full duration for next exchange
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeUp, isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-2xl font-mono font-medium">{formatTime(timeLeft)}</div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-1000"
          style={{
            width: `${(timeLeft / duration) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};