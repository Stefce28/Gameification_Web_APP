import { Link } from "react-router-dom";
import { FileText, FlaskConical, MessageSquareText, Star } from "lucide-react";
import { getAvatarUrl } from "../data/mockData.js";
import { readableEnum, timeAgo } from "../services/formatters.js";

export default function UploadPostCard({ upload }) {
  const userId = upload.user?.id || upload.userId;
  const username = upload.user?.username || upload.username || "Campus user";
  const excerpt =
    upload.excerpt ||
    `Preview from ${upload.scientificField}: research notes, references, and useful context for the crowdsourcing library.`;

  return (
    <article className="upload-post-card">
      <div className="post-topline">
        <Link className="post-author" to={`/users/${userId}`}>
          <img src={getAvatarUrl(userId, username)} alt={`${username} avatar`} />
          <div>
            <strong>{username}</strong>
            <span>{timeAgo(upload.createdAt)}</span>
          </div>
        </Link>
        <span className="document-chip">
          <FileText size={15} />
          {readableEnum(upload.documentType)}
        </span>
      </div>

      <h2>{upload.title}</h2>

      <div className="document-preview">
        <MessageSquareText size={18} />
        <p>{excerpt}</p>
      </div>

      <div className="post-details">
        <span>
          <FlaskConical size={16} />
          {upload.scientificField}
        </span>
        <strong>
          <Star size={17} />
          +{upload.pointsAwarded} points
        </strong>
      </div>
    </article>
  );
}
