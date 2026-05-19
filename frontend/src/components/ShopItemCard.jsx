import { Link } from "react-router-dom";
import { ArrowRight, Gift, PackageCheck } from "lucide-react";
import { readableEnum } from "../services/formatters.js";

export default function ShopItemCard({ item, userPoints }) {
  const canBuy = Number(userPoints) >= Number(item.pricePoints);

  return (
    <Link className="shop-item-card" to={`/shop/${item.id}`}>
      <div className="shop-item-icon">
        <Gift size={25} />
      </div>
      <div className="shop-item-main">
        <div className="card-heading-row">
          <h2>{item.name}</h2>
          <span className={`availability ${item.quantity > 0 ? "available" : "empty"}`}>
            <PackageCheck size={15} />
            {item.quantity} left
          </span>
        </div>
        <p>{item.description}</p>
        <div className="shop-card-bottom">
          <span>{readableEnum(item.itemType)}</span>
          <strong>{item.pricePoints} pts</strong>
          <span className={canBuy ? "enough" : "not-enough"}>{canBuy ? "Ready to redeem" : "Save more points"}</span>
        </div>
      </div>
      <ArrowRight className="card-arrow" size={18} />
    </Link>
  );
}
