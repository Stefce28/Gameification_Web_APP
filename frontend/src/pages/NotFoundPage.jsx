import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="state-card">
        <strong>Page not found</strong>
        <p>This route is not part of the RewardHub prototype.</p>
        <Link className="primary-button" to="/home">
          Go home
        </Link>
      </section>
    </main>
  );
}
