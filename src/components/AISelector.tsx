
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { disabledAIs } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

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
  { id: "meta", name: "Meta", colorClass: "bg-meta", role: "participant" },
  { id: "google", name: "Google", colorClass: "bg-google", role: "participant" },
  { id: "deepseek", name: "DeepSeek", colorClass: "bg-deepseek", role: "participant" }
];

interface AISelectorProps {
  onSelectionChange: (selectedAIs: AI[], moderator: AI) => void;
}

export const AISelector = ({ onSelectionChange }: AISelectorProps) => {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectedModerator, setSelectedModerator] = useState<string>("deepseek");
  const { toast } = useToast();

  // Monitor disabled AIs and update selections accordingly
  useEffect(() => {
    if (disabledAIs.size > 0) {
      // Remove disabled AIs from participants
      setSelectedParticipants(prev => {
        const newSelection = prev.filter(id => !disabledAIs.has(id.toLowerCase()));
        return newSelection.length >= 2 ? newSelection : prev;
      });

      // Change moderator if disabled
      if (disabledAIs.has(selectedModerator.toLowerCase())) {
        const availableModerator = availableAIs.find(ai => 
          !disabledAIs.has(ai.id.toLowerCase())
        );
        if (availableModerator) {
          setSelectedModerator(availableModerator.id);
          toast({
            title: "Moderator Changed",
            description: `${selectedModerator} is currently unavailable. ${availableModerator.name} has been selected as the new moderator.`,
          });
        }
      }
    }
  }, [disabledAIs]);

  const handleParticipantToggle = (aiId: string) => {
    const ai = availableAIs.find(ai => ai.id === aiId);
    if (!ai) return;

    if (disabledAIs.has(aiId.toLowerCase())) {
      toast({
        title: "AI Unavailable",
        description: `${ai.name} is currently unavailable due to API quota limits. Please try again later.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedParticipants(prev => {
      const newSelection = prev.includes(aiId)
        ? prev.filter(id => id !== aiId)
        : [...prev, aiId];
      
      // Validate selection size
      if (newSelection.length < 2) {
        toast({
          title: "Selection Required",
          description: "Please select at least 2 participants for the debate.",
        });
      }
      
      const participants = availableAIs.filter(ai => 
        newSelection.includes(ai.id)
      );
      const moderator = availableAIs.find(ai => ai.id === selectedModerator)!;
      onSelectionChange(participants, moderator);
      return newSelection;
    });
  };

  const handleModeratorSelect = (aiId: string) => {
    const ai = availableAIs.find(ai => ai.id === aiId);
    if (!ai) return;

    if (disabledAIs.has(aiId.toLowerCase())) {
      toast({
        title: "AI Unavailable",
        description: `${ai.name} is currently unavailable due to API quota limits. Please try again later.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedModerator(aiId);
    const participants = availableAIs.filter(ai => 
      selectedParticipants.includes(ai.id)
    );
    const moderator = ai;
    onSelectionChange(participants, moderator);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold mb-2">Select Participants (2-4)</h3>
          <div className="flex flex-wrap gap-2">
            {availableAIs.map((ai) => {
              const isDisabled = disabledAIs.has(ai.id.toLowerCase());
              return (
                <button
                  key={ai.id}
                  onClick={() => handleParticipantToggle(ai.id)}
                  disabled={isDisabled || (selectedParticipants.length >= 4 && !selectedParticipants.includes(ai.id))}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors text-sm ${
                    isDisabled 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      : selectedParticipants.includes(ai.id)
                        ? ai.colorClass + " text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {ai.name}
                  {selectedParticipants.includes(ai.id) && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>
        
        <div>
          <h3 className="text-base font-semibold mb-2">Select Moderator</h3>
          <div className="flex flex-wrap gap-2">
            {availableAIs.map((ai) => {
              const isDisabled = disabledAIs.has(ai.id.toLowerCase());
              return (
                <button
                  key={ai.id}
                  onClick={() => handleModeratorSelect(ai.id)}
                  disabled={isDisabled}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors text-sm ${
                    isDisabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      : selectedModerator === ai.id
                        ? ai.colorClass + " text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {ai.name}
                  {selectedModerator === ai.id && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
