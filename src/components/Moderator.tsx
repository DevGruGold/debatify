interface ModeratorProps {
  summary: string;
}

export const Moderator = ({ summary }: ModeratorProps) => {
  return (
    <div className="bg-deepseek text-white p-6 rounded-lg mb-8">
      <h3 className="text-lg font-semibold mb-2">DeepSeek (Moderator)</h3>
      <div className="bg-white bg-opacity-10 rounded p-4">
        <p>{summary || "Welcome to the AI Debate Platform. Enter a topic to begin the debate."}</p>
      </div>
    </div>
  );
};