import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopicInputProps {
  onSubmit: (topic: string) => void;
}

export const TopicInput = ({ onSubmit }: TopicInputProps) => {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic);
      setTopic("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-2">
      <div className="flex gap-2">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic for debate..."
          className="flex-1"
        />
        <Button type="submit">Start Debate</Button>
      </div>
    </form>
  );
};