import { useState } from "react";
import { Check, UserPlus } from "lucide-react";
import { sendFriendRequest } from "../services/api.js";

function storageKey(requesterId, receiverId) {
  return `rewardHubFriendRequest:${requesterId}:${receiverId}`;
}

export default function AddFriendButton({ requesterId, receiverId, className = "" }) {
  const [sent, setSent] = useState(() => {
    if (!requesterId || !receiverId || Number(requesterId) === Number(receiverId)) {
      return false;
    }
    return localStorage.getItem(storageKey(requesterId, receiverId)) === "sent";
  });
  const [sending, setSending] = useState(false);

  if (!requesterId || !receiverId || Number(requesterId) === Number(receiverId)) {
    return null;
  }

  async function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (sent || sending) {
      return;
    }

    setSending(true);
    try {
      await sendFriendRequest(requesterId, receiverId);
      localStorage.setItem(storageKey(requesterId, receiverId), "sent");
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <button
      className={`friend-action-button ${sent ? "sent" : ""} ${className}`}
      type="button"
      onClick={handleClick}
      disabled={sent || sending}
    >
      {sent ? <Check size={16} /> : <UserPlus size={16} />}
      <span>{sent ? "Request Sent" : sending ? "Sending..." : "Add Friend"}</span>
    </button>
  );
}
