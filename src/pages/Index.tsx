import { useState } from "react";
import { TopicInput } from "@/components/TopicInput";
import { DebateTimer } from "@/components/DebateTimer";
import { AIParticipant } from "@/components/AIParticipant";
import { Moderator } from "@/components/Moderator";
import { AISelector } from "@/components/AISelector";
import { ChatOutput } from "@/components/ChatOutput";
import { MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const DEBATE_DURATION = 60; // seconds

interface AI {
  id: string;
  name: string;
  colorClass: string;
  role: "participant" | "moderator";
}

interface ChatMessage {
  ai: string;
  message: string;
  timestamp: Date;
}

const Index = () => {
  const [topic, setTopic] = useState("");
  const [activeAI, setActiveAI] = useState<number>(-1);
  const [responses, setResponses] = useState<string[]>(["", "", "", ""]);
  const [summary, setSummary] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [participants, setParticipants] = useState<AI[]>([]);
  const [moderator, setModerator] = useState<AI | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [winner, setWinner] = useState<string>("");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const generateAIResponse = async (aiName: string, context: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to start the debate.",
        variant: "destructive",
      });
      setIsDebating(false);
      return null;
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: `You are ${aiName}, participating in a debate. Be concise and persuasive in your response.`
            },
            {
              role: 'user',
              content: `Topic: ${topic}. ${context}`
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please check your API key and try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const determineWinner = async () => {
    if (!moderator) return participants[0].name;
    
    const context = `Based on the following debate responses on the topic "${topic}":
      ${participants.map((p, i) => `${p.name}: ${responses[i]}`).join('\n')}
      
      Who provided the most compelling arguments? Respond with ONLY the name of the winner.`;
    
    const winnerResponse = await generateAIResponse(moderator.name, context);
    if (!winnerResponse) return participants[0].name;
    
    // Extract just the AI name from the response
    const winner = participants.find(p => winnerResponse.includes(p.name))?.name || participants[0].name;
    return winner;
  };

  const handleTopicSubmit = (newTopic: string) => {
    setTopic(newTopic);
    setActiveAI(0);
    setIsDebating(true);
    setResponses(new Array(participants.length).fill(""));
    setSummary("");
    setChatMessages([]);
    setWinner("");
  };

  const handleTimeUp = async () => {
    if (activeAI < participants.length - 1) {
      const response = await generateAIResponse(
        participants[activeAI].name,
        `Provide your perspective on the topic. Previous responses: ${responses.filter(r => r).join(' | ')}`
      );
      
      if (response) {
        setResponses(prev => {
          const newResponses = [...prev];
          newResponses[activeAI] = response;
          
          setChatMessages(prev => [...prev, {
            ai: participants[activeAI].name,
            message: response,
            timestamp: new Date()
          }]);
          
          return newResponses;
        });
        setActiveAI(activeAI + 1);
      }
    } else {
      setIsDebating(false);
      const winnerName = await determineWinner();
      setWinner(winnerName);
      const finalSummary = `After a thoughtful debate on "${topic}", ${winnerName} has been declared the winner! Their arguments were particularly compelling and well-structured.`;
      setSummary(finalSummary);
      
      setChatMessages(prev => [...prev, {
        ai: moderator?.name || "Moderator",
        message: finalSummary,
        timestamp: new Date()
      }]);
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
      <section className="bg-gradient-to-b from-purple-50 to-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Debatify
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Experience the future of intellectual discourse with our AI-powered debate platform.
            Watch as leading AI models engage in thoughtful discussions on any topic you choose.
          </p>
          
          {/* API Key Input */}
          <div className="max-w-md mx-auto mb-6">
            <Input
              type="password"
              placeholder="Enter your Perplexity API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mb-2"
            />
            <p className="text-sm text-gray-500">
              Required to generate AI responses. Get your API key from Perplexity.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-4 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
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
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
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