import { Clock, ReceiptText } from "lucide-react";
import { formatDate, readableEnum } from "../services/formatters.js";

export default function PurchaseCard({ purchase }) {
  return (
    <article className="purchase-card">
      <div className="purchase-icon">
        <ReceiptText size={24} />
      </div>
      <div className="purchase-body">
        <div className="card-heading-row">
          <h2>{purchase.shopItem?.name || "Reward item"}</h2>
          <span className={`status-pill ${purchase.status?.toLowerCase()}`}>{readableEnum(purchase.status)}</span>
        </div>
        <div className="purchase-meta">
          <span>{purchase.pricePaid} points paid</span>
          <span>
            <Clock size={15} />
            {formatDate(purchase.purchasedAt)}
          </span>
          <span>Expires: {formatDate(purchase.expiresAt)}</span>
        </div>
      </div>
    </article>
  );
}
