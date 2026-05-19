import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import PointsDisplay from "../components/PointsDisplay.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ShopItemCard from "../components/ShopItemCard.jsx";
import { getProfile, getShopItems } from "../services/api.js";

export default function ShopPage({ userId, onLogout }) {
  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getShopItems(), getProfile(userId)]).then(([shopItems, profileData]) => {
      if (active) {
        setItems(shopItems);
        setProfile(profileData);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [userId]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return items;
    }
    return items.filter((item) => {
      const haystack = `${item.name} ${item.description} ${item.itemType}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [items, query]);

  return (
    <PageLayout onLogout={onLogout}>
      <div className="section-header">
        <div>
          <span className="eyebrow">Redeem rewards</span>
          <h1>Online shop</h1>
        </div>
        <div className="header-actions">
          {profile && <PointsDisplay label="Your points" points={profile.currentPoints} tone="gold" />}
          <SearchBar value={query} onChange={setQuery} placeholder="Search shop items" />
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading shop rewards" />
      ) : filteredItems.length > 0 ? (
        <div className="shop-grid">
          {filteredItems.map((item) => (
            <ShopItemCard key={item.id} item={item} userPoints={profile?.currentPoints || 0} />
          ))}
        </div>
      ) : (
        <EmptyState title="No rewards found" message="Try another search or check back later." />
      )}
    </PageLayout>
  );
}
