import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Swords, Users, BookOpen, Skull, Dices, Plus, Trash2, Flame,
  Shield, Heart, ChevronDown, ChevronUp, X, Save, RotateCcw,
  ScrollText, Sparkles, UserPlus, MapPin, Feather, Crown,
  ChevronRight, Check
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Fonts + design tokens                                              */
/* ------------------------------------------------------------------ */

function useFonts() {
  useEffect(() => {
    if (document.getElementById("dmg-fonts")) return;
    const link = document.createElement("link");
    link.id = "dmg-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const TOKENS = `
.dmg-app{
  --ink:#15120D;
  --ink-soft:#1E1912;
  --ink-rail:#100D09;
  --parchment:#EAE0C6;
  --parchment-dim:#DCCBA0;
  --parchment-line: rgba(60,45,25,0.18);
  --oxblood:#8C3230;
  --oxblood-deep:#5E1F1F;
  --gold:#C4993F;
  --gold-soft:#E3C784;
  --moss:#57603C;
  --ink-text:#2A2013;
  --bone:#F3EAD2;
  --bone-dim:#C9BC9E;
  font-family:'Crimson Pro',serif;
  background:var(--ink);
  color:var(--bone);
  min-height:100%;
}
.dmg-app .font-display{ font-family:'Cinzel',serif; letter-spacing:0.02em; }
.dmg-app .font-mono{ font-family:'JetBrains Mono',monospace; }

.dmg-rail{ background:var(--ink-rail); border-right:1px solid rgba(196,153,63,0.15); }
.dmg-tab{
  color:var(--bone-dim);
  border-left:3px solid transparent;
  transition:all .15s ease;
}
.dmg-tab:hover{ color:var(--bone); background:rgba(196,153,63,0.06); }
.dmg-tab.active{
  color:var(--gold-soft);
  border-left:3px solid var(--gold);
  background:rgba(196,153,63,0.09);
}

.dmg-page{ background:
    radial-gradient(ellipse at top left, rgba(196,153,63,0.05), transparent 60%),
    var(--ink);
}

.dmg-card{
  background:var(--parchment);
  color:var(--ink-text);
  border:1px solid var(--parchment-line);
  box-shadow: 0 1px 0 rgba(255,255,255,0.35) inset, 0 8px 20px -12px rgba(0,0,0,0.6);
  border-radius:2px;
  position:relative;
}
.dmg-card::before{
  content:"";
  position:absolute; inset:0;
  background-image: radial-gradient(rgba(60,45,25,0.05) 1px, transparent 1px);
  background-size: 3px 3px;
  pointer-events:none;
  border-radius:2px;
}
.dmg-card-dark{
  background:var(--ink-soft);
  color:var(--bone);
  border:1px solid rgba(196,153,63,0.16);
  border-radius:2px;
}

.dmg-divider{
  height:1px;
  background:linear-gradient(90deg, transparent, var(--parchment-line) 15%, var(--parchment-line) 85%, transparent);
}
.dmg-divider-dark{
  height:1px;
  background:linear-gradient(90deg, transparent, rgba(196,153,63,0.25) 15%, rgba(196,153,63,0.25) 85%, transparent);
}

.dmg-btn{
  font-family:'Cinzel',serif;
  font-size:11px;
  letter-spacing:0.06em;
  text-transform:uppercase;
  border:1px solid var(--gold);
  color:var(--gold-soft);
  background:rgba(196,153,63,0.08);
  transition:all .15s ease;
  cursor:pointer;
}
.dmg-btn:hover{ background:var(--gold); color:var(--ink); }
.dmg-btn-danger{ border-color:var(--oxblood); color:#E29B9A; }
.dmg-btn-danger:hover{ background:var(--oxblood); color:var(--bone); }
.dmg-btn-solid{ background:var(--gold); color:var(--ink); }
.dmg-btn-solid:hover{ background:var(--gold-soft); }

.dmg-input{
  background:rgba(255,255,255,0.5);
  border:1px solid var(--parchment-line);
  color:var(--ink-text);
  border-radius:2px;
}
.dmg-input:focus{ outline:2px solid var(--oxblood); outline-offset:1px; }
.dmg-input-dark{
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(196,153,63,0.25);
  color:var(--bone);
  border-radius:2px;
}
.dmg-input-dark:focus{ outline:2px solid var(--gold); outline-offset:1px; }
.dmg-input-dark::placeholder{ color:var(--bone-dim); opacity:0.6;}

.dmg-tag{
  font-family:'JetBrains Mono',monospace;
  font-size:10.5px;
  border:1px solid var(--oxblood-deep);
  color:#E8B9B7;
  background:rgba(140,50,48,0.18);
  border-radius:2px;
}
.dmg-tag-remove:hover{ color:#fff; }

.dmg-seal{
  width:10px;height:10px;border-radius:50%;
  background:radial-gradient(circle at 35% 30%, var(--gold-soft), var(--gold) 55%, var(--oxblood-deep) 100%);
  box-shadow:0 0 6px rgba(196,153,63,0.6);
}

.dmg-scroll::-webkit-scrollbar{ width:8px; height:8px; }
.dmg-scroll::-webkit-scrollbar-track{ background:transparent; }
.dmg-scroll::-webkit-scrollbar-thumb{ background:rgba(196,153,63,0.25); border-radius:4px; }

.dmg-flame{ animation: dmg-flicker 1.6s ease-in-out infinite; transform-origin:center bottom; }
@keyframes dmg-flicker{
  0%,100%{ transform:scale(1) rotate(-1deg); opacity:1;}
  50%{ transform:scale(1.08) rotate(1.5deg); opacity:0.85;}
}

@media (prefers-reduced-motion: reduce){
  .dmg-flame{ animation:none; }
}
`;

/* ------------------------------------------------------------------ */
/*  Persistence                                                        */
/* ------------------------------------------------------------------ */

function usePersistedState(key, initialValue) {
  const [state, setState] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await localStorage.get(key, false);
        if (!cancelled && res && res.value) {
          setState(JSON.parse(res.value));
        }
      } catch (e) {
        /* key not found yet — keep initial value */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    if (first.current) { first.current = false; }
    (async () => {
      try {
        await localStorage.set(key, JSON.stringify(state), false);
      } catch (e) {
        console.error("Falha ao salvar", key, e);
      }
    })();
  }, [state, loaded, key]);

  return [state, setState, loaded];
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */

function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-3">
        <Icon size={22} style={{ color: "var(--gold)" }} />
        <div>
          <h2 className="font-display text-xl" style={{ color: "var(--bone)" }}>{title}</h2>
          {subtitle && <p className="text-sm mt-0.5" style={{ color: "var(--bone-dim)" }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, text, hint }) {
  return (
    <div className="dmg-card-dark rounded p-10 flex flex-col items-center text-center gap-2">
      <Icon size={28} style={{ color: "var(--gold)", opacity: 0.6 }} />
      <p className="font-display text-sm" style={{ color: "var(--bone-dim)" }}>{text}</p>
      {hint && <p className="text-xs" style={{ color: "var(--bone-dim)", opacity: 0.7 }}>{hint}</p>}
    </div>
  );
}

function IconBtn({ onClick, title, danger, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`dmg-btn ${danger ? "dmg-btn-danger" : ""} px-2 py-1.5 rounded flex items-center gap-1`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10.5px] font-display tracking-wide" style={{ color: "var(--bone-dim)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  TAB: Jogadores                                                     */
/* ------------------------------------------------------------------ */

const BLANK_PLAYER = () => ({
  id: uid(), name: "", playerName: "", className: "", race: "", level: 1,
  hp: 10, maxHp: 10, ac: 10,
  str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
  notes: "",
});

function statMod(score) {
  const m = Math.floor((Number(score) - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function PlayersTab({ players, setPlayers }) {
  const [expanded, setExpanded] = useState({});

  const addPlayer = () => {
    const p = BLANK_PLAYER();
    setPlayers((prev) => [...prev, p]);
    setExpanded((e) => ({ ...e, [p.id]: true }));
  };
  const update = (id, patch) =>
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const remove = (id) => setPlayers((prev) => prev.filter((p) => p.id !== id));

  return (
    <div>
      <SectionHeader
        icon={Shield}
        title="Fichas dos Jogadores"
        subtitle="Referência rápida durante a mesa"
        action={
          <IconBtn onClick={addPlayer}><UserPlus size={14} /> Novo personagem</IconBtn>
        }
      />
      {players.length === 0 && (
        <EmptyState icon={Shield} text="Nenhum personagem cadastrado" hint="Adicione a ficha de cada jogador do grupo" />
      )}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {players.map((p) => {
          const open = !!expanded[p.id];
          const hpRatio = p.maxHp > 0 ? Math.max(0, Math.min(1, p.hp / p.maxHp)) : 0;
          return (
            <div key={p.id} className="dmg-card rounded p-4">
              <div className="flex items-start justify-between gap-2">
                <input
                  className="dmg-input font-display text-base px-2 py-1 rounded w-full"
                  placeholder="Nome do personagem"
                  value={p.name}
                  onChange={(e) => update(p.id, { name: e.target.value })}
                />
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setExpanded((ex) => ({ ...ex, [p.id]: !open }))}
                    className="p-1.5 rounded" style={{ color: "var(--ink-text)" }}>
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button onClick={() => remove(p.id)} className="p-1.5 rounded" style={{ color: "var(--oxblood)" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2 text-xs font-mono" style={{ color: "var(--ink-text)", opacity: 0.75 }}>
                <input className="dmg-input px-1.5 py-0.5 rounded w-24" placeholder="Jogador(a)"
                  value={p.playerName} onChange={(e) => update(p.id, { playerName: e.target.value })} />
                <input className="dmg-input px-1.5 py-0.5 rounded w-24" placeholder="Raça"
                  value={p.race} onChange={(e) => update(p.id, { race: e.target.value })} />
                <input className="dmg-input px-1.5 py-0.5 rounded w-24" placeholder="Classe"
                  value={p.className} onChange={(e) => update(p.id, { className: e.target.value })} />
                <input type="number" className="dmg-input px-1.5 py-0.5 rounded w-14" placeholder="Nv"
                  value={p.level} onChange={(e) => update(p.id, { level: e.target.value })} />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="dmg-card-dark rounded px-2 py-1.5 text-center">
                  <div className="text-[9px] font-display" style={{ color: "var(--bone-dim)" }}>PV ATUAL</div>
                  <input type="number" value={p.hp} onChange={(e) => update(p.id, { hp: Number(e.target.value) })}
                    className="font-mono text-lg w-full text-center bg-transparent"
                    style={{ color: hpRatio <= 0.3 ? "#E29B9A" : "var(--bone)" }} />
                </div>
                <div className="dmg-card-dark rounded px-2 py-1.5 text-center">
                  <div className="text-[9px] font-display" style={{ color: "var(--bone-dim)" }}>PV MÁX</div>
                  <input type="number" value={p.maxHp} onChange={(e) => update(p.id, { maxHp: Number(e.target.value) })}
                    className="font-mono text-lg w-full text-center bg-transparent" style={{ color: "var(--bone)" }} />
                </div>
                <div className="dmg-card-dark rounded px-2 py-1.5 text-center">
                  <div className="text-[9px] font-display" style={{ color: "var(--bone-dim)" }}>CA</div>
                  <input type="number" value={p.ac} onChange={(e) => update(p.id, { ac: Number(e.target.value) })}
                    className="font-mono text-lg w-full text-center bg-transparent" style={{ color: "var(--bone)" }} />
                </div>
              </div>
              <div className="h-1.5 rounded mt-2 overflow-hidden" style={{ background: "rgba(0,0,0,0.35)" }}>
                <div className="h-full" style={{
                  width: `${hpRatio * 100}%`,
                  background: hpRatio <= 0.3 ? "var(--oxblood)" : "var(--moss)",
                  transition: "width .2s"
                }} />
              </div>

              {open && (
                <div className="mt-4">
                  <div className="dmg-divider mb-3" />
                  <div className="grid grid-cols-6 gap-1.5 mb-3">
                    {["str", "dex", "con", "int", "wis", "cha"].map((k) => (
                      <div key={k} className="dmg-card-dark rounded px-1 py-1.5 text-center">
                        <div className="text-[9px] font-display uppercase" style={{ color: "var(--bone-dim)" }}>{k}</div>
                        <input type="number" value={p[k]} onChange={(e) => update(p.id, { [k]: Number(e.target.value) })}
                          className="font-mono text-sm w-full text-center bg-transparent" style={{ color: "var(--bone)" }} />
                        <div className="text-[10px] font-mono" style={{ color: "var(--gold-soft)" }}>{statMod(p[k])}</div>
                      </div>
                    ))}
                  </div>
                  <Field label="Itens, magias, anotações">
                    <textarea rows={3} className="dmg-input px-2 py-1.5 rounded w-full text-sm resize-none"
                      value={p.notes} onChange={(e) => update(p.id, { notes: e.target.value })}
                      placeholder="Inventário relevante, magias preparadas, traços..." />
                  </Field>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TAB: História                                                      */
/* ------------------------------------------------------------------ */

const BLANK_ENTRY = () => ({
  id: uid(), session: "", title: "", tags: "", body: "",
});

function StoryTab({ entries, setEntries }) {
  const add = () => setEntries((prev) => [BLANK_ENTRY(), ...prev]);
  const update = (id, patch) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const remove = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));

  return (
    <div>
      <SectionHeader
        icon={ScrollText}
        title="Linha da História"
        subtitle="Ganchos, decisões e acontecimentos da campanha"
        action={<IconBtn onClick={add}><Plus size={14} /> Nova entrada</IconBtn>}
      />
      {entries.length === 0 && (
        <EmptyState icon={ScrollText} text="Nenhum registro ainda" hint="Anote os eventos-chave conforme a campanha avança" />
      )}
      <div className="flex flex-col gap-3">
        {entries.map((e, idx) => (
          <div key={e.id} className="dmg-card rounded p-4">
            <div className="flex items-start gap-3">
              <div className="dmg-seal mt-2 shrink-0" title="Marco da história" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  <input className="dmg-input font-display px-2 py-1 rounded flex-1 min-w-[160px]"
                    placeholder="Título do evento" value={e.title}
                    onChange={(ev) => update(e.id, { title: ev.target.value })} />
                  <input className="dmg-input font-mono text-xs px-2 py-1 rounded w-32"
                    placeholder="Sessão / data" value={e.session}
                    onChange={(ev) => update(e.id, { session: ev.target.value })} />
                </div>
                <textarea rows={3} className="dmg-input px-2 py-1.5 rounded w-full text-sm resize-none mb-2"
                  placeholder="O que aconteceu, decisões tomadas, ganchos deixados em aberto..."
                  value={e.body} onChange={(ev) => update(e.id, { body: ev.target.value })} />
                <input className="dmg-input font-mono text-xs px-2 py-1 rounded w-full"
                  placeholder="tags separadas por vírgula (ex: cidade-porto, traição, artefato)"
                  value={e.tags} onChange={(ev) => update(e.id, { tags: ev.target.value })} />
              </div>
              <button onClick={() => remove(e.id)} className="p-1.5 rounded shrink-0" style={{ color: "var(--oxblood)" }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TAB: Combate                                                       */
/* ------------------------------------------------------------------ */

const CONDITIONS = [
  "Cego", "Enfeitiçado", "Surdo", "Exausto", "Amedrontado", "Agarrado",
  "Incapacitado", "Invisível", "Paralisado", "Petrificado", "Envenenado",
  "Caído", "Contido", "Atordoado", "Inconsciente",
];

const BLANK_COMBATANT = (type) => ({
  id: uid(), name: "", type, initiative: 0, hp: 10, maxHp: 10, ac: 10, conditions: [],
});

function CombatantRow({ c, isActive, onUpdate, onRemove, onToggleCondition }) {
  const [showCond, setShowCond] = useState(false);
  const hpRatio = c.maxHp > 0 ? Math.max(0, Math.min(1, c.hp / c.maxHp)) : 0;
  const isEnemy = c.type === "enemy";

  return (
    <div
      className="dmg-card-dark rounded p-3 relative"
      style={isActive ? { borderColor: "var(--gold)", boxShadow: "0 0 0 1px var(--gold)" } : undefined}
    >
      <div className="flex items-center gap-3 flex-wrap">
        {isActive && <Flame size={16} className="dmg-flame shrink-0" style={{ color: "var(--gold)" }} />}
        <div className="flex flex-col items-center w-12 shrink-0">
          <span className="text-[9px] font-display" style={{ color: "var(--bone-dim)" }}>INIC.</span>
          <input type="number" value={c.initiative}
            onChange={(e) => onUpdate({ initiative: Number(e.target.value) })}
            className="dmg-input-dark font-mono text-center rounded px-1 py-0.5 w-full" />
        </div>

        <span className="text-[9px] font-display px-1.5 py-0.5 rounded shrink-0"
          style={{
            background: isEnemy ? "rgba(140,50,48,0.25)" : "rgba(87,96,60,0.35)",
            color: isEnemy ? "#E8B9B7" : "#C7D19E",
            border: `1px solid ${isEnemy ? "var(--oxblood-deep)" : "var(--moss)"}`
          }}>
          {isEnemy ? "INIMIGO" : "JOGADOR"}
        </span>

        <input className="dmg-input-dark font-display px-2 py-1 rounded flex-1 min-w-[120px]"
          placeholder="Nome" value={c.name} onChange={(e) => onUpdate({ name: e.target.value })} />

        <div className="flex items-center gap-1">
          <Heart size={13} style={{ color: hpRatio <= 0.3 ? "#E29B9A" : "var(--bone-dim)" }} />
          <input type="number" value={c.hp} onChange={(e) => onUpdate({ hp: Number(e.target.value) })}
            className="dmg-input-dark font-mono text-center rounded px-1 py-0.5 w-12" />
          <span className="font-mono text-xs" style={{ color: "var(--bone-dim)" }}>/</span>
          <input type="number" value={c.maxHp} onChange={(e) => onUpdate({ maxHp: Number(e.target.value) })}
            className="dmg-input-dark font-mono text-center rounded px-1 py-0.5 w-12" />
        </div>

        <div className="flex items-center gap-1">
          <Shield size={13} style={{ color: "var(--bone-dim)" }} />
          <input type="number" value={c.ac} onChange={(e) => onUpdate({ ac: Number(e.target.value) })}
            className="dmg-input-dark font-mono text-center rounded px-1 py-0.5 w-12" />
        </div>

        <button onClick={() => setShowCond((s) => !s)}
          className="dmg-btn px-2 py-1 rounded text-[10px] shrink-0">
          Condições{c.conditions.length ? ` (${c.conditions.length})` : ""}
        </button>

        <button onClick={onRemove} className="p-1 rounded shrink-0 ml-auto" style={{ color: "var(--oxblood)" }}>
          <Trash2 size={15} />
        </button>
      </div>

      <div className="h-1 rounded mt-2 overflow-hidden" style={{ background: "rgba(0,0,0,0.4)" }}>
        <div className="h-full" style={{ width: `${hpRatio * 100}%`, background: hpRatio <= 0.3 ? "var(--oxblood)" : "var(--moss)" }} />
      </div>

      {c.conditions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {c.conditions.map((cond) => (
            <span key={cond} className="dmg-tag px-1.5 py-0.5 rounded flex items-center gap-1">
              {cond}
              <X size={10} className="dmg-tag-remove cursor-pointer" onClick={() => onToggleCondition(cond)} />
            </span>
          ))}
        </div>
      )}

      {showCond && (
        <div className="mt-2 pt-2 flex flex-wrap gap-1.5" style={{ borderTop: "1px solid rgba(196,153,63,0.15)" }}>
          {CONDITIONS.map((cond) => {
            const active = c.conditions.includes(cond);
            return (
              <button key={cond} onClick={() => onToggleCondition(cond)}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  border: `1px solid ${active ? "var(--gold)" : "rgba(196,153,63,0.25)"}`,
                  color: active ? "var(--ink)" : "var(--bone-dim)",
                  background: active ? "var(--gold)" : "transparent",
                }}>
                {cond}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CombatTab({ combat, setCombat }) {
  const { combatants, round, activeIndex } = combat;

  const sorted = [...combatants].sort((a, b) => b.initiative - a.initiative);

  const addCombatant = (type) => {
    setCombat((prev) => ({ ...prev, combatants: [...prev.combatants, BLANK_COMBATANT(type)] }));
  };
  const updateCombatant = (id, patch) => {
    setCombat((prev) => ({
      ...prev,
      combatants: prev.combatants.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  };
  const removeCombatant = (id) => {
    setCombat((prev) => ({ ...prev, combatants: prev.combatants.filter((c) => c.id !== id) }));
  };
  const toggleCondition = (id, cond) => {
    setCombat((prev) => ({
      ...prev,
      combatants: prev.combatants.map((c) => {
        if (c.id !== id) return c;
        const has = c.conditions.includes(cond);
        return { ...c, conditions: has ? c.conditions.filter((x) => x !== cond) : [...c.conditions, cond] };
      }),
    }));
  };
  const nextTurn = () => {
    if (sorted.length === 0) return;
    setCombat((prev) => {
      const nextIdx = activeIndex + 1;
      if (nextIdx >= sorted.length) {
        return { ...prev, activeIndex: 0, round: prev.round + 1 };
      }
      return { ...prev, activeIndex: nextIdx };
    });
  };
  const resetCombat = () => {
    setCombat({ combatants: [], round: 1, activeIndex: 0 });
  };

  const activeId = sorted[activeIndex]?.id;

  return (
    <div>
      <SectionHeader
        icon={Swords}
        title="Rastreador de Combate"
        subtitle={`Rodada ${round}`}
        action={
          <div className="flex gap-2">
            <IconBtn onClick={() => addCombatant("player")}><Shield size={14} /> Jogador</IconBtn>
            <IconBtn onClick={() => addCombatant("enemy")}><Skull size={14} /> Inimigo</IconBtn>
            <IconBtn onClick={resetCombat} danger><RotateCcw size={14} /> Encerrar</IconBtn>
          </div>
        }
      />

      {sorted.length > 0 && (
        <button onClick={nextTurn} className="dmg-btn dmg-btn-solid px-4 py-2 rounded mb-4 flex items-center gap-2">
          <ChevronRight size={15} /> Próximo turno
        </button>
      )}

      {sorted.length === 0 && (
        <EmptyState icon={Swords} text="Nenhum combatente na cena" hint="Adicione jogadores e inimigos, defina a iniciativa e comece" />
      )}

      <div className="flex flex-col gap-2">
        {sorted.map((c) => (
          <CombatantRow
            key={c.id}
            c={c}
            isActive={c.id === activeId}
            onUpdate={(patch) => updateCombatant(c.id, patch)}
            onRemove={() => removeCombatant(c.id)}
            onToggleCondition={(cond) => toggleCondition(c.id, cond)}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TAB: NPCs                                                          */
/* ------------------------------------------------------------------ */

const BLANK_NPC = (preset = {}) => ({
  id: uid(), name: "", race: "", role: "", location: "",
  attitude: "Neutro", description: "", ...preset,
});

const ATTITUDES = ["Aliado", "Amigável", "Neutro", "Desconfiado", "Hostil"];

function NpcCard({ n, onUpdate, onRemove }) {
  const [open, setOpen] = useState(false);
  const attColor = {
    Aliado: "var(--moss)", Amigável: "var(--moss)", Neutro: "var(--gold)",
    Desconfiado: "var(--oxblood-deep)", Hostil: "var(--oxblood)",
  }[n.attitude] || "var(--gold)";

  return (
    <div className="dmg-card rounded p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Crown size={16} style={{ color: "var(--oxblood)" }} className="shrink-0" />
          <input className="dmg-input font-display px-2 py-1 rounded flex-1 min-w-0"
            placeholder="Nome do NPC" value={n.name} onChange={(e) => onUpdate({ name: e.target.value })} />
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => setOpen((o) => !o)} className="p-1.5 rounded" style={{ color: "var(--ink-text)" }}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button onClick={onRemove} className="p-1.5 rounded" style={{ color: "var(--oxblood)" }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <input className="dmg-input font-mono text-xs px-1.5 py-1 rounded w-24" placeholder="Raça"
          value={n.race} onChange={(e) => onUpdate({ race: e.target.value })} />
        <input className="dmg-input font-mono text-xs px-1.5 py-1 rounded w-28" placeholder="Papel/ocupação"
          value={n.role} onChange={(e) => onUpdate({ role: e.target.value })} />
        <span className="text-xs font-mono px-1.5 py-1 rounded flex items-center gap-1" style={{ color: "var(--ink-text)", opacity: 0.7 }}>
          <MapPin size={12} />
        </span>
        <input className="dmg-input font-mono text-xs px-1.5 py-1 rounded flex-1 min-w-[100px]" placeholder="Localização"
          value={n.location} onChange={(e) => onUpdate({ location: e.target.value })} />
      </div>

      <div className="mt-3">
        <span className="text-[10px] font-display" style={{ color: "var(--ink-text)", opacity: 0.6 }}>ATITUDE COM O GRUPO</span>
        <div className="flex gap-1.5 mt-1 flex-wrap">
          {ATTITUDES.map((a) => (
            <button key={a} onClick={() => onUpdate({ attitude: a })}
              className="text-[10px] font-mono px-2 py-0.5 rounded"
              style={{
                border: `1px solid ${n.attitude === a ? attColor : "var(--parchment-line)"}`,
                background: n.attitude === a ? attColor : "transparent",
                color: n.attitude === a ? "#fff" : "var(--ink-text)",
              }}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="mt-3">
          <div className="dmg-divider mb-3" />
          <Field label="Aparência, personalidade, motivações, segredos">
            <textarea rows={3} className="dmg-input px-2 py-1.5 rounded w-full text-sm resize-none"
              value={n.description} onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Como reconhecer o NPC, o que ele quer, o que sabe..." />
          </Field>
        </div>
      )}
    </div>
  );
}

function NpcsTab({ npcs, setNpcs }) {
  const add = () => setNpcs((prev) => [BLANK_NPC(), ...prev]);
  const update = (id, patch) => setNpcs((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  const remove = (id) => setNpcs((prev) => prev.filter((n) => n.id !== id));

  return (
    <div>
      <SectionHeader
        icon={Users}
        title="NPCs Importantes"
        subtitle="Personagens recorrentes da campanha"
        action={<IconBtn onClick={add}><UserPlus size={14} /> Novo NPC</IconBtn>}
      />
      {npcs.length === 0 && (
        <EmptyState icon={Users} text="Nenhum NPC cadastrado" hint="Registre aliados, vilões e figuras importantes do mundo" />
      )}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {npcs.map((n) => (
          <NpcCard key={n.id} n={n} onUpdate={(p) => update(n.id, p)} onRemove={() => remove(n.id)} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TAB: Gerador de NPCs aleatórios                                    */
/* ------------------------------------------------------------------ */

const RACES = ["Humano", "Elfo", "Anão", "Halfling", "Meio-Orc", "Tiefling", "Draconato", "Gnomo", "Meio-Elfo"];

const NAME_PARTS = {
  Humano: { first: ["Aldric", "Beatriz", "Cassian", "Dorotéia", "Edmar", "Feliza", "Gaspar", "Helvina", "Ivo", "Josefina", "Leandro", "Marta"], last: ["Vansen", "Corveau", "Aldabrande", "Ferreira", "Solano", "Duquesne", "Marchetti"] },
  Elfo: { first: ["Aerendyl", "Sylvaeril", "Thalion", "Miriel", "Caelith", "Vaelira", "Erevan", "Lithiel"], last: ["do Vento Prateado", "Luzestrela", "Folhaverde", "Solmarin", "das Brumas"] },
  Anão: { first: ["Thrundir", "Brogna", "Kordak", "Ulfrida", "Dorin", "Vengra", "Balrik", "Hilde"], last: ["Barbaço de Ferro", "Punhorocha", "Machadofundo", "Escudonegro"] },
  Halfling: { first: ["Pip", "Rosalinda", "Tobias", "Marigold", "Wendell", "Poppy", "Fennick"], last: ["Pézinho Leve", "Boaventura", "Trigal", "Passobom"] },
  "Meio-Orc": { first: ["Grosk", "Uzka", "Draggor", "Mala", "Krunn", "Yeva"], last: ["Punhoquebrado", "Dentaço", "Osso Rachado", "Sanguetorto"] },
  Tiefling: { first: ["Zariel", "Morrigash", "Vesper", "Kael'thas", "Nyx", "Ashareth"], last: ["Sombracinza", "Chamaveludo", "Marca-Infernal", "Brasavil"] },
  Draconato: { first: ["Krixathrax", "Vaerith", "Bahamir", "Threxx", "Ossaris"], last: ["Escamaviva", "Garraforja", "Chamacobre"] },
  Gnomo: { first: ["Bibo", "Fizwick", "Nissa", "Wobble", "Trindle", "Zook"], last: ["Engrenagem", "Pólvorafina", "Faiscante", "Rodalouca"] },
  "Meio-Elfo": { first: ["Aramis", "Ithlyn", "Corwen", "Faelis", "Doreth"], last: ["Duasterras", "Solmargem", "Bosquevento"] },
};

const OCCUPATIONS = [
  "Ferreiro(a)", "Taverneiro(a)", "Guarda da cidade", "Mercador(a) ambulante",
  "Fazendeiro(a)", "Curandeiro(a)", "Ladrão de rua", "Bardo itinerante",
  "Sacerdote(isa)", "Caçador(a)", "Marinheiro(a)", "Estalajadeiro(a)",
  "Alfaiate", "Escriba", "Mendigo(a)", "Nobre menor", "Mercenário(a)",
  "Contrabandista", "Coveiro(a)", "Alquimista", "Bibliotecário(a)", "Pescador(a)",
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateNpc() {
  const race = pick(RACES);
  const parts = NAME_PARTS[race];
  const name = `${pick(parts.first)} ${pick(parts.last)}`;
  const occupation = pick(OCCUPATIONS);
  return { id: uid(), name, race, occupation };
}

function GeneratorTab({ onSaveAsNpc }) {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [savedIds, setSavedIds] = useState({});

  const roll = () => {
    const n = generateNpc();
    setCurrent(n);
    setHistory((h) => [n, ...h].slice(0, 8));
  };

  const save = (n) => {
    onSaveAsNpc(n);
    setSavedIds((s) => ({ ...s, [n.id]: true }));
  };

  return (
    <div>
      <SectionHeader
        icon={Dices}
        title="Gerador de NPCs Aleatórios"
        subtitle="Para figurantes criados na hora, à mesa"
        action={<IconBtn onClick={roll}><Sparkles size={14} /> Sortear</IconBtn>}
      />

      {!current && (
        <EmptyState icon={Dices} text="Clique em Sortear para gerar um NPC" hint="Nome, raça e ocupação, prontos para usar" />
      )}

      {current && (
        <div className="dmg-card rounded p-6 mb-6 max-w-md">
          <div className="flex items-center gap-2 mb-1">
            <Feather size={16} style={{ color: "var(--oxblood)" }} />
            <span className="text-[10px] font-display" style={{ color: "var(--ink-text)", opacity: 0.6 }}>NPC SORTEADO</span>
          </div>
          <h3 className="font-display text-2xl mb-1">{current.name}</h3>
          <p className="font-mono text-sm" style={{ color: "var(--ink-text)", opacity: 0.8 }}>
            {current.race} · {current.occupation}
          </p>
          <div className="dmg-divider my-3" />
          <div className="flex gap-2">
            <button onClick={roll} className="dmg-btn dmg-btn-solid px-3 py-1.5 rounded flex items-center gap-1">
              <Dices size={13} /> Sortear outro
            </button>
            <button
              onClick={() => save(current)}
              disabled={!!savedIds[current.id]}
              className="dmg-btn px-3 py-1.5 rounded flex items-center gap-1"
              style={savedIds[current.id] ? { opacity: 0.5, cursor: "default" } : undefined}
            >
              {savedIds[current.id] ? <Check size={13} /> : <Save size={13} />}
              {savedIds[current.id] ? "Salvo" : "Salvar como NPC"}
            </button>
          </div>
        </div>
      )}

      {history.length > 1 && (
        <div>
          <p className="text-[10px] font-display mb-2" style={{ color: "var(--bone-dim)" }}>SORTEIOS ANTERIORES</p>
          <div className="flex flex-col gap-1.5">
            {history.slice(1).map((n) => (
              <div key={n.id} className="dmg-card-dark rounded px-3 py-2 flex items-center justify-between gap-2 text-sm">
                <span>
                  <span className="font-display" style={{ color: "var(--bone)" }}>{n.name}</span>
                  <span className="font-mono text-xs" style={{ color: "var(--bone-dim)" }}> — {n.race} · {n.occupation}</span>
                </span>
                <button
                  onClick={() => save(n)}
                  disabled={!!savedIds[n.id]}
                  className="text-[10px] font-mono px-2 py-1 rounded shrink-0"
                  style={{ border: "1px solid var(--gold)", color: savedIds[n.id] ? "var(--bone-dim)" : "var(--gold-soft)" }}
                >
                  {savedIds[n.id] ? "Salvo" : "Salvar"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App shell                                                          */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: "players", label: "Jogadores", icon: Shield },
  { id: "story", label: "História", icon: ScrollText },
  { id: "combat", label: "Combate", icon: Swords },
  { id: "npcs", label: "NPCs", icon: Users },
  { id: "generator", label: "Gerador", icon: Dices },
];

export default function CampaignGuide() {
  useFonts();
  const [tab, setTab] = useState("players");

  const [players, setPlayers] = usePersistedState("dmg:players", []);
  const [story, setStory] = usePersistedState("dmg:story", []);
  const [npcs, setNpcs] = usePersistedState("dmg:npcs", []);
  const [combat, setCombat] = usePersistedState("dmg:combat", { combatants: [], round: 1, activeIndex: 0 });

  const saveGeneratedAsNpc = useCallback((gen) => {
    setNpcs((prev) => [
      BLANK_NPC({ name: gen.name, race: gen.race, role: gen.occupation }),
      ...prev,
    ]);
  }, [setNpcs]);

  return (
    <div className="dmg-app w-full min-h-screen flex">
      <style>{TOKENS}</style>

      {/* rail */}
      <nav className="dmg-rail w-52 shrink-0 py-6 flex flex-col">
        <div className="px-5 mb-8 flex items-center gap-2">
          <div className="dmg-seal" />
          <div>
            <div className="font-display text-sm" style={{ color: "var(--gold-soft)" }}>DIÁRIO DE</div>
            <div className="font-display text-sm -mt-0.5" style={{ color: "var(--bone)" }}>CAMPANHA</div>
          </div>
        </div>
        <div className="flex flex-col">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`dmg-tab px-5 py-3 flex items-center gap-3 text-left font-display text-[13px] ${tab === t.id ? "active" : ""}`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-auto px-5 pt-6">
          <div className="dmg-divider-dark mb-3" />
          <p className="text-[10px] font-mono" style={{ color: "var(--bone-dim)", opacity: 0.6 }}>
            D&D 5ª edição · dados salvos localmente
          </p>
        </div>
      </nav>

      {/* page */}
      <main className="dmg-page dmg-scroll flex-1 min-w-0 overflow-y-auto p-8">
        <div className="max-w-5xl">
          {tab === "players" && <PlayersTab players={players} setPlayers={setPlayers} />}
          {tab === "story" && <StoryTab entries={story} setEntries={setStory} />}
          {tab === "combat" && <CombatTab combat={combat} setCombat={setCombat} />}
          {tab === "npcs" && <NpcsTab npcs={npcs} setNpcs={setNpcs} />}
          {tab === "generator" && <GeneratorTab onSaveAsNpc={saveGeneratedAsNpc} />}
        </div>
      </main>
    </div>
  );
}
