import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, UsersRound } from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import PointsDisplay from "../components/PointsDisplay.jsx";
import SearchBar from "../components/SearchBar.jsx";
import UploadPostCard from "../components/UploadPostCard.jsx";
import UserCard from "../components/UserCard.jsx";
import { getFriends, getFriendsFeed, getGlobalFeed, getProfile } from "../services/api.js";

export default function HomePage({ userId, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [feed, setFeed] = useState([]);
  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadHome() {
      setLoading(true);
      const [profileData, friendsData, friendsFeedData, globalFeedData] = await Promise.all([
        getProfile(userId),
        getFriends(userId),
        getFriendsFeed(userId),
        getGlobalFeed(),
      ]);

      if (active) {
        setProfile(profileData);
        setFriends(friendsData);
        setFeed(friendsFeedData.length > 0 ? friendsFeedData : globalFeedData);
        setLoading(false);
      }
    }

    loadHome();
    return () => {
      active = false;
    };
  }, [userId]);

  const filteredFriends = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return friends;
    }
    return friends.filter((friend) => friend.username.toLowerCase().includes(normalized));
  }, [friends, query]);

  return (
    <PageLayout onLogout={onLogout}>
      <div className="page-grid feed-layout">
        <section className="main-column">
          <div className="section-header">
            <div>
              <span className="eyebrow">Friends activity</span>
              <h1>Home feed</h1>
            </div>
            {profile && <PointsDisplay label="Current points" points={profile.currentPoints} />}
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

        <aside className="side-column">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Campus circle</span>
                <h2>Find friends</h2>
              </div>
              <UsersRound size={22} />
            </div>
            <SearchBar value={query} onChange={setQuery} placeholder="Search friends" />
            <div className="friend-list-compact">
              {filteredFriends.length > 0 ? (
                filteredFriends.slice(0, 4).map((friend) => <UserCard key={friend.id} user={friend} />)
              ) : (
                <EmptyState title="No match" message="Try another username." />
              )}
            </div>
            <Link className="text-link" to="/profile/friends">
              View all friends <ChevronRight size={16} />
            </Link>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
