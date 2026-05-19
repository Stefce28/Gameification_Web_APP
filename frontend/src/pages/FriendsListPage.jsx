import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import SearchBar from "../components/SearchBar.jsx";
import UserCard from "../components/UserCard.jsx";
import { getFriends } from "../services/api.js";

export default function FriendsListPage({ userId, onLogout }) {
  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getFriends(userId).then((data) => {
      if (active) {
        setFriends(data);
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
      ) : filteredFriends.length > 0 ? (
        <div className="card-grid three">
          {filteredFriends.map((friend) => (
            <UserCard key={friend.id} user={friend} />
          ))}
        </div>
      ) : (
        <EmptyState title="No friends found" message="Accepted friends from the backend will appear here." />
      )}
    </PageLayout>
  );
}
