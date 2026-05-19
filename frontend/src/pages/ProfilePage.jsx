import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeInfo, ChevronRight, History, Info, ShoppingBag, Sparkles, UsersRound } from "lucide-react";
import BadgeCard from "../components/BadgeCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import PointsDisplay from "../components/PointsDisplay.jsx";
import UploadPostCard from "../components/UploadPostCard.jsx";
import UserCard from "../components/UserCard.jsx";
import { getAvatarUrl } from "../data/mockData.js";
import { getFriendRecommendations, getUserDetails } from "../services/api.js";

export default function ProfilePage({ userId, onLogout }) {
  const [details, setDetails] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getUserDetails(userId), getFriendRecommendations(userId)]).then(([data, recommendationsData]) => {
      if (active) {
        setDetails(data);
        setRecommendations(recommendationsData);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <PageLayout onLogout={onLogout}>
        <LoadingState label="Loading profile" />
      </PageLayout>
    );
  }

  const { profile, badges, uploads } = details;

  return (
    <PageLayout onLogout={onLogout}>
      <section className="profile-console">
        <div className="profile-console-main">
          <div className="profile-hero">
            <img src={getAvatarUrl(profile.id, profile.username)} alt={`${profile.username} avatar`} />
            <div>
              <span className="eyebrow">Player profile</span>
              <h1>{profile.username}</h1>
              <p>{profile.email}</p>
            </div>
            <div className="profile-points">
              <PointsDisplay label="Current XP" points={profile.currentPoints} />
              <PointsDisplay label="Total XP" points={profile.totalEarnedPoints} tone="gold" />
            </div>
          </div>

          <section className="quick-actions">
            <Link to="/profile/friends">
              <UsersRound size={20} />
              <span>Friends list</span>
              <ChevronRight size={17} />
            </Link>
            <Link to="/profile/details">
              <Info size={20} />
              <span>Detailed information</span>
              <ChevronRight size={17} />
            </Link>
            <Link to="/profile/purchases">
              <ShoppingBag size={20} />
              <span>Purchase history</span>
              <ChevronRight size={17} />
            </Link>
          </section>

          <div className="section-header compact">
            <div>
              <span className="eyebrow">Research trail</span>
              <h2>Uploaded documents</h2>
            </div>
            <History size={22} />
          </div>
          <div className="feed-list">
            {uploads.length > 0 ? (
              uploads.map((upload) => <UploadPostCard key={upload.id} upload={upload} />)
            ) : (
              <EmptyState title="No documents yet" message="Your upload events will appear here." />
            )}
          </div>

          <div className="section-header compact">
            <div>
              <span className="eyebrow">Party finder</span>
              <h2>Friend recommendations</h2>
            </div>
            <Sparkles size={22} />
          </div>
          <div className="card-grid two recommendation-grid">
            {recommendations.length > 0 ? (
              recommendations.map((friend) => (
                <UserCard key={friend.id} user={friend} showAddFriend requesterId={userId} />
              ))
            ) : (
              <EmptyState title="No recommendations" message="All available players are already in your orbit." />
            )}
          </div>
        </div>

        <aside className="profile-badge-rail">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Achievements</span>
              <h2>Badges</h2>
            </div>
            <BadgeInfo size={22} />
          </div>
          <div className="badge-stack">
            {badges.length > 0 ? (
              badges.map((userBadge) => (
                <BadgeCard key={userBadge.id} badge={userBadge.badge} earnedAt={userBadge.earnedAt} />
              ))
            ) : (
              <EmptyState title="No badges yet" message="Upload documents to start unlocking achievements." />
            )}
          </div>
        </aside>
      </section>
    </PageLayout>
  );
}
