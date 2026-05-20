import { useEffect, useState } from "react";
import { Check, UserCheck, UserPlus, X } from "lucide-react";
import { cancelFriendRequest, getFriendshipStatus, sendFriendRequest } from "../services/api.js";

export default function AddFriendButton({ requesterId, receiverId, className = "" }) {
  const [status, setStatus] = useState(() => getFriendshipStatus(requesterId, receiverId));
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setStatus(getFriendshipStatus(requesterId, receiverId));
  }, [requesterId, receiverId]);

  if (status === "SELF") {
    return null;
  }

  const requestSent = status === "REQUEST_SENT";
  const friends = status === "FRIENDS";

  async function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (friends || sending) {
      return;
    }

    setSending(true);
    try {
      if (requestSent) {
        await cancelFriendRequest(requesterId, receiverId);
        setStatus("NONE");
      } else {
        await sendFriendRequest(requesterId, receiverId);
        setStatus("REQUEST_SENT");
      }
    } finally {
      setSending(false);
    }
  }

  const label = friends ? "Friends" : requestSent ? "Request Sent" : sending ? "Sending..." : "Add Friend";
  const Icon = friends ? UserCheck : requestSent ? Check : UserPlus;

  return (
    <button
      className={`friend-action-button ${requestSent ? "sent" : ""} ${friends ? "friends" : ""} ${className}`}
      type="button"
      onClick={handleClick}
      disabled={friends || sending}
      title={requestSent ? "Cancel request" : label}
    >
      <Icon size={16} />
      <span className="label-main">{label}</span>
      {requestSent && (
        <span className="label-hover">
          <X size={15} />
          Cancel Request
        </span>
      )}
    </button>
  );
}
