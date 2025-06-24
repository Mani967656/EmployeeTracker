import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (dark) {
      document.body.classList.add("bg-dark", "text-light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("bg-dark", "text-light");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      className="btn btn-outline-secondary"
      onClick={() => setDark((d) => !d)}
      style={{ marginLeft: 10 }}
      title="Toggle light/dark mode"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}