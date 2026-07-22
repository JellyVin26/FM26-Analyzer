import { useRef, useState, type DragEvent } from "react";
import { useLoadDump } from "../hooks/useLoadDump";

export function FileDrop() {
  const { loadFile, syncLiveSave, error } = useLoadDump();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [checking, setChecking] = useState(false);

  const onFile = (file: File | undefined) => { if (file) loadFile(file); };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    onFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="empty-state" style={{ maxWidth: 500 }}>
      <div className="empty-state-icon">⚽</div>
      <div className="empty-state-title">FM Analyzer</div>
      <div className="empty-state-sub" style={{ marginTop: 8, lineHeight: 1.5 }}>
        Connect directly to Football Manager 2026 to extract live scouting data, or load a previous save file manually.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 340, marginTop: 24 }}>
        <button
          className="btn primary"
          style={{ padding: "12px 24px", fontSize: 14, borderRadius: 10, justifyContent: "center" }}
          onClick={() => { setChecking(true); syncLiveSave().finally(() => setChecking(false)); }}
          disabled={checking}
        >
          {checking ? "⏳ Waiting for FM26 game data..." : "⚡ Sync Live Save"}
        </button>

        <button
          className="btn"
          style={{ padding: "10px 24px", fontSize: 13, borderRadius: 10, justifyContent: "center" }}
          onClick={() => inputRef.current?.click()}
        >
          📂 Select dump.json manually…
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      <div
        className={`file-drop-zone ${dragging ? "drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{ marginTop: 14, width: "100%", maxWidth: 340 }}
      >
        <div style={{ fontSize: 18, opacity: 0.4 }}>⬇</div>
        <div className="drop-sub" style={{ fontSize: 11 }}>or drag &amp; drop dump.json here</div>
      </div>

      {error && !checking && (
        <div style={{ color: "var(--amber)", fontSize: 12, background: "rgba(245, 158, 11, 0.1)", padding: "8px 14px", borderRadius: 6, border: "1px solid rgba(245, 158, 11, 0.3)", marginTop: 14 }}>
          {error}
        </div>
      )}
    </div>
  );
}
