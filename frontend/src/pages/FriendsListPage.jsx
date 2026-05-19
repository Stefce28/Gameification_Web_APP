import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import SearchBar from "../components/SearchBar.jsx";
import UserCard from "../components/UserCard.jsx";
import { getFriendRecommendations, getFriends } from "../services/api.js";

export default function FriendsListPage({ userId, onLogout }) {
  const [friends, setFriends] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getFriends(userId), getFriendRecommendations(userId)]).then(([data, recommendationsData]) => {
      if (active) {
        setFriends(data);
        setRecommendations(recommendationsData);
        setLoading(false);
      }
    });
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

  const filteredRecommendations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return recommendations;
    }
    return recommendations.filter((friend) => friend.username.toLowerCase().includes(normalized));
  }, [recommendations, query]);

  return (
    <PageLayout onLogout={onLogout}>
      <div className="section-header">
        <div>
          <span className="eyebrow">Social circle</span>
          <h1>Friends list</h1>
        </div>
        <SearchBar value={query} onChange={setQuery} placeholder="Search accepted friends" />
      </div>

      {loading ? (
        <LoadingState label="Loading friends" />
      ) : (
        <div className="friends-page-grid">
          <section>
            <div className="section-header compact">
              <div>
                <span className="eyebrow">Accepted allies</span>
                <h2>Your friends</h2>
              </div>
            </div>
            {filteredFriends.length > 0 ? (
              <div className="card-grid three">
                {filteredFriends.map((friend) => (
                  <UserCard key={friend.id} user={friend} />
                ))}
              </div>
            ) : (
              <EmptyState title="No friends found" message="Accepted friends from the backend will appear here." />
            )}
          </section>

          <section>
            <div className="section-header compact">
              <div>
                <span className="eyebrow">Player search</span>
                <h2>Friend search results</h2>
              </div>
            </div>
            {filteredRecommendations.length > 0 ? (
              <div className="card-grid three">
                {filteredRecommendations.map((friend) => (
                  <UserCard key={friend.id} user={friend} showAddFriend requesterId={userId} />
                ))}
              </div>
            ) : (
              <EmptyState title="No players found" message="Try searching another username." />
            )}
          </section>
        </div>
      )}
    </PageLayout>
  );
}
