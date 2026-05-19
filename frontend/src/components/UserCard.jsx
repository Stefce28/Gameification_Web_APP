import { Link } from "react-router-dom";
import { ArrowRight, UsersRound } from "lucide-react";
import { getAvatarUrl } from "../data/mockData.js";
import AddFriendButton from "./AddFriendButton.jsx";

export default function UserCard({ user, to, showAddFriend = false, requesterId }) {
  const destination = to || `/users/${user.id}`;

  return (
    <article className={`user-card ${showAddFriend ? "with-action" : ""}`}>
      <Link className="user-card-link" to={destination}>
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
      {showAddFriend && <AddFriendButton requesterId={requesterId} receiverId={user.id} />}
    </article>
  );
}
