import { useRef, useState, type DragEvent } from "react";
import { useLoadDump } from "../hooks/useLoadDump";

export function FileDrop() {
  const { loadFile, error } = useLoadDump();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const onFile = (file: File | undefined) => { if (file) loadFile(file); };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    onFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="empty-state">
      <div className="empty-state-icon">⚽</div>
      <div className="empty-state-title">FM Analyzer</div>
      <div className="empty-state-sub">
        Load your <strong>dump.json</strong> from FMSuperScout to get started.<br />
        Found at: <code style={{ fontSize: 11, opacity: 0.7 }}>%LOCALAPPDATA%\FMSuperScout\dump.json</code>
      </div>

      {/* Hidden input — triggered by button below */}
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {/* Primary CTA — plain button, always works */}
      <button
        className="btn primary"
        style={{ padding: "12px 32px", fontSize: 15, borderRadius: 10 }}
        onClick={() => inputRef.current?.click()}
      >
        📂 Browse for dump.json…
      </button>

      {/* Drop zone as secondary option */}
      <div
        className={`file-drop-zone ${dragging ? "drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{ marginTop: 8 }}
      >
        <div style={{ fontSize: 20, opacity: 0.4 }}>⬇</div>
        <div className="drop-sub" style={{ fontSize: 11 }}>or drag &amp; drop dump.json here</div>
      </div>

      {error && (
        <div style={{ color: "var(--red)", fontSize: 12, background: "var(--red-dim)", padding: "8px 14px", borderRadius: 6, border: "1px solid var(--red)" }}>
          {error}
        </div>
      )}
    </div>
  );
}
