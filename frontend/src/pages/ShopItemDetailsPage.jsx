import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Gift, PackageCheck, ShoppingBag, XCircle } from "lucide-react";
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
  const [message, setMessage] = useState(null);
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

  const soldOut = Number(item?.quantity || 0) <= 0;
  const canPurchase = useMemo(() => {
    return profile && item && profile.currentPoints >= item.pricePoints && !soldOut;
  }, [profile, item, soldOut]);

  async function handlePurchase() {
    if (soldOut) {
      setMessage({
        type: "error",
        text: "This reward is sold out. Check back later for a restock.",
      });
      return;
    }

    if (!canPurchase) {
      setMessage({
        type: "error",
        text: "Not enough XP. Upload more research documents to unlock this reward.",
      });
      return;
    }

    setPurchasing(true);
    setMessage(null);

    try {
      await purchaseItem(userId, item.id);
      const [updatedItem, updatedProfile] = await Promise.all([getShopItem(item.id), getProfile(userId)]);
      setItem(updatedItem);
      setProfile(updatedProfile);
      setMessage({
        type: "success",
        text: "Reward unlocked! Purchase successful. Check your purchase history for the new item.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
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
          <div className="pixel-item large">
            <Gift size={72} />
          </div>
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
            {soldOut ? <XCircle size={19} /> : <CheckCircle2 size={19} />}
            {soldOut
              ? "Sold out. This reward is currently unavailable."
              : canPurchase
                ? "You have enough points to redeem this reward."
                : "Not enough points yet. Keep uploading documents to earn more."}
          </div>

          {message && (
            <div className={`reward-toast ${message.type}`}>
              {message.type === "success" ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
              <p>{message.text}</p>
            </div>
          )}

          <button className="primary-button" type="button" onClick={handlePurchase} disabled={purchasing || soldOut}>
            <ShoppingBag size={18} />
            {soldOut ? "Sold out" : purchasing ? "Purchasing..." : "Purchase item"}
          </button>
        </div>
      </section>
    </PageLayout>
  );
}
