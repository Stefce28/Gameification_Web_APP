import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Gift, PackageCheck, ShoppingBag } from "lucide-react";
import LoadingState from "../components/LoadingState.jsx";
import PageLayout from "../components/PageLayout.jsx";
import PointsDisplay from "../components/PointsDisplay.jsx";
import { getProfile, getShopItem, purchaseItem } from "../services/api.js";
import { readableEnum } from "../services/formatters.js";

export default function ShopItemDetailsPage({ userId, onLogout }) {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getShopItem(itemId), getProfile(userId)]).then(([itemData, profileData]) => {
      if (active) {
        setItem(itemData);
        setProfile(profileData);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [itemId, userId]);

  const canPurchase = useMemo(() => {
    return profile && item && profile.currentPoints >= item.pricePoints && item.quantity > 0;
  }, [profile, item]);

  async function handlePurchase() {
    if (!canPurchase) {
      setMessage("You are close. Earn a few more points and this reward is yours.");
      return;
    }

    setPurchasing(true);
    setMessage("");

    try {
      await purchaseItem(userId, item.id);
      const [updatedItem, updatedProfile] = await Promise.all([getShopItem(item.id), getProfile(userId)]);
      setItem(updatedItem);
      setProfile(updatedProfile);
      setMessage("Purchase complete. Your reward is now in purchase history.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setPurchasing(false);
    }
  }

  if (loading) {
    return (
      <PageLayout onLogout={onLogout}>
        <LoadingState label="Loading reward details" />
      </PageLayout>
    );
  }

  return (
    <PageLayout onLogout={onLogout}>
      <Link className="text-link back-link" to="/shop">
        <ArrowLeft size={16} />
        Back to shop
      </Link>

      <section className="shop-detail">
        <div className="shop-detail-visual">
          <Gift size={72} />
        </div>
        <div className="shop-detail-body">
          <span className="eyebrow">{readableEnum(item.itemType)}</span>
          <h1>{item.name}</h1>
          <p>{item.description}</p>

          <div className="stats-grid detail-stats">
            <PointsDisplay label="Your points" points={profile.currentPoints} />
            <PointsDisplay label="Price" points={item.pricePoints} tone="gold" />
            <div className="stat-card">
              <PackageCheck size={22} />
              <span>Available</span>
              <strong>{item.quantity}</strong>
            </div>
          </div>

          <div className={`purchase-message ${canPurchase ? "ready" : "wait"}`}>
            <CheckCircle2 size={19} />
            {canPurchase
              ? "You have enough points to redeem this reward."
              : "Not enough points yet. Keep uploading documents to earn more."}
          </div>

          {message && <p className="inline-message">{message}</p>}

          <button className="primary-button" type="button" onClick={handlePurchase} disabled={purchasing}>
            <ShoppingBag size={18} />
            {purchasing ? "Purchasing..." : "Purchase item"}
          </button>
        </div>
      </section>
    </PageLayout>
  );
}
