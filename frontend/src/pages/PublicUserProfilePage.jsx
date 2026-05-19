import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BadgeCard from "../components/BadgeCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import PointsDisplay from "../components/PointsDisplay.jsx";
import UploadPostCard from "../components/UploadPostCard.jsx";
import { getAvatarUrl } from "../data/mockData.js";
import { getPublicUser } from "../services/api.js";
import AddFriendButton from "../components/AddFriendButton.jsx";

export default function PublicUserProfilePage({ currentUserId, onLogout }) {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPublicUser(userId).then((data) => {
      if (active) {
        setUser(data);
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
        <LoadingState label="Loading public profile" />
      </PageLayout>
    );
  }

  return (
    <PageLayout onLogout={onLogout}>
      <section className="profile-hero public">
        <img src={getAvatarUrl(user.id, user.username)} alt={`${user.username} avatar`} />
        <div>
          <span className="eyebrow">Public activity</span>
          <h1>{user.username}</h1>
          <p>{user.email || "Campus contributor"}</p>
        </div>
        <div className="public-profile-actions">
          <PointsDisplay label="Total points" points={user.totalEarnedPoints} tone="gold" />
          <AddFriendButton requesterId={currentUserId} receiverId={user.id} />
        </div>
      </section>

      <div className="page-grid profile-grid">
        <section className="main-column">
          <div className="section-header compact">
            <div>
              <span className="eyebrow">Recent work</span>
              <h2>Uploads and activity</h2>
            </div>
          </div>
          <div className="feed-list">
            {user.uploads.length > 0 ? (
              user.uploads.map((upload) => <UploadPostCard key={upload.id || upload.eventId} upload={upload} />)
            ) : (
              <EmptyState title="No public uploads" message="Recent upload activity will appear here." />
            )}
          </div>
        </section>

        <aside className="side-column">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Achievements</span>
                <h2>Badges</h2>
              </div>
            </div>
            <div className="friend-list-compact">
              {user.badges.length > 0 ? (
                user.badges.map((userBadge) => (
                  <BadgeCard key={userBadge.id} badge={userBadge.badge} earnedAt={userBadge.earnedAt} />
                ))
              ) : (
                <EmptyState title="No badges yet" message="This user is still working toward their first badge." />
              )}
            </div>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
