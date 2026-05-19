import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Gamepad2, Target, Trophy, UsersRound } from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import PointsDisplay from "../components/PointsDisplay.jsx";
import SearchBar from "../components/SearchBar.jsx";
import UploadPostCard from "../components/UploadPostCard.jsx";
import UserCard from "../components/UserCard.jsx";
import { getAvatarUrl } from "../data/mockData.js";
import { getFriendRecommendations, getFriends, getFriendsFeed, getGlobalFeed, getProfile } from "../services/api.js";

export default function HomePage({ userId, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [feed, setFeed] = useState([]);
  const [friends, setFriends] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadHome() {
      setLoading(true);
      const [profileData, friendsData, recommendationsData, friendsFeedData, globalFeedData] = await Promise.all([
        getProfile(userId),
        getFriends(userId),
        getFriendRecommendations(userId),
        getFriendsFeed(userId),
        getGlobalFeed(),
      ]);

      if (active) {
        setProfile(profileData);
        setFriends(friendsData);
        setRecommendations(recommendationsData);
        setFeed(friendsFeedData.length > 0 ? friendsFeedData : globalFeedData);
        setLoading(false);
      }
    }

    loadHome();
    return () => {
      active = false;
    };
  }, [userId]);

  const filteredRecommendations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return recommendations;
    }
    return recommendations.filter((friend) => friend.username.toLowerCase().includes(normalized));
  }, [recommendations, query]);

  return (
    <PageLayout onLogout={onLogout}>
      <div className="top-search-strip">
        <SearchBar value={query} onChange={setQuery} placeholder="Search players and friends" />
      </div>

      <div className="page-grid feed-layout">
        <aside className="left-rail">
          {profile && (
            <div className="profile-preview-card">
              <img src={getAvatarUrl(profile.id, profile.username)} alt={`${profile.username} avatar`} />
              <span className="eyebrow">Player profile</span>
              <h2>{profile.username}</h2>
              <PointsDisplay label="Current XP" points={profile.currentPoints} />
              <Link className="primary-button mini" to="/profile">
                Open profile
              </Link>
            </div>
          )}
        </aside>

        <section className="main-column feed-center">
          <div className="section-header">
            <div>
              <span className="eyebrow">Friends activity</span>
              <h1>Mission feed</h1>
              <p>Recent uploads from your network, with document previews and XP rewards.</p>
            </div>
          </div>

          {loading ? (
            <LoadingState label="Loading recent uploads" />
          ) : feed.length > 0 ? (
            <div className="feed-list">
              {feed.map((upload) => (
                <UploadPostCard key={upload.eventId || upload.id} upload={upload} />
              ))}
            </div>
          ) : (
            <EmptyState title="No uploads yet" message="Friend uploads will appear here as soon as they earn points." />
          )}
        </section>

        <aside className="right-rail">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Party finder</span>
                <h2>Friend recommendations</h2>
              </div>
              <UsersRound size={22} />
            </div>
            <div className="friend-list-compact">
              {filteredRecommendations.length > 0 ? (
                filteredRecommendations.slice(0, 4).map((friend) => <UserCard key={friend.id} user={friend} />)
              ) : (
                <EmptyState title="No recommendations" message="Your network is already tight." />
              )}
            </div>
            <Link className="text-link" to="/profile/friends">
              View friend list <ChevronRight size={16} />
            </Link>
          </div>

          <div className="panel game-widget">
            <div className="widget-row">
              <Gamepad2 size={22} />
              <div>
                <strong>Daily quest</strong>
                <span>Upload a quality paper and earn bonus XP.</span>
              </div>
            </div>
            <div className="widget-row">
              <Target size={22} />
              <div>
                <strong>Next milestone</strong>
                <span>Reach 100 total XP for Research Rookie.</span>
              </div>
            </div>
            <div className="widget-row">
              <Trophy size={22} />
              <div>
                <strong>Leaderboard</strong>
                <span>Climb by submitting useful scientific material.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
