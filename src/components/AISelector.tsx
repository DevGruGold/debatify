import { Check } from "lucide-react";
import { useState } from "react";

interface AI {
  id: string;
  name: string;
  colorClass: string;
  role: "participant" | "moderator";
  disabled?: boolean;
}

const availableAIs: AI[] = [
  { id: "openai", name: "OpenAI", colorClass: "bg-openai", role: "participant" },
  { id: "anthropic", name: "Anthropic", colorClass: "bg-anthropic", role: "participant" },
  { id: "meta", name: "Meta", colorClass: "bg-meta", role: "participant", disabled: true },
  { id: "google", name: "Google", colorClass: "bg-google", role: "participant" },
  { id: "deepseek", name: "DeepSeek", colorClass: "bg-deepseek", role: "moderator" }
];

interface AISelectorProps {
  onSelectionChange: (selectedAIs: AI[], moderator: AI) => void;
}

export const AISelector = ({ onSelectionChange }: AISelectorProps) => {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(["openai", "anthropic", "google"]);
  const [selectedModerator, setSelectedModerator] = useState<string>("deepseek");

  const handleParticipantToggle = (aiId: string) => {
    const ai = availableAIs.find(ai => ai.id === aiId);
    if (ai?.disabled) return;

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
    const ai = availableAIs.find(ai => ai.id === aiId);
    if (ai?.disabled) return;

    setSelectedModerator(aiId);
    const participants = availableAIs.filter(ai => 
      selectedParticipants.includes(ai.id) && ai.role === "participant"
    );
    const moderator = availableAIs.find(ai => ai.id === aiId)!;
    onSelectionChange(participants, moderator);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold mb-2">Select Participants (2-4)</h3>
          <div className="flex flex-wrap gap-2">
            {availableAIs.filter(ai => ai.role === "participant").map((ai) => (
              <button
                key={ai.id}
                onClick={() => handleParticipantToggle(ai.id)}
                disabled={ai.disabled || (selectedParticipants.length <= 2 && selectedParticipants.includes(ai.id))}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors text-sm ${
                  ai.disabled 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : selectedParticipants.includes(ai.id)
                    ? ai.colorClass + " text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {ai.name}
                {selectedParticipants.includes(ai.id) && !ai.disabled && <Check className="w-3 h-3" />}
                {ai.disabled && <span className="text-xs ml-1">(Coming soon)</span>}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-base font-semibold mb-2">Select Moderator</h3>
          <div className="flex flex-wrap gap-2">
            {availableAIs.filter(ai => ai.role === "moderator").map((ai) => (
              <button
                key={ai.id}
                onClick={() => handleModeratorSelect(ai.id)}
                disabled={ai.disabled}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors text-sm ${
                  ai.disabled 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : selectedModerator === ai.id
                    ? ai.colorClass + " text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {ai.name}
                {selectedModerator === ai.id && !ai.disabled && <Check className="w-3 h-3" />}
                {ai.disabled && <span className="text-xs ml-1">(Coming soon)</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};