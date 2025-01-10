import { Card, CardContent } from "@/components/ui/card";

interface ChatMessage {
  ai: string;
  message: string;
  timestamp: Date;
}

interface ChatOutputProps {
  messages: ChatMessage[];
}

export const ChatOutput = ({ messages }: ChatOutputProps) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardContent className="p-4 max-h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Waiting for AI responses...
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-blue-600">{msg.ai}</span>
                  <span className="text-xs text-gray-500">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};