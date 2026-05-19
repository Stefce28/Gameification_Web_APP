import { Link } from "react-router-dom";
import { ArrowRight, UsersRound } from "lucide-react";
import { getAvatarUrl } from "../data/mockData.js";

export default function UserCard({ user, to }) {
  const destination = to || `/users/${user.id}`;

  return (
    <Link className="user-card" to={destination}>
      <img src={getAvatarUrl(user.id, user.username)} alt={`${user.username} avatar`} />
      <div className="user-card-body">
        <strong>{user.username}</strong>
        <span>{user.email || "Campus contributor"}</span>
      </div>
      <div className="user-card-meta">
        <UsersRound size={16} />
        <ArrowRight size={17} />
      </div>
    </Link>
  );
}
