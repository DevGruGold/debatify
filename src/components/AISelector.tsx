import { Check } from "lucide-react";
import { useState } from "react";

interface AI {
  id: string;
  name: string;
  colorClass: string;
  role: "participant" | "moderator";
}

const availableAIs: AI[] = [
  { id: "openai", name: "OpenAI", colorClass: "bg-openai", role: "participant" },
  { id: "anthropic", name: "Anthropic", colorClass: "bg-anthropic", role: "participant" },
  { id: "meta", name: "Meta", colorClass: "bg-meta", role: "participant" },
  { id: "google", name: "Google", colorClass: "bg-google", role: "participant" },
  { id: "deepseek", name: "DeepSeek", colorClass: "bg-deepseek", role: "moderator" }
];

interface AISelectorProps {
  onSelectionChange: (selectedAIs: AI[], moderator: AI) => void;
}

export const AISelector = ({ onSelectionChange }: AISelectorProps) => {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(["openai", "anthropic", "meta", "google"]);
  const [selectedModerator, setSelectedModerator] = useState<string>("deepseek");

  const handleParticipantToggle = (aiId: string) => {
    setSelectedParticipants(prev => {
      const newSelection = prev.includes(aiId)
        ? prev.filter(id => id !== aiId)
        : [...prev, aiId];
      
      const participants = availableAIs.filter(ai => 
        newSelection.includes(ai.id) && ai.role === "participant"
      );
      const moderator = availableAIs.find(ai => ai.id === selectedModerator)!;
      onSelectionChange(participants, moderator);
      return newSelection;
    });
  };

  const handleModeratorSelect = (aiId: string) => {
    setSelectedModerator(aiId);
    const participants = availableAIs.filter(ai => 
      selectedParticipants.includes(ai.id) && ai.role === "participant"
    );
    const moderator = availableAIs.find(ai => ai.id === aiId)!;
    onSelectionChange(participants, moderator);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Participants (2-4)</h3>
          <div className="flex flex-wrap gap-2">
            {availableAIs.filter(ai => ai.role === "participant").map((ai) => (
              <button
                key={ai.id}
                onClick={() => handleParticipantToggle(ai.id)}
                disabled={selectedParticipants.length <= 2 && selectedParticipants.includes(ai.id)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                  selectedParticipants.includes(ai.id)
                    ? ai.colorClass + " text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {ai.name}
                {selectedParticipants.includes(ai.id) && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Moderator</h3>
          <div className="flex flex-wrap gap-2">
            {availableAIs.map((ai) => (
              <button
                key={ai.id}
                onClick={() => handleModeratorSelect(ai.id)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                  selectedModerator === ai.id
                    ? ai.colorClass + " text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {ai.name}
                {selectedModerator === ai.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};