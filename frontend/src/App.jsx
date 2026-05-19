import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import FriendsListPage from "./pages/FriendsListPage.jsx";
import UserDetailsPage from "./pages/UserDetailsPage.jsx";
import PurchaseHistoryPage from "./pages/PurchaseHistoryPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import ShopItemDetailsPage from "./pages/ShopItemDetailsPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import PublicUserProfilePage from "./pages/PublicUserProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const STORAGE_KEY = "rewardHubUserId";

function ProtectedRoute({ userId, children }) {
  const location = useLocation();

  if (!userId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      localStorage.setItem(STORAGE_KEY, userId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [userId]);

  const handleLogin = (selectedUserId) => {
    setUserId(String(selectedUserId));
    navigate("/home", { replace: true });
  };

  const handleLogout = () => {
    setUserId("");
    navigate("/login", { replace: true });
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={userId ? "/home" : "/login"} replace />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute userId={userId}>
            <HomePage userId={userId} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute userId={userId}>
            <ProfilePage userId={userId} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/details"
        element={
          <ProtectedRoute userId={userId}>
            <UserDetailsPage userId={userId} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/friends"
        element={
          <ProtectedRoute userId={userId}>
            <FriendsListPage userId={userId} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/purchases"
        element={
          <ProtectedRoute userId={userId}>
            <PurchaseHistoryPage userId={userId} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop"
        element={
          <ProtectedRoute userId={userId}>
            <ShopPage userId={userId} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/:itemId"
        element={
          <ProtectedRoute userId={userId}>
            <ShopItemDetailsPage userId={userId} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute userId={userId}>
            <LeaderboardPage userId={userId} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:userId"
        element={
          <ProtectedRoute userId={userId}>
            <PublicUserProfilePage currentUserId={userId} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
