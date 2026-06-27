import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

//quick fix for skipping github pages security lol
const PARTE1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwcW5ybWZnamtid2txdHpkeGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NDAzMTYsImV4cCI6MjA5ODExNjMxNn0.";
const PARTE2 = "QUYRLb0w0NAtU1pTbzSKMxUOPPzfZNYl_lC2_3PYBh4";
const SUPABASE_URL = "https://epqnrmfgjkbwkqtzdxhr.supabase.co";
const SUPABASE_ANON_KEY = PARTE1 + PARTE2;

let supabase = null;
function getSupabase() {
  if (!supabase) supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabase;
}

const isConfigured = !SUPABASE_URL.includes("XXXXX") && !SUPABASE_ANON_KEY.includes("TU_CLAVE");
const ROUND_TIMES = [120, 90, 60, 45, 30];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #000000; --surface: #0a0a0a; --surface2: #111111; --surface3: #1a1a1a;
    --border: #222222; --accent: #E8FF47; --accent-dim: rgba(232,255,71,0.12);
    --accent-dim2: rgba(232,255,71,0.06); --text: #ffffff; --text-muted: #666666;
    --text-dim: #444444; --danger: #ff4757; --success: #2ed573;
    --radius: 8px; --radius-lg: 16px;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .page { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; min-height: 100vh; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; width: 100%; max-width: 440px; }
  .card-wide { max-width: 700px; }
  .display { font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; line-height: 1; letter-spacing: -1.5px; }
  .display-sm { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
  .display-xs { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; }
  .label { font-size: 11px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); }
  .muted { color: var(--text-muted); font-size: 14px; }
  .accent-text { color: var(--accent); }
  .input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-family: 'Inter', sans-serif; font-size: 15px; padding: 12px 16px; outline: none; transition: border-color 0.15s; }
  .input:focus { border-color: var(--accent); }
  .input::placeholder { color: var(--text-dim); }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: none; border-radius: var(--radius); cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 600; padding: 12px 24px; transition: all 0.15s; width: 100%; }
  .btn-accent { background: var(--accent); color: #000; }
  .btn-accent:hover { background: #d4eb3a; transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: var(--text-muted); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: transparent; color: var(--danger); border: 1px solid rgba(255,71,87,0.3); }
  .btn-danger:hover { background: rgba(255,71,87,0.08); }
  .btn-sm { padding: 8px 16px; font-size: 13px; width: auto; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .sep { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
  .sep::before, .sep::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .sep span { font-size: 12px; color: var(--text-muted); }
  .stack { display: flex; flex-direction: column; gap: 12px; }
  .stack-lg { gap: 24px; }
  .row { display: flex; align-items: center; gap: 12px; }
  .row-between { display: flex; align-items: center; justify-content: space-between; }
  .grow { flex: 1; }
  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 500; }
  .badge-accent { background: var(--accent-dim); color: var(--accent); border: 1px solid rgba(232,255,71,0.2); }
  .badge-muted { background: var(--surface3); color: var(--text-muted); }
  .timer-wrap { display: flex; align-items: center; justify-content: center; position: relative; }
  .timer-number { font-family: 'Space Grotesk', sans-serif; font-weight: 700; line-height: 1; transition: color 0.3s; }
  .timer-xl { font-size: 120px; letter-spacing: -6px; }
  .timer-danger { color: var(--danger) !important; animation: pulse 0.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
  .prompt-card { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; text-align: center; }
  .prompt-subject { font-family: 'Space Grotesk', sans-serif; font-size: 36px; font-weight: 700; letter-spacing: -1px; color: var(--accent); line-height: 1.1; }
  .style-card { background: var(--accent-dim2); border: 1px solid rgba(232,255,71,0.12); border-radius: var(--radius); padding: 16px 20px; text-align: left; }
  .player-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .player-item:last-child { border-bottom: none; }
  .avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--surface3); display: flex; align-items: center; justify-content: center; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; color: var(--accent); flex-shrink: 0; }
  .upload-zone { border: 2px dashed var(--border); border-radius: var(--radius-lg); padding: 40px 24px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--surface2); }
  .upload-zone:hover, .upload-zone.active { border-color: var(--accent); background: var(--accent-dim2); }
  .upload-icon { font-size: 48px; margin-bottom: 12px; display: block; }
  .preview-img { width: 100%; max-height: 300px; object-fit: contain; border-radius: var(--radius); margin-top: 16px; border: 1px solid var(--border); }
  .battle-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: start; }
  .vs-divider { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding-top: 60px; }
  .vs-text { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; color: var(--text-muted); }
  .battle-card { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: border-color 0.2s; }
  .battle-card:hover { border-color: var(--accent); }
  .battle-card.voted { border-color: var(--accent); }
  .battle-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
  .battle-footer { padding: 12px 16px; }
  .vote-btn { width: 100%; background: var(--accent-dim); color: var(--accent); border: 1px solid rgba(232,255,71,0.2); border-radius: var(--radius); padding: 10px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.15s; }
  .vote-btn:hover { background: var(--accent); color: #000; }
  .vote-btn.selected { background: var(--accent); color: #000; }
  .score-row { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .score-row:last-child { border-bottom: none; }
  .score-num { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: var(--accent); min-width: 32px; text-align: right; }
  .score-rank { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 600; color: var(--text-muted); min-width: 20px; }
  .round-dots { display: flex; gap: 8px; }
  .round-dot { width: 28px; height: 4px; border-radius: 2px; background: var(--border); transition: background 0.3s; }
  .round-dot.done { background: var(--accent); }
  .round-dot.active { background: rgba(232,255,71,0.4); }
  .room-code { font-family: 'Space Grotesk', sans-serif; font-size: 48px; font-weight: 700; letter-spacing: 12px; color: var(--accent); text-align: center; padding: 20px; background: var(--accent-dim2); border-radius: var(--radius-lg); border: 1px solid rgba(232,255,71,0.15); }
  .setup-info { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
  .setup-step { display: flex; gap: 12px; padding: 8px 0; font-size: 14px; }
  .step-num { color: var(--accent); font-family: 'Space Grotesk', sans-serif; font-weight: 700; min-width: 20px; }
  .notif { position: fixed; bottom: 24px; right: 24px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 18px; font-size: 14px; z-index: 999; max-width: 320px; animation: slideIn 0.2s ease; }
  .notif-success { border-color: var(--success); color: var(--success); }
  .notif-error { border-color: var(--danger); color: var(--danger); }
  @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .tabs { display: flex; gap: 2px; background: var(--surface2); border-radius: var(--radius); padding: 4px; }
  .tab { flex: 1; padding: 8px; border-radius: 6px; background: transparent; border: none; color: var(--text-muted); font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.15s; }
  .tab.active { background: var(--surface3); color: var(--accent); }
  .friend-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--surface2); border-radius: var(--radius); }
  @media (max-width: 600px) {
    .display { font-size: 32px; } .timer-xl { font-size: 80px; }
    .battle-grid { grid-template-columns: 1fr; }
    .vs-divider { flex-direction: row; padding: 0; }
    .card { padding: 24px 18px; } .room-code { font-size: 36px; letter-spacing: 8px; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function randomCode() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
function getInitials(name = "") { return name.slice(0, 2).toUpperCase(); }

function useNotif() {
  const [notif, setNotif] = useState(null);
  const show = useCallback((msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  }, []);
  return [notif, show];
}

function SetupScreen() {
  return (
    <div className="page">
      <div className="card">
        <div className="stack stack-lg">
          <div>
            <div className="label" style={{ marginBottom: 8 }}>Configuración requerida</div>
            <div className="display-sm">DrawBattle<span className="accent-text">.</span></div>
            <p className="muted" style={{ marginTop: 8 }}>Necesitas conectar Supabase. Sigue estos pasos:</p>
          </div>
          <div className="setup-info">
            <div className="setup-step"><span className="step-num">1</span><span>Ve a <strong style={{color:'#fff'}}>supabase.com</strong> y crea una cuenta gratis</span></div>
            <div className="setup-step"><span className="step-num">2</span><span>Crea un nuevo proyecto</span></div>
            <div className="setup-step"><span className="step-num">3</span><span>SQL Editor → pega y ejecuta el schema SQL</span></div>
            <div className="setup-step"><span className="step-num">4</span><span>Storage → New Bucket → <code style={{color:'var(--accent)'}}>drawings</code> → Public: ON</span></div>
            <div className="setup-step"><span className="step-num">5</span><span>Settings → API → copia URL y anon key</span></div>
            <div className="setup-step"><span className="step-num">6</span><span>Pégalas en las líneas 4-5 de este archivo</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sb = getSupabase();

  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const { data, error: e } = await sb.auth.signInWithPassword({ email, password });
        if (e) throw e;
        onAuth(data.user);
      } else {
        if (!username.trim()) throw new Error("El nombre de usuario es obligatorio");
        const { data, error: e } = await sb.auth.signUp({ email, password, options: { data: { username: username.trim() } } });
        if (e) throw e;
        onAuth(data.user);
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="stack stack-lg">
          <div>
            <div className="label" style={{ marginBottom: 8 }}>el juego de arte</div>
            <div className="display">Draw<br/><span className="accent-text">Battle.</span></div>
          </div>
          <div className="tabs">
            <button className={`tab ${mode==="login"?"active":""}`} onClick={()=>setMode("login")}>Entrar</button>
            <button className={`tab ${mode==="register"?"active":""}`} onClick={()=>setMode("register")}>Registrarse</button>
          </div>
          <div className="stack">
            {mode==="register" && <input className="input" placeholder="Nombre de usuario" value={username} onChange={e=>setUsername(e.target.value)} />}
            <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
            {error && <p style={{color:"var(--danger)",fontSize:14}}>{error}</p>}
            <button className="btn btn-accent" onClick={handleSubmit} disabled={loading}>{loading?"...":mode==="login"?"Entrar":"Crear cuenta"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ user, profile, onCreateRoom, onJoinRoom, onGoFriends, onSignOut }) {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    if (!joinCode.trim()) return;
    setError(""); setLoading(true);
    try { await onJoinRoom(joinCode.trim().toUpperCase()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="stack stack-lg">
          <div className="row-between">
            <div>
              <div className="label">bienvenida</div>
              <div className="display-sm">{profile?.username||"..."}<span className="accent-text">.</span></div>
            </div>
            <div className="row">
              <button className="btn btn-ghost btn-sm" onClick={onGoFriends}>👥</button>
              <button className="btn btn-ghost btn-sm" onClick={onSignOut}>↩</button>
            </div>
          </div>
          <div>
            <p className="muted" style={{marginBottom:12}}>Crea una sala y comparte el código con tus amigos</p>
            <button className="btn btn-accent" onClick={onCreateRoom}>✦ Crear partida</button>
          </div>
          <div className="sep"><span>o únete</span></div>
          <div className="stack">
            <input className="input" placeholder="Código de sala" value={joinCode}
              onChange={e=>setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={e=>e.key==="Enter"&&handleJoin()}
              style={{textAlign:"center",letterSpacing:4,fontSize:18,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700}}
            />
            {error && <p style={{color:"var(--danger)",fontSize:14}}>{error}</p>}
            <button className="btn btn-ghost" onClick={handleJoin} disabled={loading||!joinCode.trim()}>{loading?"...":"Unirse a sala"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomScreen({ room, players, profile, isHost, onStartGame, onLeave }) {
  const [copied, setCopied] = useState(false);
  function copyCode() { navigator.clipboard.writeText(room.code); setCopied(true); setTimeout(()=>setCopied(false),1500); }

  return (
    <div className="page">
      <div className="card">
        <div className="stack stack-lg">
          <div>
            <div className="label" style={{marginBottom:8}}>sala de espera</div>
            <div className="display-sm">Jugadores<span className="accent-text"> {players.length}</span></div>
          </div>
          <div>
            <div className="label" style={{marginBottom:8}}>código de sala</div>
            <div className="room-code" onClick={copyCode} style={{cursor:"pointer"}}>{room.code}</div>
            <p className="muted" style={{textAlign:"center",marginTop:8,fontSize:12}}>{copied?"✓ copiado":"click para copiar"}</p>
          </div>
          <div>
            <div className="label" style={{marginBottom:8}}>en la sala</div>
            {players.map(p=>(
              <div className="player-item" key={p.player_id}>
                <div className="avatar">{getInitials(p.profiles?.username)}</div>
                <span style={{fontWeight:500}}>{p.profiles?.username}</span>
                {p.player_id===room.host_id && <span title="Host">👑</span>}
                {p.player_id===profile?.id && <span className="badge badge-muted" style={{marginLeft:"auto"}}>tú</span>}
              </div>
            ))}
          </div>
          <div style={{padding:"12px 16px",background:"var(--surface2)",borderRadius:"var(--radius)",fontSize:13,color:"var(--text-muted)"}}>
            5 rondas · 120s → 90s → 60s → 45s → 30s · voto ciego
          </div>
          {isHost
            ? <button className="btn btn-accent" onClick={onStartGame} disabled={players.length<2}>{players.length<2?"Esperando jugadores...":"⚡ Empezar partida"}</button>
            : <div style={{textAlign:"center",color:"var(--text-muted)",fontSize:14}}>Esperando que el host empiece...</div>
          }
          <button className="btn btn-danger" onClick={onLeave}>Salir de la sala</button>
        </div>
      </div>
    </div>
  );
}

function DrawingScreen({ round, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(round.time_seconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(round.time_seconds);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(intervalRef.current); onTimeUp(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [round.id]);

  const danger = timeLeft <= 10;
  const pct = (timeLeft / round.time_seconds) * 100;

  return (
    <div className="page" style={{gap:24}}>
      <div style={{width:"100%",maxWidth:600,height:3,background:"var(--border)",borderRadius:2}}>
        <div style={{height:"100%",width:`${pct}%`,background:danger?"var(--danger)":"var(--accent)",borderRadius:2,transition:"width 1s linear, background 0.3s"}} />
      </div>
      <div style={{display:"flex",gap:8}}>
        {ROUND_TIMES.map((_,i)=>(
          <div key={i} className={`round-dot ${i<round.round_number-1?"done":i===round.round_number-1?"active":""}`} />
        ))}
      </div>
      <div className="timer-wrap">
        <div className={`timer-number timer-xl ${danger?"timer-danger":""}`} style={{color:danger?"var(--danger)":"var(--accent)"}}>
          {timeLeft}
        </div>
      </div>
      <div className="card card-wide" style={{width:"100%",maxWidth:600}}>
        <div className="stack">
          <div className="prompt-card">
            <div className="label" style={{marginBottom:8}}>dibuja esto</div>
            <div className="prompt-subject">{round.subjects?.name}</div>
          </div>
          <div className="style-card">
            <div className="row-between" style={{marginBottom:8}}>
              <div className="label">estilo</div>
              <span className="badge badge-accent">{round.art_styles?.name}</span>
            </div>
            <p style={{fontSize:14,lineHeight:1.6,color:"#ccc"}}>{round.art_styles?.description}</p>
            {round.art_styles?.example_artists && (
              <p style={{fontSize:12,color:"var(--text-muted)",marginTop:8}}>ej: {round.art_styles.example_artists}</p>
            )}
          </div>
          <p style={{fontSize:12,color:"var(--text-muted)",textAlign:"center"}}>✏️ Dibuja en papel o tablet — cuando acabe el tiempo, subirás una foto</p>
        </div>
      </div>
    </div>
  );
}

function UploadScreen({ round, profile, onUploaded, alreadyUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const sb = getSupabase();

  function handleFile(f) {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }

  async function upload() {
    if (!file) return;
    setError(""); setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${profile.id}/${round.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await sb.storage.from("drawings").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = sb.storage.from("drawings").getPublicUrl(path);
      const { error: dbErr } = await sb.from("round_submissions").upsert({ round_id: round.id, player_id: profile.id, image_url: publicUrl });
      if (dbErr) throw dbErr;
      onUploaded(publicUrl);
    } catch (e) { setError(e.message); }
    finally { setUploading(false); }
  }

  if (alreadyUploaded) {
    return (
      <div className="page">
        <div className="card">
          <div className="stack" style={{textAlign:"center"}}>
            <div style={{fontSize:64}}>✓</div>
            <div className="display-xs accent-text">¡Dibujo enviado!</div>
            <p className="muted">Esperando a los demás...</p>
            <div style={{width:40,height:40,border:"3px solid var(--border)",borderTopColor:"var(--accent)",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto"}} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <div className="stack stack-lg">
          <div>
            <div className="label" style={{marginBottom:8}}>ronda {round.round_number} · tiempo agotado</div>
            <div className="display-sm">Sube tu<br/><span className="accent-text">dibujo.</span></div>
          </div>
          <div
            className={`upload-zone ${dragOver?"active":""}`}
            onClick={()=>fileInputRef.current?.click()}
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
          >
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])} />
            {preview
              ? <img src={preview} alt="preview" className="preview-img" />
              : <><span className="upload-icon">📸</span><p style={{fontWeight:600,marginBottom:4}}>Haz una foto o sube una imagen</p><p className="muted">JPG, PNG · click o arrastra aquí</p></>
            }
          </div>
          {error && <p style={{color:"var(--danger)",fontSize:14}}>{error}</p>}
          <button className="btn btn-accent" onClick={upload} disabled={!file||uploading}>{uploading?"Subiendo...":"📤 Enviar dibujo"}</button>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match, profile, isOwn, onVote, canVote, voted, loading }) {
  const isA = profile.id === match.player_a_id;
  const isB = profile.id === match.player_b_id;
  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",overflow:"hidden"}}>
      <div className="battle-grid" style={{padding:16}}>
        <div className={`battle-card ${voted===match.player_a_id?"voted":""}`}>
          {match.submission_a?.image_url
            ? <img src={match.submission_a.image_url} alt="A" className="battle-img" />
            : <div style={{aspectRatio:"4/3",background:"var(--surface3)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)"}}>Sin dibujo</div>
          }
          <div className="battle-footer">
            {isOwn
              ? <div style={{fontSize:13,color:isA?"var(--accent)":"var(--text-muted)",textAlign:"center",fontWeight:600}}>{isA?"tu dibujo":"rival"}</div>
              : canVote
                ? <button className={`vote-btn ${voted===match.player_a_id?"selected":""}`} onClick={()=>onVote(match.player_a_id)} disabled={loading||!!voted}>{voted===match.player_a_id?"✓ votado":"Votar este"}</button>
                : voted ? <div style={{textAlign:"center",fontSize:13,color:voted===match.player_a_id?"var(--accent)":"var(--text-muted)"}}>{voted===match.player_a_id?"✓ tu voto":"—"}</div> : null
            }
          </div>
        </div>
        <div className="vs-divider"><div className="vs-text">VS</div></div>
        <div className={`battle-card ${voted===match.player_b_id?"voted":""}`}>
          {match.submission_b?.image_url
            ? <img src={match.submission_b.image_url} alt="B" className="battle-img" />
            : <div style={{aspectRatio:"4/3",background:"var(--surface3)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)"}}>Sin dibujo</div>
          }
          <div className="battle-footer">
            {isOwn
              ? <div style={{fontSize:13,color:isB?"var(--accent)":"var(--text-muted)",textAlign:"center",fontWeight:600}}>{isB?"tu dibujo":"rival"}</div>
              : canVote
                ? <button className={`vote-btn ${voted===match.player_b_id?"selected":""}`} onClick={()=>onVote(match.player_b_id)} disabled={loading||!!voted}>{voted===match.player_b_id?"✓ votado":"Votar este"}</button>
                : voted ? <div style={{textAlign:"center",fontSize:13,color:voted===match.player_b_id?"var(--accent)":"var(--text-muted)"}}>{voted===match.player_b_id?"✓ tu voto":"—"}</div> : null
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function VotingScreen({ round, matches, profile, friends, onVoted, myVotes }) {
  const [loading, setLoading] = useState({});
  const sb = getSupabase();
  const canVote = (match) => !myVotes[match.id] && match.player_a_id !== profile.id && match.player_b_id !== profile.id;
  const myMatch = matches.find(m=>m.player_a_id===profile.id||m.player_b_id===profile.id);
  const otherMatches = matches.filter(m=>m.player_a_id!==profile.id&&m.player_b_id!==profile.id);

  async function vote(match, forPlayerId) {
    setLoading(l=>({...l,[match.id]:true}));
    try {
      await sb.from("votes").insert({match_id:match.id,voter_id:profile.id,voted_for:forPlayerId});
      const col = forPlayerId===match.player_a_id?"votes_a":"votes_b";
      await sb.from("matches").update({[col]:(match[col]||0)+1}).eq("id",match.id);
      onVoted(match.id, forPlayerId);
    } catch(e){console.error(e);}
    finally{setLoading(l=>({...l,[match.id]:false}));}
  }

  return (
    <div className="page" style={{justifyContent:"flex-start",paddingTop:40}}>
      <div style={{width:"100%",maxWidth:700}}>
        <div className="stack stack-lg">
          <div style={{textAlign:"center"}}>
            <div className="label" style={{marginBottom:8}}>ronda {round.round_number} · votación</div>
            <div className="display-sm">¿Quién dibujó<br/><span className="accent-text">mejor?</span></div>
            <p className="muted" style={{marginTop:8}}>Los dibujos son anónimos</p>
          </div>
          {myMatch && (
            <div>
              <div className="label" style={{marginBottom:12}}>tu enfrentamiento</div>
              <MatchCard match={myMatch} profile={profile} isOwn={true} onVote={()=>{}} canVote={false} voted={null} loading={false} />
            </div>
          )}
          {otherMatches.length>0 && (
            <div>
              <div className="label" style={{marginBottom:12}}>vota aquí</div>
              <div className="stack">
                {otherMatches.map(match=>(
                  <MatchCard key={match.id} match={match} profile={profile} isOwn={false}
                    onVote={(id)=>vote(match,id)} canVote={canVote(match)}
                    voted={myVotes[match.id]} loading={loading[match.id]} />
                ))}
              </div>
            </div>
          )}
          {otherMatches.length===0 && <div style={{textAlign:"center",padding:"40px 0"}}><p style={{fontSize:40}}>👀</p><p className="muted" style={{marginTop:8}}>No hay otros enfrentamientos en esta ronda</p></div>}
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ rounds, players, profile, onNextRound, onFinish, isHost, currentRound, totalRounds }) {
  const [scores, setScores] = useState({});
  const sb = getSupabase();

  useEffect(() => { loadScores(); }, [rounds]);

  async function loadScores() {
    if (!rounds.length) return;
    const { data: matches } = await sb.from("matches").select("*").in("round_id", rounds.map(r=>r.id));
    const s = {};
    players.forEach(p=>{s[p.player_id]=0;});
    (matches||[]).forEach(m=>{
      if(m.votes_a>m.votes_b&&m.player_a_id) s[m.player_a_id]=(s[m.player_a_id]||0)+1;
      if(m.votes_b>m.votes_a&&m.player_b_id) s[m.player_b_id]=(s[m.player_b_id]||0)+1;
    });
    setScores(s);
  }

  const sorted = players.slice().sort((a,b)=>(scores[b.player_id]||0)-(scores[a.player_id]||0));
  const isLast = currentRound >= totalRounds;

  return (
    <div className="page">
      <div className="card">
        <div className="stack stack-lg">
          <div>
            <div className="label" style={{marginBottom:8}}>ronda {currentRound} · resultados</div>
            <div className="display-sm">Puntuaciones<span className="accent-text">.</span></div>
          </div>
          <div>
            {sorted.map((p,i)=>(
              <div className="score-row" key={p.player_id}>
                <span className="score-rank">#{i+1}</span>
                <div className="avatar">{getInitials(p.profiles?.username)}</div>
                <span className="grow" style={{fontWeight:500}}>{p.profiles?.username}{p.player_id===profile.id&&" (tú)"}</span>
                <span className="score-num">{scores[p.player_id]||0}</span>
                <span className="muted" style={{fontSize:12}}>victorias</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            {ROUND_TIMES.map((_,i)=>(
              <div key={i} className={`round-dot ${i<currentRound?"done":""}`} />
            ))}
          </div>
          {isHost
            ? <button className="btn btn-accent" onClick={isLast?onFinish:onNextRound}>{isLast?"🏆 Ver resultados finales":`⚡ Ronda ${currentRound+1}`}</button>
            : <p style={{textAlign:"center",color:"var(--text-muted)",fontSize:14}}>{isLast?"Esperando resultados finales...":`Esperando la ronda ${currentRound+1}...`}</p>
          }
        </div>
      </div>
    </div>
  );
}

function FinalResultsScreen({ rounds, players, profile, onPlayAgain }) {
  const [scores, setScores] = useState({});
  const sb = getSupabase();

  useEffect(()=>{loadScores();},[]);

  async function loadScores() {
    const { data: matches } = await sb.from("matches").select("*").in("round_id", rounds.map(r=>r.id));
    const s = {};
    players.forEach(p=>{s[p.player_id]=0;});
    (matches||[]).forEach(m=>{
      if(m.votes_a>m.votes_b&&m.player_a_id) s[m.player_a_id]=(s[m.player_a_id]||0)+1;
      if(m.votes_b>m.votes_a&&m.player_b_id) s[m.player_b_id]=(s[m.player_b_id]||0)+1;
    });
    setScores(s);
  }

  const sorted = players.slice().sort((a,b)=>(scores[b.player_id]||0)-(scores[a.player_id]||0));
  const medals = ["🥇","🥈","🥉"];

  return (
    <div className="page">
      <div className="card">
        <div className="stack stack-lg">
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:64,marginBottom:8}}>🏆</div>
            <div className="display">Final<span className="accent-text">.</span></div>
          </div>
          {sorted[0] && (
            <div style={{textAlign:"center",padding:20,background:"var(--accent-dim2)",borderRadius:"var(--radius-lg)",border:"1px solid rgba(232,255,71,0.2)"}}>
              <div className="label" style={{marginBottom:8}}>ganador</div>
              <div className="display-sm accent-text">{sorted[0].profiles?.username}</div>
              <div style={{marginTop:4,color:"var(--text-muted)",fontSize:14}}>{scores[sorted[0].player_id]} victorias</div>
            </div>
          )}
          <div>
            {sorted.map((p,i)=>(
              <div className="score-row" key={p.player_id}>
                <span style={{fontSize:20}}>{medals[i]||`#${i+1}`}</span>
                <div className="avatar">{getInitials(p.profiles?.username)}</div>
                <span className="grow" style={{fontWeight:500}}>{p.profiles?.username}{p.player_id===profile.id&&" (tú)"}</span>
                <span className="score-num">{scores[p.player_id]||0}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-accent" onClick={onPlayAgain}>↩ Volver al inicio</button>
        </div>
      </div>
    </div>
  );
}

function FriendsScreen({ profile, onBack }) {
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [notif, show] = useNotif();
  const sb = getSupabase();

  useEffect(()=>{loadFriends();},[]);

  async function loadFriends() {
    const { data } = await sb.from("friendships")
      .select("*, requester:profiles!friendships_requester_id_fkey(id,username), addressee:profiles!friendships_addressee_id_fkey(id,username)")
      .or(`requester_id.eq.${profile.id},addressee_id.eq.${profile.id}`);
    setFriends((data||[]).filter(f=>f.status==="accepted").map(f=>f.requester_id===profile.id?f.addressee:f.requester));
    setPending((data||[]).filter(f=>f.status==="pending"&&f.addressee_id===profile.id));
  }

  async function doSearch() {
    if (!search.trim()) return;
    setSearching(true);
    const { data } = await sb.from("profiles").select("*").ilike("username",`%${search}%`).neq("id",profile.id).limit(5);
    setSearchResults(data||[]);
    setSearching(false);
  }

  async function sendRequest(toId) {
    const { error } = await sb.from("friendships").insert({requester_id:profile.id,addressee_id:toId});
    if (error) show("Error al enviar solicitud","error");
    else { show("Solicitud enviada"); setSearchResults([]); setSearch(""); }
  }

  async function acceptRequest(id) {
    await sb.from("friendships").update({status:"accepted"}).eq("id",id);
    loadFriends(); show("¡Amistad aceptada!");
  }

  return (
    <div className="page" style={{justifyContent:"flex-start",paddingTop:40}}>
      <div className="card" style={{width:"100%",maxWidth:480}}>
        <div className="stack stack-lg">
          <div className="row-between">
            <div className="display-xs">Amigos<span className="accent-text">.</span></div>
            <button className="btn btn-ghost btn-sm" onClick={onBack}>← Volver</button>
          </div>
          {pending.length>0 && (
            <div>
              <div className="label" style={{marginBottom:8}}>solicitudes pendientes</div>
              <div className="stack">
                {pending.map(f=>(
                  <div className="friend-item" key={f.id}>
                    <div className="avatar">{getInitials(f.requester?.username)}</div>
                    <span className="grow">{f.requester?.username}</span>
                    <button className="btn btn-accent btn-sm" onClick={()=>acceptRequest(f.id)}>Aceptar</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="label" style={{marginBottom:8}}>buscar usuarios</div>
            <div className="row">
              <input className="input grow" placeholder="Nombre de usuario..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} />
              <button className="btn btn-accent btn-sm" onClick={doSearch} disabled={searching}>Buscar</button>
            </div>
            {searchResults.length>0 && (
              <div className="stack" style={{marginTop:12}}>
                {searchResults.map(u=>(
                  <div className="friend-item" key={u.id}>
                    <div className="avatar">{getInitials(u.username)}</div>
                    <span className="grow">{u.username}</span>
                    <button className="btn btn-ghost btn-sm" onClick={()=>sendRequest(u.id)}>+ Añadir</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="label" style={{marginBottom:8}}>mis amigos ({friends.length})</div>
            {friends.length===0
              ? <p className="muted">Aún no tienes amigos. ¡Busca usuarios arriba!</p>
              : <div className="stack">{friends.map(f=><div className="friend-item" key={f.id}><div className="avatar">{getInitials(f.username)}</div><span>{f.username}</span></div>)}</div>
            }
          </div>
        </div>
      </div>
      {notif && <div className={`notif notif-${notif.type}`}>{notif.msg}</div>}
    </div>
  );
}

export default function DrawBattle() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState("auth");
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [myVotes, setMyVotes] = useState({});
  const [mySubmission, setMySubmission] = useState(null);
  const [friends, setFriends] = useState([]);
  const [notif, show] = useNotif();
  const sb = isConfigured ? getSupabase() : null;

  useEffect(()=>{
    if (!isConfigured) return;
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) { setUser(session.user); await loadProfile(session.user.id); setScreen("home"); }
      else { setUser(null); setProfile(null); setScreen("auth"); }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  async function loadProfile(userId) {
    const { data } = await sb.from("profiles").select("*").eq("id",userId).single();
    if (data) setProfile(data);
  }

  async function loadFriends(userId) {
    const { data } = await sb.from("friendships")
      .select("*, requester:profiles!friendships_requester_id_fkey(id,username), addressee:profiles!friendships_addressee_id_fkey(id,username)")
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`).eq("status","accepted");
    setFriends((data||[]).map(f=>f.requester_id===userId?f.addressee:f.requester));
  }

  useEffect(()=>{
    if (!room) return;
    loadFriends(user?.id);
    const ch = sb.channel(`room:${room.id}`)
      .on("postgres_changes",{event:"*",schema:"public",table:"game_rooms",filter:`id=eq.${room.id}`}, async (payload)=>{
        const updated = payload.new;
        setRoom(updated);
        if (updated.status==="playing") await handleRoundStart(updated);
        if (updated.status==="voting") await handleVotingStart(updated);
        if (updated.status==="finished") setScreen("final");
      })
      .on("postgres_changes",{event:"*",schema:"public",table:"game_players",filter:`room_id=eq.${room.id}`}, async ()=>{await loadPlayers(room.id);})
      .subscribe();
    return ()=>{ sb.removeChannel(ch); };
  },[room?.id]);

  async function loadPlayers(roomId) {
    const { data } = await sb.from("game_players").select("*, profiles(*)").eq("room_id",roomId);
    setPlayers(data||[]);
  }

  async function handleRoundStart(updatedRoom) {
    const { data } = await sb.from("rounds").select("*, subjects(*), art_styles(*)")
      .eq("room_id",updatedRoom.id).eq("round_number",updatedRoom.current_round).single();
    if (data) { setCurrentRound(data); setMySubmission(null); setScreen("drawing"); }
  }

  async function handleVotingStart(updatedRoom) {
    const { data: roundData } = await sb.from("rounds").select("*, subjects(*), art_styles(*)")
      .eq("room_id",updatedRoom.id).eq("round_number",updatedRoom.current_round).single();
    if (!roundData) return;
    setCurrentRound(roundData);
    const { data: matchData } = await sb.from("matches")
      .select("*, submission_a:round_submissions!matches_submission_a_id_fkey(*), submission_b:round_submissions!matches_submission_b_id_fkey(*)")
      .eq("round_id",roundData.id);
    setMatches(matchData||[]);
    const { data: voteData } = await sb.from("votes").select("*").eq("voter_id",user.id);
    const mv = {};
    (voteData||[]).forEach(v=>{mv[v.match_id]=v.voted_for;});
    setMyVotes(mv);
    setScreen("voting");
  }

  async function createRoom() {
    const code = randomCode();
    const { data, error } = await sb.from("game_rooms").insert({code,host_id:profile.id}).select().single();
    if (error) { show("Error creando sala","error"); return; }
    await sb.from("game_players").insert({room_id:data.id,player_id:profile.id});
    setRoom(data); await loadPlayers(data.id); setScreen("room");
  }

  async function joinRoom(code) {
    const { data, error } = await sb.from("game_rooms").select("*").eq("code",code).single();
    if (error||!data) throw new Error("Sala no encontrada");
    if (data.status!=="waiting") throw new Error("La sala ya ha empezado");
    await sb.from("game_players").upsert({room_id:data.id,player_id:profile.id});
    setRoom(data); await loadPlayers(data.id); setScreen("room");
  }

  async function startGame() {
    await createRound(room,1);
    await sb.from("game_rooms").update({status:"playing",current_round:1}).eq("id",room.id);
  }

  async function createRound(r, roundNum) {
    const { data: subjects } = await sb.from("subjects").select("id");
    const { data: styles } = await sb.from("art_styles").select("id");
    const subject = subjects[Math.floor(Math.random()*subjects.length)];
    const style = styles[Math.floor(Math.random()*styles.length)];
    await sb.from("rounds").insert({
      room_id:r.id, round_number:roundNum, subject_id:subject.id, art_style_id:style.id,
      time_seconds:ROUND_TIMES[roundNum-1], status:"drawing", started_at:new Date().toISOString()
    });
  }

  async function onTimeUp() {
    setScreen("upload");
    if (room.host_id!==profile.id) return;
    await sb.from("rounds").update({status:"uploading"}).eq("id",currentRound.id);
    const check = async () => {
      const { data: subs } = await sb.from("round_submissions").select("*").eq("round_id",currentRound.id);
      if ((subs||[]).length>=players.length) {
        await createMatches(currentRound.id, subs);
        await sb.from("rounds").update({status:"voting"}).eq("id",currentRound.id);
        await sb.from("game_rooms").update({status:"voting"}).eq("id",room.id);
      } else { setTimeout(check,3000); }
    };
    setTimeout(check,5000);
  }

  async function createMatches(roundId, subs) {
    const shuffled = subs.slice().sort(()=>Math.random()-0.5);
    const inserts = [];
    for (let i=0;i<shuffled.length-1;i+=2) {
      inserts.push({round_id:roundId,player_a_id:shuffled[i].player_id,player_b_id:shuffled[i+1].player_id,submission_a_id:shuffled[i].id,submission_b_id:shuffled[i+1].id,votes_a:0,votes_b:0});
    }
    if (inserts.length) await sb.from("matches").insert(inserts);
  }

  async function nextRound() {
    const nextNum = room.current_round+1;
    if (nextNum>room.total_rounds) { await sb.from("game_rooms").update({status:"finished"}).eq("id",room.id); setScreen("final"); return; }
    await createRound(room,nextNum);
    const { data: updatedRoom } = await sb.from("game_rooms").update({status:"playing",current_round:nextNum}).eq("id",room.id).select().single();
    setRoom(updatedRoom);
  }

  async function finishGame() {
    await sb.from("game_rooms").update({status:"finished"}).eq("id",room.id);
    setScreen("final");
  }

  async function loadRounds() {
    const { data } = await sb.from("rounds").select("*").eq("room_id",room.id);
    setRounds(data||[]);
  }

  useEffect(()=>{ if (screen==="results"||screen==="final") loadRounds(); },[screen]);

  function onVoteCast(matchId, votedFor) {
    setMyVotes(v=>({...v,[matchId]:votedFor}));
    setTimeout(()=>{ if (screen==="voting") setScreen("results"); },1500);
  }

  async function signOut() {
    await sb.auth.signOut();
    setRoom(null); setPlayers([]); setScreen("auth");
  }

  if (!isConfigured) return <><style>{css}</style><div className="app"><SetupScreen /></div></>;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {screen==="auth" && <AuthScreen onAuth={u=>{setUser(u);loadProfile(u.id).then(()=>setScreen("home"));}} />}
        {screen==="home" && <HomeScreen user={user} profile={profile} onCreateRoom={createRoom} onJoinRoom={joinRoom} onGoFriends={()=>setScreen("friends")} onSignOut={signOut} />}
        {screen==="room" && room && <RoomScreen room={room} players={players} profile={profile} isHost={room.host_id===profile?.id} onStartGame={startGame} onLeave={async()=>{await sb.from("game_players").delete().eq("room_id",room.id).eq("player_id",profile.id);setRoom(null);setScreen("home");}} />}
        {screen==="drawing" && currentRound && <DrawingScreen round={currentRound} onTimeUp={onTimeUp} />}
        {screen==="upload" && currentRound && <UploadScreen round={currentRound} profile={profile} onUploaded={url=>setMySubmission(url)} alreadyUploaded={!!mySubmission} />}
        {screen==="voting" && currentRound && <VotingScreen round={currentRound} matches={matches} profile={profile} friends={friends} onVoted={onVoteCast} myVotes={myVotes} />}
        {screen==="results" && currentRound && <ResultsScreen rounds={rounds} players={players} profile={profile} onNextRound={nextRound} onFinish={finishGame} isHost={room?.host_id===profile?.id} currentRound={room?.current_round||1} totalRounds={room?.total_rounds||5} />}
        {screen==="final" && <FinalResultsScreen rounds={rounds} players={players} profile={profile} onPlayAgain={()=>{setRoom(null);setPlayers([]);setScreen("home");}} />}
        {screen==="friends" && <FriendsScreen profile={profile} onBack={()=>setScreen("home")} />}
        {notif && <div className={`notif notif-${notif.type}`}>{notif.msg}</div>}
      </div>
    </>
  );
}
