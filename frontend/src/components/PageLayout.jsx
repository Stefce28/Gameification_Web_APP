import Navbar from "./Navbar.jsx";

export default function PageLayout({ children, onLogout }) {
  return (
    <div className="app-shell">
      <Navbar onLogout={onLogout} />
      <main className="page-container">{children}</main>
    </div>
  );
}
