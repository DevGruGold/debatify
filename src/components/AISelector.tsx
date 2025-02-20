
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
  const [selectedModerator, setSelectedModerator] = useState<string>("");
  const { toast } = useToast();

  // Initial check for disabled AIs
  useEffect(() => {
    const testAIs = async () => {
      for (const ai of availableAIs) {
        try {
          const response = await fetch('/api/test-ai-availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aiName: ai.id })
          });
          
          if (!response.ok) {
            disabledAIs.add(ai.id.toLowerCase());
          }
        } catch (error) {
          console.error(`Error testing ${ai.name} availability:`, error);
          disabledAIs.add(ai.id.toLowerCase());
        }
      }
    };
    testAIs();
  }, []);

  // Monitor disabled AIs and update selections accordingly
  useEffect(() => {
    if (disabledAIs.size > 0) {
      // Remove disabled AIs from participants
      setSelectedParticipants(prev => {
        const newSelection = prev.filter(id => !disabledAIs.has(id.toLowerCase()));
        return newSelection;
      });

      // Change moderator if disabled
      if (selectedModerator && disabledAIs.has(selectedModerator.toLowerCase())) {
        setSelectedModerator("");
        toast({
          title: "Moderator Unavailable",
          description: `${selectedModerator} is currently unavailable. Please select a new moderator.`,
        });
      }
    }
  }, [disabledAIs, selectedModerator]);

  const handleParticipantToggle = (aiId: string) => {
    const ai = availableAIs.find(ai => ai.id === aiId);
    if (!ai) return;

    if (disabledAIs.has(aiId.toLowerCase())) {
      toast({
        title: "AI Unavailable",
        description: `${ai.name} is currently unavailable. Please try again later.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedParticipants(prev => {
      const newSelection = prev.includes(aiId)
        ? prev.filter(id => id !== aiId)
        : [...prev, aiId];

      // Update parent component only if we have valid selections
      if (newSelection.length >= 2 && selectedModerator) {
        const participants = availableAIs.filter(ai => 
          newSelection.includes(ai.id)
        );
        const moderator = availableAIs.find(ai => ai.id === selectedModerator)!;
        onSelectionChange(participants, moderator);
      }

      return newSelection;
    });
  };

  const handleModeratorSelect = (aiId: string) => {
    const ai = availableAIs.find(ai => ai.id === aiId);
    if (!ai) return;

    if (disabledAIs.has(aiId.toLowerCase())) {
      toast({
        title: "AI Unavailable",
        description: `${ai.name} is currently unavailable. Please try again later.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedModerator(aiId);
    
    // Update parent component only if we have valid selections
    if (selectedParticipants.length >= 2) {
      const participants = availableAIs.filter(ai => 
        selectedParticipants.includes(ai.id)
      );
      onSelectionChange(participants, ai);
    }
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
          {selectedParticipants.length > 0 && selectedParticipants.length < 2 && (
            <p className="text-sm text-amber-600 mt-2">Please select at least 2 participants.</p>
          )}
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
          {!selectedModerator && (
            <p className="text-sm text-amber-600 mt-2">Please select a moderator.</p>
          )}
        </div>
      </div>
    </div>
  );
};
