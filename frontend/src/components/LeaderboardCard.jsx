import { Link } from "react-router-dom";
import { Award, ChevronRight, Crown } from "lucide-react";
import { getAvatarUrl } from "../data/mockData.js";

export default function LeaderboardCard({ entry }) {
  const isTopThree = entry.rank <= 3;

  return (
    <Link className={`leaderboard-card rank-${entry.rank} ${isTopThree ? "podium" : ""}`} to={`/users/${entry.userId}`}>
      <div className="rank-badge">{isTopThree ? <Crown size={18} /> : entry.rank}</div>
      <img src={getAvatarUrl(entry.userId, entry.username)} alt={`${entry.username} avatar`} />
      <div className="leaderboard-main">
        <strong>{entry.username}</strong>
        <span>{entry.totalEarnedPoints} total points</span>
      </div>
      <div className="leaderboard-badges">
        <Award size={16} />
        <span>{entry.badgeCount ?? 0}</span>
      </div>
      <ChevronRight size={18} />
    </Link>
  );
}
