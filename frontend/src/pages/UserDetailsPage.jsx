import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, FileText, ReceiptText, Sparkles, UsersRound } from "lucide-react";
import BadgeCard from "../components/BadgeCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import PointsDisplay from "../components/PointsDisplay.jsx";
import UploadPostCard from "../components/UploadPostCard.jsx";
import { formatDate, readableEnum } from "../services/formatters.js";
import { getUserDetails } from "../services/api.js";

export default function UserDetailsPage({ userId, onLogout }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getUserDetails(userId).then((data) => {
      if (active) {
        setDetails(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [userId]);

  const badgeProgress = useMemo(() => {
    if (!details) {
      return [];
    }
    const earnedIds = new Set(details.badges.map((userBadge) => userBadge.badge.id));
    return details.allBadges.map((badge) => ({
      badge,
      earned: earnedIds.has(badge.id),
      progress: badge.pointsRequired === 0 ? 100 : (details.profile.totalEarnedPoints / badge.pointsRequired) * 100,
    }));
  }, [details]);

  if (loading) {
    return (
      <PageLayout onLogout={onLogout}>
        <LoadingState label="Loading detailed information" />
      </PageLayout>
    );
  }

  const { profile, pointHistory, uploads, purchases, friends } = details;

  return (
    <PageLayout onLogout={onLogout}>
      <div className="section-header">
        <div>
          <span className="eyebrow">Profile depth</span>
          <h1>Detailed information</h1>
        </div>
        <Link className="secondary-button" to="/profile/purchases">
          <ReceiptText size={18} />
          Purchase history
        </Link>
      </div>

      <section className="stats-grid">
        <PointsDisplay label="Current points" points={profile.currentPoints} />
        <PointsDisplay label="Total earned" points={profile.totalEarnedPoints} tone="gold" />
        <div className="stat-card">
          <FileText size={22} />
          <span>Uploads</span>
          <strong>{uploads.length}</strong>
        </div>
        <div className="stat-card">
          <UsersRound size={22} />
          <span>Friends</span>
          <strong>{friends.length}</strong>
        </div>
      </section>

      <div className="page-grid profile-grid">
        <section className="main-column">
          <div className="section-header compact">
            <div>
              <span className="eyebrow">Milestones</span>
              <h2>Badge progress</h2>
            </div>
            <BadgeCheck size={22} />
          </div>
          <div className="card-grid two">
            {badgeProgress.map(({ badge, earned, progress }) => (
              <BadgeCard key={badge.id} badge={badge} earnedAt={earned ? "earned" : null} progress={progress} />
            ))}
          </div>

          <div className="section-header compact">
            <div>
              <span className="eyebrow">Uploads</span>
              <h2>Upload history</h2>
            </div>
            <FileText size={22} />
          </div>
          <div className="feed-list">
            {uploads.length > 0 ? (
              uploads.map((upload) => <UploadPostCard key={upload.id} upload={upload} />)
            ) : (
              <EmptyState title="No uploads" message="Document events from the backend will appear here." />
            )}
          </div>
        </section>

        <aside className="side-column">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Points</span>
                <h2>Transaction history</h2>
              </div>
              <Sparkles size={22} />
            </div>
            <div className="timeline-list">
              {pointHistory.length > 0 ? (
                pointHistory.map((transaction) => (
                  <div className="timeline-item" key={transaction.id}>
                    <strong className={transaction.amount >= 0 ? "positive" : "negative"}>
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount}
                    </strong>
                    <div>
                      <span>{readableEnum(transaction.type)}</span>
                      <p>{transaction.reason}</p>
                      <small>{formatDate(transaction.createdAt)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState title="No transactions" message="Earned and spent points will appear here." />
              )}
            </div>

            <Link className="text-link" to="/profile/purchases">
              {purchases.length} purchases <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
