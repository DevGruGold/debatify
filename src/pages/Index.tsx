
import { useState } from "react";
import { TopicInput } from "@/components/TopicInput";
import { DebateTimer } from "@/components/DebateTimer";
import { AISelector } from "@/components/AISelector";
import { DebateManager } from "@/components/DebateManager";
import { MessageSquare, Send } from "lucide-react";

const DEBATE_DURATION = 30; // Increased to 30 seconds per exchange for more thoughtful responses

const Index = () => {
  const [topic, setTopic] = useState("");
  const [activeAI, setActiveAI] = useState<number>(-1);
  const [isDebating, setIsDebating] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [moderator, setModerator] = useState<any>(null);

  const handleTopicSubmit = (newTopic: string) => {
    if (!participants.length) {
      alert("Please select AI participants first!");
      return;
    }
    setTopic(newTopic);
    setActiveAI(0);
    setIsDebating(true);
  };

  const handleTimeUp = () => {
    setActiveAI((prev) => {
      if (prev >= participants.length - 1) {
        setIsDebating(false);
        return -1;
      }
      return prev + 1;
    });
  };

  const handleAISelection = (selectedParticipants: any[], selectedModerator: any) => {
    // Ensure we have at least two participants for a debate
    if (selectedParticipants.length < 2) {
      alert("Please select at least two AI participants for the debate.");
      return;
    }
    setParticipants(selectedParticipants);
    setModerator(selectedModerator);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'm interested in learning more about Debatify.");
    window.open(`https://wa.me/50661500559?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Debatify
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Experience the future of intellectual discourse with our AI-powered debate platform.
            Watch as leading AI models engage in thoughtful discussions on any topic you choose.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-4 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Setup Your Debate</h2>
            <AISelector onSelectionChange={handleAISelection} />
            {!isDebating && participants.length >= 2 && (
              <TopicInput onSubmit={handleTopicSubmit} />
            )}
          </div>
          
          {topic && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-full max-w-md mx-auto mb-6">
                <DebateTimer
                  duration={DEBATE_DURATION}
                  onTimeUp={handleTimeUp}
                  isActive={isDebating}
                />
              </div>

              <DebateManager
                participants={participants}
                moderator={moderator}
                topic={topic}
                isDebating={isDebating}
                activeAI={activeAI}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-3">Contact Us</h3>
              <p className="text-gray-300 mb-3">
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
              <h3 className="text-xl font-bold mb-3">Quick Connect</h3>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 text-white hover:text-green-300 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Chat with us on WhatsApp
              </button>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Debatify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
