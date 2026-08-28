import { createContext, useContext, useState } from "react";
import { Sun, Moon, X, Pencil, Check, Sparkles, ArrowRight } from "lucide-react";
 
/* ============================================================================
   BRAND COLOR CONTEXT
   ----------------------------------------------------------------------------
   Wrap your whole app in <BrandColorProvider> once, at the root (e.g. in
   App.jsx or _app.jsx). Any component, anywhere in the tree, can then read
   the user's chosen brand color with the `useBrandColor()` hook:
 
     const { brandColor } = useBrandColor();
     <div style={{ borderColor: brandColor.hex }} />
 
   NOTE ON PERSISTENCE: this demo keeps the color in memory (React state)
   only, because this preview sandbox can't use localStorage. In your real
   app, swap the two lines marked below for localStorage (or a call to your
   backend/user-profile API) so the choice survives a page refresh:
 
     const [brandColorId, setBrandColorId] = useState(
       () => localStorage.getItem("brandColor") || "purple"
     );
     useEffect(() => {
       localStorage.setItem("brandColor", brandColorId);
     }, [brandColorId]);
============================================================================ */
 
// eslint-disable-next-line react-refresh/only-export-components
export const BRAND_COLORS = [
  { id: "purple", label: "Purple", hex: "#8B5CF6", soft: "#EFEAFE" },
  { id: "blue", label: "Blue", hex: "#4C8DF6", soft: "#EAF1FE" },
  { id: "coral", label: "Coral", hex: "#F4735C", soft: "#FEEEEA" },
  { id: "pink", label: "Pink", hex: "#D6266F", soft: "#FBE8F1" },
  { id: "teal", label: "Teal", hex: "#3FBEEF", soft: "#E9F8FE" },
];
 
const BrandColorContext = createContext(null);
 
export function BrandColorProvider({ children, defaultColorId = "purple" }) {
  // Swap for localStorage/backend persistence in your real app — see note above.
  const [brandColorId, setBrandColorId] = useState(defaultColorId);
 
  const brandColor =
    BRAND_COLORS.find((c) => c.id === brandColorId) || BRAND_COLORS[0];
 
  const value = { brandColor, brandColorId, setBrandColorId, colors: BRAND_COLORS };
 
  return (
    <BrandColorContext.Provider value={value}>
      {children}
    </BrandColorContext.Provider>
  );
}
 
// eslint-disable-next-line react-refresh/only-export-components
export function useBrandColor() {
  const ctx = useContext(BrandColorContext);
  if (!ctx) {
    throw new Error("useBrandColor must be used inside a <BrandColorProvider>");
  }
  return ctx;
}
 
/* ============================================================================
   ACCENT CONTEXT
   ----------------------------------------------------------------------------
   Same pattern as BrandColorContext above: wrap your app root in
   <AccentProvider> once, and read/set the saved accent from anywhere with:
 
     const { accent, accentId, setAccentId } = useAccent();
 
   NOTE ON PERSISTENCE: kept in memory (React state) here because this
   preview sandbox can't use localStorage. In your real app, persist it the
   same way suggested for brand color:
 
     const [accentId, setAccentId] = useState(
       () => localStorage.getItem("accent") || "us-en"
     );
     useEffect(() => {
       localStorage.setItem("accent", accentId);
     }, [accentId]);
============================================================================ */
 
const AccentContext = createContext(null);
 
export function AccentProvider({ children, defaultAccentId = "us-en" }) {
  // Swap for localStorage/backend persistence in your real app — see note above.
  const [accentId, setAccentId] = useState(defaultAccentId);
 
  const accent = ACCENTS.find((a) => a.id === accentId) || ACCENTS[0];
 
  const value = { accent, accentId, setAccentId, accents: ACCENTS };
 
  return (
    <AccentContext.Provider value={value}>{children}</AccentContext.Provider>
  );
}
 
// eslint-disable-next-line react-refresh/only-export-components
export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) {
    throw new Error("useAccent must be used inside an <AccentProvider>");
  }
  return ctx;
}
 
/* ============================================================================
   ACCOUNT SETTINGS PANEL
============================================================================ */
 
const ACCENTS = [
  { id: "ng-en", flag: "🇳🇬", label: "British English", sub: "Accent" },
  { id: "gb-en", flag: "🇬🇧", label: "British English", sub: "Accent" },
  { id: "us-en", flag: "🇺🇸", label: "American English", sub: "Accent" },
];
 
export function AccountSettings({
  user: initialUser = {
    name: "Alexander Chen",
    email: "alex@sonar.ai",
    avatarUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander&backgroundColor=b6e3f4",
  },
  onClose,
  onLogout,
  onGoPro,
}) {
  const { brandColor, brandColorId, setBrandColorId, colors } = useBrandColor();
  const { accentId, setAccentId } = useAccent();
 
  const [theme, setTheme] = useState("light"); // "light" | "dark"
  const [voiceModel, setVoiceModel] = useState("male"); // "male" | "female"
 
  const [user, setUser] = useState(initialUser);
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(initialUser.name);
  const [draftEmail, setDraftEmail] = useState(initialUser.email);
 
  const dark = theme === "dark";
 
  function saveProfile() {
    setUser((u) => ({ ...u, name: draftName, email: draftEmail }));
    setEditingProfile(false);
  }
 
  return (
    <div
      className={[
        "min-h-screen w-full flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 overflow-x-hidden",
        dark ? "bg-black" : "bg-neutral-100",
      ].join(" ")}
    >
      <div
        className={[
          "w-full max-w-xl rounded-[28px] p-5 sm:p-10 transition-colors duration-300",
          dark
            ? "bg-neutral-950 border border-neutral-800 shadow-2xl shadow-black/60"
            : "bg-white border border-neutral-200 shadow-xl shadow-neutral-200/60",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1
              className={[
                "text-2xl sm:text-3xl font-extrabold tracking-tight break-words",
                dark ? "text-white" : "text-neutral-900",
              ].join(" ")}
            >
              Account Settings
            </h1>
            <p className={dark ? "text-neutral-400 mt-1 text-sm sm:text-base" : "text-neutral-500 mt-1 text-sm sm:text-base"}>
              Take control of your experience
            </p>
          </div>
 
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme toggle pill */}
            <div
              className={[
                "flex items-center gap-1 rounded-full p-1",
                dark ? "bg-neutral-900" : "bg-neutral-100",
              ].join(" ")}
            >
              <button
                type="button"
                aria-label="Light mode"
                onClick={() => setTheme("light")}
                className="h-8 w-8 rounded-full flex items-center justify-center transition-colors shrink-0"
                style={{
                  backgroundColor: !dark ? brandColor.hex : "transparent",
                }}
              >
                <Sun
                  size={16}
                  className={!dark ? "text-white" : dark ? "text-neutral-400" : "text-neutral-400"}
                />
              </button>
              <button
                type="button"
                aria-label="Dark mode"
                onClick={() => setTheme("dark")}
                className="h-8 w-8 rounded-full flex items-center justify-center transition-colors shrink-0"
                style={{
                  backgroundColor: dark ? brandColor.hex : "transparent",
                }}
              >
                <Moon size={16} className={dark ? "text-white" : "text-neutral-400"} />
              </button>
            </div>
 
            {onClose && (
              <button
                type="button"
                aria-label="Close settings"
                onClick={onClose}
                className={[
                  "h-10 w-10 rounded-full flex items-center justify-center transition-colors shrink-0",
                  dark
                    ? "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                ].join(" ")}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
 
        {/* Profile row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mt-8">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover shrink-0"
            />
            {!editingProfile ? (
              <div className="min-w-0">
                <p
                  className={[
                    "font-semibold truncate",
                    dark ? "text-white" : "text-neutral-900",
                  ].join(" ")}
                >
                  {user.name}
                </p>
                <p className={dark ? "text-neutral-400 text-sm truncate" : "text-neutral-500 text-sm truncate"}>
                  {user.email}
                </p>
              </div>
            ) : (
              <div className="min-w-0 flex flex-col gap-1.5">
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Full name"
                  className={[
                    "w-full sm:w-auto max-w-[220px] sm:max-w-none text-sm font-semibold rounded-md px-2 py-1 outline-none border",
                    dark
                      ? "bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500"
                      : "bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400",
                  ].join(" ")}
                  style={{ borderColor: brandColor.hex }}
                />
                <input
                  value={draftEmail}
                  onChange={(e) => setDraftEmail(e.target.value)}
                  placeholder="Email"
                  className={[
                    "w-full sm:w-auto max-w-[220px] sm:max-w-none text-sm rounded-md px-2 py-1 outline-none border",
                    dark
                      ? "bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500"
                      : "bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400",
                  ].join(" ")}
                />
                <div className="flex gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={saveProfile}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md text-white"
                    style={{ backgroundColor: brandColor.hex }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDraftName(user.name);
                      setDraftEmail(user.email);
                      setEditingProfile(false);
                    }}
                    className={dark ? "text-xs px-2.5 py-1 text-neutral-400" : "text-xs px-2.5 py-1 text-neutral-500"}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {!editingProfile && (
              <button
                type="button"
                aria-label="Edit profile"
                onClick={() => setEditingProfile(true)}
                className={[
                  "h-9 w-9 shrink-0 rounded-full flex items-center justify-center transition-colors",
                  dark
                    ? "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
                ].join(" ")}
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
 
          {!editingProfile && (
            <button
              type="button"
              onClick={onGoPro}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-blue-500 hover:opacity-90 transition-opacity"
            >
              <Sparkles size={15} />
              Go Pro
            </button>
          )}
        </div>
 
        <div
          className={[
            "border-t border-dashed my-6 sm:my-8",
            dark ? "border-neutral-800" : "border-neutral-300",
          ].join(" ")}
        />
 
        {/* Voice model */}
        <section>
          <h2 className={dark ? "text-white font-bold text-lg" : "text-neutral-900 font-bold text-lg"}>
            Choose your voice model
          </h2>
          <p className={dark ? "text-neutral-400 text-sm mt-0.5" : "text-neutral-500 text-sm mt-0.5"}>
            Choose a voice and accent to personalize your experience.
          </p>
 
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
            {["male", "female"].map((option) => {
              const selected = voiceModel === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setVoiceModel(option)}
                  className={[
                    "relative rounded-2xl border-2 px-3 sm:px-5 py-3 sm:py-4 text-left font-bold capitalize transition-colors",
                    dark ? "bg-neutral-950 text-white" : "bg-white text-neutral-900",
                  ].join(" ")}
                  style={{
                    borderColor: selected ? brandColor.hex : dark ? "#262626" : "#E5E5E5",
                  }}
                >
                  {option}
                  {selected && (
                    <span
                      className="absolute top-3.5 right-4 h-5 w-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: brandColor.hex }}
                    >
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
 
        {/* Accent */}
        <section className="mt-6 sm:mt-8">
          <h2 className={dark ? "text-white font-bold text-lg" : "text-neutral-900 font-bold text-lg"}>
            Select Accent
          </h2>
 
          <div className="flex sm:grid sm:grid-cols-3 gap-3 mt-4 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
            {ACCENTS.map((accent) => {
              const selected = accentId === accent.id;
              return (
                <button
                  key={accent.id}
                  type="button"
                  onClick={() => setAccentId(accent.id)}
                  className={[
                    "relative shrink-0 w-40 sm:w-auto rounded-2xl border-2 px-3 py-3.5 text-left transition-colors",
                    dark ? "bg-neutral-950" : "bg-white",
                  ].join(" ")}
                  style={{
                    borderColor: selected ? brandColor.hex : dark ? "#262626" : "#E5E5E5",
                  }}
                >
                  <span className="text-xl leading-none">{accent.flag}</span>
                  <p
                    className={[
                      "font-bold text-sm mt-2 leading-tight",
                      dark ? "text-white" : "text-neutral-900",
                    ].join(" ")}
                  >
                    {accent.label}
                  </p>
                  <p className={dark ? "text-neutral-500 text-xs" : "text-neutral-400 text-xs"}>
                    {accent.sub}
                  </p>
                  {selected && (
                    <span
                      className="absolute top-3 right-3 h-5 w-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: brandColor.hex }}
                    >
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
 
        {/* Brand color */}
        <section className="mt-6 sm:mt-8">
          <h2 className={dark ? "text-white font-bold text-lg" : "text-neutral-900 font-bold text-lg"}>
            Brand color
          </h2>
          <p className={dark ? "text-neutral-400 text-sm mt-0.5" : "text-neutral-500 text-sm mt-0.5"}>
            Select your brand color
          </p>
 
          <div className="flex gap-4 sm:gap-6 mt-4 flex-wrap">
            {colors.map((c) => {
              const selected = c.id === brandColorId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setBrandColorId(c.id)}
                  className="flex flex-col items-center gap-2"
                >
                  <span
                    className="h-14 w-14 rounded-full flex items-center justify-center transition-all"
                    style={{
                      boxShadow: selected ? `0 0 0 2.5px ${c.hex}` : "0 0 0 0 transparent",
                    }}
                  >
                    <span
                      className="h-11 w-11 rounded-full"
                      style={{ backgroundColor: c.hex }}
                    />
                  </span>
                  <span
                    className={[
                      "text-xs font-medium",
                      dark ? "text-neutral-400" : "text-neutral-500",
                    ].join(" ")}
                  >
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
 
        <div
          className={[
            "border-t border-dashed my-6 sm:my-8",
            dark ? "border-neutral-800" : "border-neutral-300",
          ].join(" ")}
        />
 
        {/* Log out */}
        <button
          type="button"
          onClick={onLogout}
          className={[
            "w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 sm:py-4 font-bold tracking-wide text-sm transition-colors",
            dark
              ? "bg-neutral-900 text-neutral-500 hover:bg-neutral-800"
              : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200",
          ].join(" ")}
        >
          <ArrowRight size={16} />
          LOG OUT
        </button>
      </div>
    </div>
  );
}
 
/* ============================================================================
   DEMO ENTRY POINT
   ----------------------------------------------------------------------------
   In your real app, put <BrandColorProvider> once near the root (e.g. in
   App.jsx), and render <AccountSettings /> — plus any other component that
   wants to read useBrandColor() — inside it. This default export just wires
   that up for the preview here.
============================================================================ */
 
export default function App() {
  return (
    <BrandColorProvider defaultColorId="purple">
      <AccentProvider defaultAccentId="us-en">
        <AccountSettings
          onClose={() => {}}
          onGoPro={() => {}}
          onLogout={() => {}}
        />
      </AccentProvider>
    </BrandColorProvider>
  );
}
 