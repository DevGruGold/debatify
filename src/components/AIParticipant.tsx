import { cn } from "@/lib/utils";

interface AIParticipantProps {
  name: string;
  response: string;
  colorClass: string;
  isActive: boolean;
}

export const AIParticipant = ({ name, response, colorClass, isActive }: AIParticipantProps) => {
  return (
    <div
      className={cn(
        "rounded-lg p-6 transition-all duration-300",
        isActive ? "ring-2 ring-offset-2" : "opacity-70",
        colorClass
      )}
    >
      <h3 className="text-lg font-semibold mb-2 text-white">{name}</h3>
      <div className="bg-white bg-opacity-90 rounded p-4 min-h-[100px]">
        <p className="text-gray-800">{response || "Waiting..."}</p>
      </div>
    </div>
  );
};