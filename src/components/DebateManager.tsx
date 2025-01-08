import { useState, useEffect } from "react";
import { AIParticipant } from "./AIParticipant";
import { Moderator } from "./Moderator";
import { ChatOutput } from "./ChatOutput";
import { generateAIResponse } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

interface DebateManagerProps {
  participants: any[];
  moderator: any;
  topic: string;
  isDebating: boolean;
  activeAI: number;
}

export const DebateManager = ({ 
  participants, 
  moderator, 
  topic, 
  isDebating, 
  activeAI 
}: DebateManagerProps) => {
  const [responses, setResponses] = useState<string[]>(new Array(participants.length).fill(""));
  const [chatMessages, setChatMessages] = useState<Array<{ ai: string; message: string; timestamp: Date }>>([]);
  const [summary, setSummary] = useState("");
  const [winner, setWinner] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const generateResponse = async () => {
      if (!isDebating || activeAI >= participants.length || activeAI < 0) {
        console.log('Skipping response generation:', { isDebating, activeAI, participantsLength: participants.length });
        return;
      }

      const currentAI = participants[activeAI];
      if (!currentAI) {
        console.log('No current AI found for index:', activeAI);
        return;
      }

      try {
        console.log("Generating response for:", currentAI.name);
        
        const previousResponses = responses
          .slice(0, activeAI)
          .map((r, i) => participants[i]?.name + ': ' + r)
          .filter(r => r)
          .join('\n');

        const context = `Topic: "${topic}"
${previousResponses ? `Previous responses:\n${previousResponses}\n` : ''}
Provide a concise, thoughtful response (2-3 sentences) continuing the debate.`;

        console.log("Context:", context);
        
        const response = await generateAIResponse(currentAI.name, context);
        console.log("Generated response:", response);
        
        if (response) {
          setResponses(prev => {
            const newResponses = [...prev];
            newResponses[activeAI] = response;
            return newResponses;
          });

          setChatMessages(prev => [...prev, {
            ai: currentAI.name,
            message: response,
            timestamp: new Date()
          }]);
        }

      } catch (error) {
        console.error("Error generating response:", error);
        toast({
          title: "Error",
          description: "Failed to generate AI response. Please try again.",
          variant: "destructive",
        });
      }
    };

    generateResponse();
  }, [activeAI, isDebating, participants, topic, responses]);

  const determineWinner = async () => {
    if (!moderator || responses.some(r => !r)) return;

    try {
      const context = `Based on the following debate responses on the topic "${topic}":
        ${participants.map((p, i) => `${p.name}: ${responses[i]}`).join('\n')}
        
        Who provided the most compelling arguments? Respond with ONLY the name of the winner.`;
      
      const winnerResponse = await generateAIResponse(moderator.name, context);
      const winner = participants.find(p => winnerResponse.includes(p.name))?.name || participants[0].name;
      setWinner(winner);
      
      const finalSummary = `After a thoughtful debate on "${topic}", ${winner} has been declared the winner! Their arguments were particularly compelling and well-structured.`;
      setSummary(finalSummary);
      
      setChatMessages(prev => [...prev, {
        ai: moderator.name,
        message: finalSummary,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Error determining winner:", error);
      toast({
        title: "Error",
        description: "Failed to determine the winner. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Call determineWinner when all AIs have responded
  useEffect(() => {
    if (isDebating && responses.every(r => r) && !winner) {
      determineWinner();
    }
  }, [responses, isDebating, winner]);

  return (
    <div className="space-y-6">
      {moderator && <Moderator summary={summary} />}

      {winner && (
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white p-4 rounded-lg shadow-lg animate-bounce">
          <h3 className="text-xl font-bold">🏆 Winner Announced!</h3>
          <p className="mt-2">{winner} has won the debate!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {participants.map((ai, index) => (
          <AIParticipant
            key={ai.id}
            name={ai.name}
            response={responses[index]}
            colorClass={ai.colorClass}
            isActive={activeAI === index}
          />
        ))}
      </div>

      <div className="mt-6">
        <ChatOutput messages={chatMessages} />
      </div>
    </div>
  );
};