import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import LeaderboardCard from "../components/LeaderboardCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import { getLeaderboard } from "../services/api.js";

export default function LeaderboardPage({ onLogout }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getLeaderboard().then((data) => {
      if (active) {
        setLeaderboard(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageLayout onLogout={onLogout}>
      <div className="section-header leaderboard-heading">
        <div>
          <span className="eyebrow">Campus rankings</span>
          <h1>Leaderboard</h1>
          <p>Top contributors stack their XP here. Click any player to inspect their public activity.</p>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading rankings" />
      ) : leaderboard.length > 0 ? (
        <section className="leaderboard-arena">
          <div className="leaderboard-list">
            {leaderboard.map((entry) => (
              <LeaderboardCard key={entry.userId} entry={entry} />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState title="No rankings yet" message="Users will rank here after earning points." />
      )}
    </PageLayout>
  );
}
