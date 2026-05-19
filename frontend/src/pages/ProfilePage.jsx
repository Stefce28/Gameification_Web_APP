import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeInfo, ChevronRight, History, Info, ShoppingBag, UsersRound } from "lucide-react";
import BadgeCard from "../components/BadgeCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import PointsDisplay from "../components/PointsDisplay.jsx";
import UploadPostCard from "../components/UploadPostCard.jsx";
import UserCard from "../components/UserCard.jsx";
import { getAvatarUrl } from "../data/mockData.js";
import { getUserDetails } from "../services/api.js";

export default function ProfilePage({ userId, onLogout }) {
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

  if (loading) {
    return (
      <PageLayout onLogout={onLogout}>
        <LoadingState label="Loading profile" />
      </PageLayout>
    );
  }

  const { profile, badges, uploads, friends } = details;

  return (
    <PageLayout onLogout={onLogout}>
      <section className="profile-hero">
        <img src={getAvatarUrl(profile.id, profile.username)} alt={`${profile.username} avatar`} />
        <div>
          <span className="eyebrow">Logged-in profile</span>
          <h1>{profile.username}</h1>
          <p>{profile.email}</p>
        </div>
        <div className="profile-points">
          <PointsDisplay label="Current" points={profile.currentPoints} />
          <PointsDisplay label="Total earned" points={profile.totalEarnedPoints} tone="gold" />
        </div>
      </section>

      <section className="quick-actions">
        <Link to="/profile/friends">
          <UsersRound size={20} />
          Friends list
          <ChevronRight size={17} />
        </Link>
        <Link to="/profile/details">
          <Info size={20} />
          Detailed info
          <ChevronRight size={17} />
        </Link>
        <Link to="/profile/purchases">
          <ShoppingBag size={20} />
          Purchase history
          <ChevronRight size={17} />
        </Link>
      </section>

      <div className="page-grid profile-grid">
        <section className="main-column">
          <div className="section-header compact">
            <div>
              <span className="eyebrow">Achievements</span>
              <h2>Badges</h2>
            </div>
            <BadgeInfo size={22} />
          </div>
          <div className="card-grid two">
            {badges.length > 0 ? (
              badges.map((userBadge) => (
                <BadgeCard key={userBadge.id} badge={userBadge.badge} earnedAt={userBadge.earnedAt} />
              ))
            ) : (
              <EmptyState title="No badges yet" message="Upload documents to start unlocking achievements." />
            )}
          </div>

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
        </section>

        <aside className="side-column">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Preview</span>
                <h2>Friends</h2>
              </div>
              <UsersRound size={22} />
            </div>
            <div className="friend-list-compact">
              {friends.length > 0 ? (
                friends.slice(0, 4).map((friend) => <UserCard key={friend.id} user={friend} />)
              ) : (
                <EmptyState title="No friends yet" message="Accepted friends will show up here." />
              )}
            </div>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
