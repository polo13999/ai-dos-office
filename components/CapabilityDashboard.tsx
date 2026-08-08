"use client";

import { useEffect, useState } from "react";
import type { CapabilityDashboardResponse, CapabilityRecord, SourceDescriptor } from "../lib/capabilities/types";

const panelStyle = { padding: 18, marginBottom: 16, minWidth: 0 } as const;

function SourceMeta({ source }: { source: SourceDescriptor }) {
  return (
    <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10, fontSize: 12 }}>
      <div><dt>Repository</dt><dd>{source.repository}</dd></div>
      <div><dt>Path</dt><dd>{source.path}</dd></div>
      <div><dt>Revision</dt><dd>{source.revision ?? "—"}</dd></div>
      <div><dt>Freshness</dt><dd>{source.freshness}</dd></div>
      <div><dt>Permission</dt><dd>{source.permission}</dd></div>
    </dl>
  );
}

function CapabilityCard({ record }: { record: CapabilityRecord }) {
  return (
    <article className="pixel-panel" style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div><span className="panel-kicker">CAPABILITY</span><h3>{record.label}</h3></div>
        <strong>{record.status}</strong>
      </div>
      <p>{record.summary}</p>
      <SourceMeta source={record.source} />
      {record.source.warnings.length > 0 && <p><b>Warnings：</b>{record.source.warnings.join(" · ")}</p>}
      {record.source.errors.length > 0 && <p role="alert"><b>Errors：</b>{record.source.errors.join(" · ")}</p>}
    </article>
  );
}

export default function CapabilityDashboard() {
  const [data, setData] = useState<CapabilityDashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/capabilities", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Capabilities API unavailable.");
        return response.json() as Promise<CapabilityDashboardResponse>;
      })
      .then(setData)
      .catch((reason) => {
        if ((reason as Error).name !== "AbortError") setError(reason instanceof Error ? reason.message : "Capabilities API unavailable.");
      });
    return () => controller.abort();
  }, []);

  if (error) return <section className="pixel-panel" role="alert" style={panelStyle}>{error}</section>;
  if (!data) return <section className="pixel-panel" style={panelStyle}>Loading capability evidence…</section>;

  return (
    <section aria-label="AI-DOS Git capability evidence" style={{ minWidth: 0 }}>
      <div className="pixel-panel" style={{ ...panelStyle, border: "2px solid #ffcf66" }}>
        <span className="panel-kicker">READ-ONLY CONTRACT</span>
        <h1>Capabilities — FIXTURE / NOT LIVE</h1>
        <p>All values below are sanitized server-local fixtures. No GitHub credential, write action, Queue mutation, Mission mutation, merge or deployment control is present.</p>
        <small>Generated: {data.generatedAt}</small>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        <article className="pixel-panel" style={panelStyle}>
          <span className="panel-kicker">MISSION SNAPSHOT</span>
          <h2>{data.mission.missionId} — {data.mission.title}</h2>
          <p>Status: <b>{data.mission.status}</b> · Active GEN: <b>{data.mission.activeGen}</b></p>
          <p>Owner: {data.mission.owner}</p>
          <SourceMeta source={data.mission.source} />
        </article>
        <article className="pixel-panel" style={panelStyle}>
          <span className="panel-kicker">REPOSITORY SNAPSHOT</span>
          <h2>{data.repository.repository}</h2>
          <p>Default branch: <b>{data.repository.defaultBranch}</b></p>
          <p>Recent commit: {data.repository.recentCommit}</p>
          <SourceMeta source={data.repository.source} />
        </article>
      </div>

      <article className="pixel-panel" style={panelStyle}>
        <span className="panel-kicker">OPEN / DRAFT PR SNAPSHOT</span>
        <div style={{ display: "grid", gap: 10 }}>
          {data.pullRequests.map((pr) => <div key={pr.number}><b>#{pr.number} {pr.title}</b><div>{pr.state} · {pr.draft ? "DRAFT" : "READY"} · {pr.head} → {pr.base}</div></div>)}
        </div>
      </article>

      <article className="pixel-panel" style={panelStyle}>
        <span className="panel-kicker">WORK COMPLETION EVIDENCE</span>
        <div style={{ display: "grid", gap: 14 }}>
          {data.workCompletion.map((work) => (
            <div key={work.workId}>
              <b>{work.workId} — {work.state}</b>
              <p>{work.reasons.join(" ")}</p>
              <small>{work.evidence.length > 0 ? work.evidence.map((item) => item.reference).join(" · ") : "No durable evidence"}</small>
            </div>
          ))}
        </div>
      </article>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        {data.capabilities.map((record) => <CapabilityCard key={record.id} record={record} />)}
      </div>
    </section>
  );
}
