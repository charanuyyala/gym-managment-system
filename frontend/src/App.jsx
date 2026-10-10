import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, ArrowDownRight, ArrowRight, BadgeCheck, BicepsFlexed, Check,
  ChevronRight, CircleUserRound, Dumbbell, Eye, EyeOff, Flame, HeartPulse,
  LockKeyhole, LogOut, Mail, Menu, ShieldCheck, Sparkles, Trophy, Users, X
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const plans = [
  { name: "STARTER", price: "₹999", period: "/ month", description: "Build a consistent routine", features: ["Gym floor access", "Personal workout tracker", "Locker access"], featured: false },
  { name: "PRO", price: "₹1,799", period: "/ month", description: "Your next level starts here", features: ["Everything in Starter", "Group fitness classes", "Monthly progress review"], featured: true },
  { name: "ELITE", price: "₹2,999", period: "/ month", description: "The complete training experience", features: ["Everything in Pro", "Trainer consultation", "Priority class booking"], featured: false }
];

function readSession() {
  try {
    const token = localStorage.getItem("ironpulse_token");
    const user = JSON.parse(localStorage.getItem("ironpulse_user") || "null");
    return token && user ? { token, user } : null;
  } catch { return null; }
}

function App() {
  const [session, setSession] = useState(readSession);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [role, setRole] = useState("member");
  const [menuOpen, setMenuOpen] = useState(false);

  function signOut() {
    localStorage.removeItem("ironpulse_token");
    localStorage.removeItem("ironpulse_user");
    setSession(null);
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#home" aria-label="IronPulse home">
          <span className="brand-mark"><Dumbbell size={22} strokeWidth={2.5} /></span>
          <span>IRON<span className="brand-accent">PULSE</span><small>FITNESS CLUB</small></span>
        </a>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#programs" onClick={() => setMenuOpen(false)}>Programs</a>
          <a href="#membership" onClick={() => setMenuOpen(false)}>Membership</a>
        </nav>
        <div className="nav-actions">
          {session ? (
            <>
              <span className="signed-in">Hi, {session.user.name.split(" ")[0]}</span>
              <button className="button button-outline compact" onClick={signOut}><LogOut size={15} /> Sign out</button>
            </>
          ) : <button className="button button-outline compact" onClick={() => { setAuthMode("login"); setAuthOpen(true); }}>Member / Owner Login <ArrowRight size={15} /></button>}
        </div>
      </header>

      {session ? <Dashboard session={session} onSignOut={signOut} /> : (
        <main>
          <section className="hero" id="home">
            <div className="hero-copy">
              <motion.div className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
                <span className="live-dot" /> YOUR NEXT CHAPTER STARTS HERE
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .08 }}>
                BUILT BY<br />DISCIPLINE.<br /><span>DEFINED BY YOU.</span>
              </motion.h1>
              <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>
                More than a gym. A place to challenge limits, find your rhythm, and become the strongest version of yourself.
              </motion.p>
              <motion.div className="hero-buttons" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .42 }}>
                <button className="button button-primary" onClick={() => { setRole("member"); setAuthMode("register"); setAuthOpen(true); }}>START YOUR JOURNEY <ArrowRight size={17} /></button>
                <a className="text-link" href="#experience">Explore the club <ChevronRight size={16} /></a>
              </motion.div>
              <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }}>
                <div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div>
                <div><strong>YOUR COMMUNITY, YOUR PACE</strong><small>Every rep moves you forward.</small></div>
              </motion.div>
            </div>
            <motion.div className="hero-art" initial={{ opacity: 0, scale: .92, rotateY: -8 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
              <div className="art-grid" />
              <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
              <div className="hero-image" role="img" aria-label="Athlete training in a dramatic modern gym" />
              <div className="vertical-label">STRENGTH · FOCUS · CONSISTENCY</div>
              <motion.div className="floating-stat stat-top" animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <span className="stat-icon"><Flame size={18} /></span><span><small>YOUR MINDSET</small><strong>UNSTOPPABLE</strong></span>
              </motion.div>
              <motion.div className="floating-stat stat-bottom" animate={{ y: [0, 7, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
                <span className="stat-icon"><Activity size={19} /></span><span><small>PROGRESS IS PERSONAL</small><strong>ONE DAY AT A TIME</strong></span><ArrowDownRight className="stat-arrow" size={18} />
              </motion.div>
              <div className="art-index">01 <span>/ 03</span></div>
            </motion.div>
            <div className="hero-scroll"><span /> SCROLL TO DISCOVER</div>
          </section>

          <section className="ticker" aria-label="Club values"><div className="ticker-track">{Array.from({ length: 2 }).map((_, i) => <span key={i}>TRAIN SMART <b>✳</b> MOVE STRONG <b>✳</b> STAY HUMBLE <b>✳</b> REPEAT <b>✳</b> </span>)}</div></section>

          <section className="experience section-wrap" id="experience">
            <div className="section-heading"><span className="section-kicker">THE IRONPULSE DIFFERENCE</span><h2>YOUR GOALS.<br /><span>OUR OBSESSION.</span></h2></div>
            <div className="feature-grid">
              <Feature icon={<BicepsFlexed />} number="01" title="Train with purpose" text="Space, equipment and structure designed to help every session count." />
              <Feature icon={<HeartPulse />} number="02" title="Progress that lasts" text="Build sustainable habits with a plan that fits your life and your pace." />
              <Feature icon={<Trophy />} number="03" title="People who push you" text="A welcoming community that celebrates effort, milestones and consistency." />
            </div>
          </section>

          <section className="program-section" id="programs">
            <div className="program-photo" />
            <div className="program-content"><span className="section-kicker">FIND YOUR MODE</span><h2>SHOW UP.<br /><span>LEVEL UP.</span></h2><p>Whether you are taking your first step or chasing a new personal best, make the training yours.</p><div className="program-list"><div><span>01</span> Strength & conditioning <ArrowRight size={17} /></div><div><span>02</span> Functional fitness <ArrowRight size={17} /></div><div><span>03</span> Personal training <ArrowRight size={17} /></div></div></div>
          </section>

          <section className="membership section-wrap" id="membership">
            <div className="section-heading centered"><span className="section-kicker">INVEST IN YOURSELF</span><h2>CHOOSE YOUR <span>LEVEL.</span></h2><p>Simple membership options. Serious room to grow.</p></div>
            <div className="plan-grid">{plans.map((plan) => <motion.article whileHover={{ y: -8, rotateX: 2 }} transition={{ type: "spring", stiffness: 240 }} className={`plan-card ${plan.featured ? "plan-featured" : ""}`} key={plan.name}>
              {plan.featured && <div className="popular"><Sparkles size={13} /> MOST POPULAR</div>}
              <div className="plan-name">{plan.name}</div><h3>{plan.price}<small>{plan.period}</small></h3><p>{plan.description}</p><div className="plan-divider" />
              <ul>{plan.features.map(f => <li key={f}><Check size={15} />{f}</li>)}</ul>
              <button className={plan.featured ? "button button-primary full" : "button button-outline full"} onClick={() => { setRole("member"); setAuthMode("register"); setAuthOpen(true); }}>Choose {plan.name} <ArrowRight size={16} /></button>
            </motion.article>)}</div>
            <p className="plan-note">Demo prices for project presentation. Online payments are not connected.</p>
          </section>
          <footer className="footer"><a className="brand" href="#home"><span className="brand-mark"><Dumbbell size={19} /></span><span>IRON<span className="brand-accent">PULSE</span><small>FITNESS CLUB</small></span></a><span>SHOW UP FOR YOURSELF. EVERY SINGLE DAY.</span><span>© 2026 IRONPULSE</span></footer>
        </main>
      )}
      <AnimatePresence>{authOpen && <AuthModal mode={authMode} setMode={setAuthMode} role={role} setRole={setRole} onClose={() => setAuthOpen(false)} onSuccess={(data) => { setSession(data); setAuthOpen(false); }} />}</AnimatePresence>
    </div>
  );
}

function Feature({ icon, number, title, text }) {
  return <motion.article className="feature-card" whileHover={{ y: -7, rotateX: 3, rotateY: -2 }} transition={{ type: "spring", stiffness: 220 }}><div className="feature-top"><span className="feature-icon">{icon}</span><span>{number}</span></div><h3>{title}</h3><p>{text}</p><div className="feature-line" /></motion.article>;
}

function AuthModal({ mode, setMode, role, setRole, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isRegister = mode === "register";

  useEffect(() => {
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch(`${API}/auth/${isRegister ? "register" : "login"}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong.");
      localStorage.setItem("ironpulse_token", data.token);
      localStorage.setItem("ironpulse_user", JSON.stringify(data.user));
      onSuccess(data);
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Cannot reach the backend. Start the server on port 5000 and check MongoDB." : err.message);
    } finally { setBusy(false); }
  }

  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div className="auth-modal" initial={{ opacity: 0, y: 28, scale: .96, rotateX: 5 }} animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} exit={{ opacity: 0, y: 18, scale: .98 }} transition={{ type: "spring", stiffness: 240, damping: 23 }}>
      <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
      <div className="modal-mark"><Dumbbell size={24} /></div><span className="section-kicker">WELCOME TO IRONPULSE</span>
      <h2>{isRegister ? "Create your account." : "Good to see you."}</h2><p className="modal-sub">{isRegister ? "Start building your strongest routine." : "Sign in to pick up where you left off."}</p>
      <div className="role-switch"><button className={role === "member" ? "role-active" : ""} onClick={() => setRole("member")}><CircleUserRound size={17} /> Member</button><button className={role === "owner" ? "role-active" : ""} onClick={() => setRole("owner")}><ShieldCheck size={17} /> Gym Owner</button></div>
      <form onSubmit={submit}>
        {isRegister && <label className="field"><span>FULL NAME</span><div><CircleUserRound size={17} /><input autoComplete="name" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={80} /></div></label>}
        <label className="field"><span>EMAIL ADDRESS</span><div><Mail size={17} /><input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div></label>
        <label className="field"><span>PASSWORD {isRegister && <small>(8+ characters)</small>}</span><div><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} minLength={isRegister ? 8 : 1} required /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
        {error && <div className="form-error" role="alert">{error}</div>}
        <button className="button button-primary full submit-button" disabled={busy}>{busy ? "PLEASE WAIT..." : isRegister ? "CREATE ACCOUNT" : "SIGN IN"} <ArrowRight size={17} /></button>
      </form>
      <p className="auth-toggle">{isRegister ? "Already have an account?" : "New to IronPulse?"} <button onClick={() => { setError(""); setMode(isRegister ? "login" : "register"); }}> {isRegister ? "Sign in" : "Create account"}</button></p>
      {role === "owner" && isRegister && <p className="owner-warning">Demo note: owner self-registration is enabled for local testing. Restrict it before public deployment.</p>}
    </motion.div>
  </motion.div>;
}

function Dashboard({ session, onSignOut }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const endpoint = session.user.role === "owner" ? "/owner/overview" : "/member/overview";
    fetch(`${API}${endpoint}`, { headers: { Authorization: `Bearer ${session.token}` } })
      .then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.message || "Unable to load dashboard"); return d; })
      .then(d => { if (alive) setData(d); })
      .catch(e => { if (alive) setError(e.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [session]);

  async function updateStatus(id, status) {
    try {
      const r = await fetch(`${API}/owner/members/${id}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ status })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setData(prev => ({ ...prev, latestMembers: prev.latestMembers.map(m => String(m._id) === String(id) ? { ...m, membershipStatus: d.member.membershipStatus } : m) }));
    } catch (e) { setError(e.message); }
  }

  return <main className="dashboard-page">
    <div className="dashboard-head"><div><span className="section-kicker">{session.user.role === "owner" ? "OWNER CONTROL CENTER" : "MEMBER SPACE"}</span><h1>LET'S GET <span>STRONGER.</span></h1><p>Welcome back, {session.user.name}. Your next step starts today.</p></div><button className="button button-outline" onClick={onSignOut}><LogOut size={16} /> Sign out</button></div>
    {loading ? <div className="dashboard-loading"><div className="spinner" /> Loading your dashboard...</div> : error ? <div className="dashboard-error">{error}<p>Check that the backend is running and your MongoDB connection is configured.</p></div> : session.user.role === "owner" ? (
      <section className="dashboard-content">
        <div className="stats-grid">{data?.stats?.map((s) => <div className="dashboard-stat" key={s.label}><span className="dashboard-stat-icon">{s.icon === "users" ? <Users /> : s.icon === "activity" ? <Activity /> : <ShieldCheck />}</span><small>{s.label}</small><strong>{s.value}</strong><span className="stat-caption">Live from MongoDB</span></div>)}</div>
        <div className="dashboard-panel"><div className="panel-head"><div><span className="section-kicker">MEMBER DIRECTORY</span><h2>Latest sign-ups</h2></div><span className="live-pill"><span /> LIVE DATA</span></div>
          {!data?.latestMembers?.length ? <p className="empty-state">No members yet. New member registrations will appear here.</p> : <div className="member-table"><div className="member-row member-table-head"><span>MEMBER</span><span>PLAN</span><span>STATUS</span><span>UPDATE STATUS</span></div>{data.latestMembers.map(m => <div className="member-row" key={m._id}><span className="member-identity"><span className="member-avatar">{m.name.charAt(0).toUpperCase()}</span><span><strong>{m.name}</strong><small>{m.email}</small></span></span><span>{m.membership}</span><span><i className={`status-dot ${m.membershipStatus.toLowerCase()}`} />{m.membershipStatus}</span><span><select value={m.membershipStatus} onChange={e => updateStatus(m._id, e.target.value)} aria-label={`Change status for ${m.name}`}><option>Pending</option><option>Active</option><option>Expired</option></select></span></div>)}</div>}
        </div>
        <div className="security-note"><ShieldCheck size={19} /><span><strong>Owner access protected</strong><small>Owner dashboard and member status updates are checked by the backend role middleware.</small></span></div>
      </section>
    ) : (
      <section className="dashboard-content">
        <div className="member-welcome"><div><span className="section-kicker">YOUR FITNESS JOURNEY</span><h2>Every rep counts.</h2><p>Consistency beats perfection. Keep showing up for yourself.</p></div><div className="member-badge"><BadgeCheck size={22} /><span><small>MEMBERSHIP STATUS</small><strong>{data?.user?.membershipStatus || session.user.membershipStatus}</strong></span></div></div>
        <div className="member-stats"><div className="member-info-card"><span className="feature-icon"><Trophy /></span><small>YOUR PLAN</small><strong>{data?.user?.membership || "Starter"}</strong><p>Keep your momentum going.</p></div><div className="member-info-card"><span className="feature-icon"><Flame /></span><small>YOUR FOCUS</small><strong>Consistency</strong><p>One workout at a time.</p></div><div className="member-info-card"><span className="feature-icon"><HeartPulse /></span><small>YOUR MINDSET</small><strong>Progress</strong><p>Celebrate small wins.</p></div></div>
        <div className="dashboard-panel tips-panel"><div className="panel-head"><div><span className="section-kicker">A LITTLE REMINDER</span><h2>Train for the long run.</h2></div><Sparkles className="lime-icon" /></div><div className="tips-grid">{(data?.tips || []).map((tip, i) => <div className="tip-item" key={tip.title}><span>0{i + 1}</span><div><strong>{tip.title}</strong><p>{tip.detail}</p></div></div>)}</div></div>
      </section>
    )}
  </main>;
}

export default App;
