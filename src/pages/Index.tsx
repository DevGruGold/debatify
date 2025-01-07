import { useState } from "react";
import { TopicInput } from "@/components/TopicInput";
import { DebateTimer } from "@/components/DebateTimer";
import { AIParticipant } from "@/components/AIParticipant";
import { Moderator } from "@/components/Moderator";
import { AISelector } from "@/components/AISelector";
import { MessageSquare, Send } from "lucide-react";

const DEBATE_DURATION = 60; // seconds

interface AI {
  id: string;
  name: string;
  colorClass: string;
  role: "participant" | "moderator";
}

const Index = () => {
  const [topic, setTopic] = useState("");
  const [activeAI, setActiveAI] = useState<number>(-1);
  const [responses, setResponses] = useState<string[]>(["", "", "", ""]);
  const [summary, setSummary] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [participants, setParticipants] = useState<AI[]>([]);
  const [moderator, setModerator] = useState<AI | null>(null);

  const handleTopicSubmit = (newTopic: string) => {
    setTopic(newTopic);
    setActiveAI(0);
    setIsDebating(true);
    setResponses(new Array(participants.length).fill(""));
    setSummary("");
  };

  const handleTimeUp = () => {
    if (activeAI < participants.length - 1) {
      setActiveAI(activeAI + 1);
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

  const handleAISelection = (selectedParticipants: AI[], selectedModerator: AI) => {
    setParticipants(selectedParticipants);
    setModerator(selectedModerator);
    setResponses(new Array(selectedParticipants.length).fill(""));
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'm interested in learning more about Debatify.");
    window.open(`https://wa.me/50661500559?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Debatify
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Experience the future of intellectual discourse with our AI-powered debate platform.
            Watch as leading AI models engage in thoughtful discussions on any topic you choose.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <AISelector onSelectionChange={handleAISelection} />
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

              {moderator && <Moderator summary={summary} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-300 mb-4">
                Have questions about Debatify? We'd love to hear from you.
              </p>
              <a
                href="mailto:xmrtsolutions@gmail.com"
                className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
              >
                <Send className="w-5 h-5" />
                xmrtsolutions@gmail.com
              </a>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Quick Connect</h3>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 text-white hover:text-green-300 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Chat with us on WhatsApp
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Debatify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;