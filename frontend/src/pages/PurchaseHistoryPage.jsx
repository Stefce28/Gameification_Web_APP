import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import PurchaseCard from "../components/PurchaseCard.jsx";
import { getPurchases } from "../services/api.js";

export default function PurchaseHistoryPage({ userId, onLogout }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPurchases(userId).then((data) => {
      if (active) {
        setPurchases(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [userId]);

  return (
    <PageLayout onLogout={onLogout}>
      <div className="section-header">
        <div>
          <span className="eyebrow">Rewards redeemed</span>
          <h1>Purchase history</h1>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading purchases" />
      ) : purchases.length > 0 ? (
        <div className="purchase-list">
          {purchases.map((purchase) => (
            <PurchaseCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
      ) : (
        <EmptyState title="No purchases yet" message="Redeemed shop rewards will appear here." />
      )}
    </PageLayout>
  );
}
