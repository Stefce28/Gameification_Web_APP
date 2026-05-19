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
      <div className="section-header">
        <div>
          <span className="eyebrow">Campus rankings</span>
          <h1>Leaderboard</h1>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading rankings" />
      ) : leaderboard.length > 0 ? (
        <>
          <section className="podium-grid">
            {leaderboard.slice(0, 3).map((entry) => (
              <LeaderboardCard key={entry.userId} entry={entry} />
            ))}
          </section>
          <section className="leaderboard-list">
            {leaderboard.slice(3).map((entry) => (
              <LeaderboardCard key={entry.userId} entry={entry} />
            ))}
          </section>
        </>
      ) : (
        <EmptyState title="No rankings yet" message="Users will rank here after earning points." />
      )}
    </PageLayout>
  );
}
