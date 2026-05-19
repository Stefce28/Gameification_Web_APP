import { useState } from "react";
import { Gamepad2, LockKeyhole, LogIn, Mail, Sparkles } from "lucide-react";
import { getLoginOptions } from "../services/api.js";

export default function LoginPage({ onLogin }) {
  const users = getLoginOptions();
  const [email, setEmail] = useState("ana@university.local");
  const [password, setPassword] = useState("reward123");

  function handleSubmit(event) {
    event.preventDefault();
    const matchedUser = users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
    onLogin(matchedUser?.id || users[1]?.id || users[0]?.id || 3);
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-label="Mock login">
        <div className="login-copy">
          <span className="eyebrow">
            <Gamepad2 size={17} />
            Game mode enabled
          </span>
          <h1>RewardHub</h1>
          <p>Enter the research arena, earn XP from uploads, unlock rewards, and climb the campus leaderboard.</p>
        </div>

        <form className="mock-login-box" onSubmit={handleSubmit}>
          <div className="form-heading">
            <Sparkles size={21} />
            <div>
              <strong>Player login</strong>
              <span>Mock authentication for the prototype.</span>
            </div>
          </div>

          <label className="login-field">
            <span>Email</span>
            <div>
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="player@campus.local"
                required
              />
            </div>
          </label>

          <label className="login-field">
            <span>Password</span>
            <div>
              <LockKeyhole size={18} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter anything"
                required
              />
            </div>
          </label>

          <button className="primary-button" type="submit">
            <LogIn size={18} />
            Start mission
          </button>
        </form>
      </section>
    </main>
  );
}
