import { Award } from "lucide-react";

export default function BadgeCard({ badge, earnedAt, progress = 100 }) {
  const safeProgress = Math.max(0, Math.min(progress, 100));

  return (
    <article className="badge-card">
      <div className="badge-symbol">
        <Award size={24} />
      </div>
      <div className="badge-card-body">
        <strong>{badge.name}</strong>
        <span>{badge.description}</span>
        <div className="progress-track" aria-label={`${safeProgress}% badge progress`}>
          <div style={{ width: `${safeProgress}%` }} />
        </div>
        <small>{earnedAt ? "Earned" : `${safeProgress}% progress`}</small>
      </div>
    </article>
  );
}
