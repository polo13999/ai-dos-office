"use client";

import { useEffect, useMemo, useState } from "react";
import type { QueueDashboardResponse, QueueItem, QueueSnapshot } from "../lib/queues/types";

type QueueTab = "WORK" | "RESEARCH" | "ALL";

const panelStyle = { padding: 18, marginBottom: 16 } as const;
const buttonStyle = { border: "2px solid #3a5968", background: "#132b38", color: "#dbe9e9", padding: "8px 12px", borderRadius: 4, cursor: "pointer" } as const;

function formatTime(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("zh-TW", { hour12: false });
}

function SourceState({ snapshot }: { snapshot: QueueSnapshot }) {
  const bad = snapshot.status === "SOURCE_ERROR" || snapshot.status === "PARSE_ERROR";
  return (
    <section className="pixel-panel" style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <span className="panel-kicker">{snapshot.domain} SOURCE</span>
          <h3 style={{ margin: "7px 0" }}>{snapshot.repository}</h3>
          <p style={{ margin: 0, color: "#94a9b4" }}>{snapshot.path}</p>
        </div>
        <strong style={{ color: bad ? "#ff8a7a" : snapshot.status === "EMPTY" ? "#ffcf66" : "#74df8a" }}>{snapshot.status}</strong>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10, marginTop: 14, fontSize: 12 }}>
        <div><small style={{ color: "#8ba0b2" }}>Revision</small><div>{snapshot.revision ?? "—"}</div></div>
        <div><small style={{ color: "#8ba0b2" }}>Fetched</small><div>{formatTime(snapshot.fetchedAt)}</div></div>
        <div><small style={{ color: "#8ba0b2" }}>Last success</small><div>{formatTime(snapshot.lastSuccessfulFetch)}</div></div>
        <div><small style={{ color: "#8ba0b2" }}>Warnings</small><div>{snapshot.warnings.length}</div></div>
      </div>
      {snapshot.errors.length > 0 && <div role="alert" style={{ marginTop: 12, color: "#ffb2a8" }}>{snapshot.errors.map((error, index) => <p key={`${error}-${index}`} style={{ margin: "4px 0" }}>{error}</p>)}</div>}
      {snapshot.warnings.length > 0 && <details style={{ marginTop: 12 }}><summary>查看 parser warnings</summary><ul>{snapshot.warnings.map((warning, index) => <li key={`${warning}-${index}`}>{warning}</li>)}</ul></details>}
    </section>
  );
}

function QueueRows({ items }: { items: QueueItem[] }) {
  if (items.length === 0) return <div className="pixel-panel" style={{ ...panelStyle, textAlign: "center", color: "#94a9b4" }}>目前沒有可顯示的項目。</div>;
  return <div style={{ display: "grid", gap: 12 }}>{items.map(item => (
    <article className="pixel-panel" style={panelStyle} key={`${item.domain}-${item.itemId}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <span className="panel-kicker">{item.domain} · {item.priority}</span>
          <h3 style={{ margin: "7px 0 4px" }}>{item.itemId} — {item.title}</h3>
        </div>
        <strong>{item.status}</strong>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 14, fontSize: 12 }}>
        <div><small style={{ color: "#8ba0b2" }}>{item.domain === "WORK" ? "Queue Order" : "Current Round"}</small><div>{item.domain === "WORK" ? item.queueOrder ?? "—" : item.currentRound ?? "—"}</div></div>
        <div><small style={{ color: "#8ba0b2" }}>Claimed By</small><div>{item.claimedBy ?? "—"}</div></div>
        <div><small style={{ color: "#8ba0b2" }}>Waiting</small><div>{item.waiting ?? "—"}</div></div>
        <div><small style={{ color: "#8ba0b2" }}>Source Row</small><div>{item.sourceRow}</div></div>
      </div>
      {item.nextAction && <p><b>Next Action：</b>{item.nextAction}</p>}
      {item.resumeCondition && <p><b>Resume Condition：</b>{item.resumeCondition}</p>}
      {item.authoritativeLocation && <p style={{ marginBottom: 0 }}><b>Location：</b>{item.authoritativeLocation}</p>}
    </article>
  ))}</div>;
}

export default function QueueDashboard() {
  const [tab, setTab] = useState<QueueTab>("WORK");
  const [data, setData] = useState<QueueDashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/queues", { cache: "no-store", signal: controller.signal });
        const body = await response.json() as QueueDashboardResponse;
        if (!response.ok && response.status !== 503) throw new Error("Queue API request failed.");
        setData(body);
      } catch (reason) {
        if ((reason as Error).name !== "AbortError") setError(reason instanceof Error ? reason.message : "Queue API request failed.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  const items = useMemo(() => {
    if (!data) return [];
    if (tab === "WORK") return data.work.items;
    if (tab === "RESEARCH") return data.research.items;
    return [...data.work.items, ...data.research.items];
  }, [data, tab]);

  if (loading) return <section className="pixel-panel" style={panelStyle}>正在讀取 Work 與 Research Queue…</section>;
  if (error) return <section className="pixel-panel" role="alert" style={panelStyle}>Queue Dashboard 無法載入：{error}</section>;
  if (!data) return <section className="pixel-panel" role="alert" style={panelStyle}>Queue Dashboard 沒有取得資料。</section>;

  return <section aria-label="Work and Research Queue Dashboard">
    <div className="pixel-panel" style={{ ...panelStyle, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <div><span className="panel-kicker">AUTHORITATIVE READ MODEL</span><h2 style={{ margin: "6px 0" }}>Work / Research Queue</h2><p style={{ margin: 0, color: "#94a9b4" }}>唯讀顯示；不提供 claim、排序、核准、resume 或 Handoff 操作。</p></div>
      <small>Generated：{formatTime(data.generatedAt)}</small>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}><SourceState snapshot={data.work}/><SourceState snapshot={data.research}/></div>
    <div className="pixel-panel" style={{ ...panelStyle, display: "flex", gap: 8, flexWrap: "wrap" }}>
      {(["WORK", "RESEARCH", "ALL"] as QueueTab[]).map(value => <button key={value} style={{ ...buttonStyle, background: tab === value ? "#3c9b6f" : buttonStyle.background }} onClick={() => setTab(value)}>{value === "ALL" ? "全部" : value}</button>)}
    </div>
    <QueueRows items={items}/>
  </section>;
}
