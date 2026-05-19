import { Sparkles } from "lucide-react";

export default function PointsDisplay({ label, points, tone = "pink" }) {
  return (
    <div className={`points-display ${tone}`}>
      <Sparkles size={20} />
      <div>
        <span>{label}</span>
        <strong>{points ?? 0}</strong>
      </div>
    </div>
  );
}
