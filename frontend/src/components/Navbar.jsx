import { NavLink } from "react-router-dom";
import { Home, LogOut, Medal, ShoppingBag, Trophy, UserRound } from "lucide-react";

const links = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/shop", label: "Online Shop", icon: ShoppingBag },
];

export default function Navbar({ onLogout }) {
  return (
    <header className="navbar">
      <NavLink className="brand" to="/home" aria-label="RewardHub home">
        <span className="brand-mark">
          <Medal size={22} />
        </span>
        <span>RewardHub</span>
      </NavLink>

      <nav className="nav-links" aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="icon-text-button quiet" type="button" onClick={onLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </header>
  );
}
