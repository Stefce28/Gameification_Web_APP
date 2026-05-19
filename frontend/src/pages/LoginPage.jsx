import { useState } from "react";
import { LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { getAvatarUrl } from "../data/mockData.js";
import { getLoginOptions } from "../services/api.js";

export default function LoginPage({ onLogin }) {
  const users = getLoginOptions();
  const [selectedUserId, setSelectedUserId] = useState(String(users[1]?.id || users[0]?.id || 3));

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-copy">
          <span className="eyebrow">
            <Sparkles size={17} />
            Student research rewards
          </span>
          <h1>RewardHub</h1>
          <p>
            Sign in as a sample campus user and explore uploads, points, badges, friends, rankings, and shop rewards.
          </p>
        </div>

        <div className="mock-login-box">
          <div className="form-heading">
            <ShieldCheck size={21} />
            <div>
              <strong>Mock login</strong>
              <span>No password needed for this prototype.</span>
            </div>
          </div>

          <div className="login-user-grid">
            {users.map((user) => (
              <button
                className={`login-user-option ${selectedUserId === String(user.id) ? "selected" : ""}`}
                key={user.id}
                type="button"
                onClick={() => setSelectedUserId(String(user.id))}
              >
                <img src={getAvatarUrl(user.id, user.username)} alt={`${user.username} avatar`} />
                <span>{user.username}</span>
              </button>
            ))}
          </div>

          <button className="primary-button" type="button" onClick={() => onLogin(selectedUserId)}>
            <LogIn size={18} />
            Continue to Home
          </button>
        </div>
      </section>

      <aside className="login-visual" aria-label="Students working with research documents">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
          alt="Students collaborating on campus"
        />
        <div className="floating-score">
          <span>Next badge</span>
          <strong>Research Rookie</strong>
        </div>
      </aside>
    </main>
  );
}
