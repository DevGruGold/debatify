import { useState } from "react";
import { TopicInput } from "@/components/TopicInput";
import { DebateTimer } from "@/components/DebateTimer";
import { AIParticipant } from "@/components/AIParticipant";
import { Moderator } from "@/components/Moderator";

const DEBATE_DURATION = 60; // seconds

const Index = () => {
  const [topic, setTopic] = useState("");
  const [activeAI, setActiveAI] = useState<number>(-1);
  const [responses, setResponses] = useState<string[]>(["", "", "", ""]);
  const [summary, setSummary] = useState("");
  const [isDebating, setIsDebating] = useState(false);

  const handleTopicSubmit = (newTopic: string) => {
    setTopic(newTopic);
    setActiveAI(0);
    setIsDebating(true);
    setResponses(["", "", "", ""]);
    setSummary("");
  };

  const handleTimeUp = () => {
    if (activeAI < 3) {
      setActiveAI(activeAI + 1);
      // In v1, we'll use mock responses. Later we'll integrate real AI APIs
      setResponses(prev => {
        const newResponses = [...prev];
        newResponses[activeAI] = `Mock response for ${topic} from AI ${activeAI + 1}`;
        return newResponses;
      });
    } else {
      setIsDebating(false);
      setSummary(`Mock summary of the debate on "${topic}"`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <TopicInput onSubmit={handleTopicSubmit} />
        
        {topic && (
          <>
            <div className="w-full max-w-md mx-auto">
              <DebateTimer
                duration={DEBATE_DURATION}
                onTimeUp={handleTimeUp}
                isActive={isDebating}
              />
            </div>

            <Moderator summary={summary} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AIParticipant
                name="OpenAI"
                response={responses[0]}
                colorClass="bg-openai"
                isActive={activeAI === 0}
              />
              <AIParticipant
                name="Anthropic"
                response={responses[1]}
                colorClass="bg-anthropic"
                isActive={activeAI === 1}
              />
              <AIParticipant
                name="Meta"
                response={responses[2]}
                colorClass="bg-meta"
                isActive={activeAI === 2}
              />
              <AIParticipant
                name="Google"
                response={responses[3]}
                colorClass="bg-google"
                isActive={activeAI === 3}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;