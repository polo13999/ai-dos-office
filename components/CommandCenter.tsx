"use client";

import { useMemo, useState } from "react";
import PixelOffice from "./PixelOffice";
import QueueDashboard from "./QueueDashboard";

type View = "home" | "projects" | "war" | "missions" | "queues" | "team" | "analytics" | "messages" | "office";
type Priority = "Critical" | "High" | "Medium" | "Low";

const navArt: Record<View | "settings", string> = {
  home: "/assets/v092/home.png", projects: "/assets/v092/projects.png", war: "/assets/v092/war.png", missions: "/assets/v092/missions.png", queues: "/assets/v092/missions.png", team: "/assets/v092/team.png", analytics: "/assets/v092/analytics.png", messages: "/assets/v092/messages.png", office: "/assets/v092/office.png", settings: "/assets/v092/settings.png"
};

const projects = [
  { icon: "🧠", name: "AI-DOS Core", code: "CORE", progress: 82, health: 94, status: "穩定推進", mission: "Mission Completion Vertical Slice", blocker: "0", tone: "green" },
  { icon: "🏠", name: "Real Estate Plugin", code: "REAL", progress: 68, health: 81, status: "等待 Review", mission: "REAL-0036", blocker: "1", tone: "amber" },
  { icon: "🏢", name: "AI-DOS Office", code: "OFFICE", progress: 74, health: 93, status: "v0.9.3 最終美術整合", mission: "AI Company Experience", blocker: "0", tone: "green" },
  { icon: "⚙️", name: "APM Runtime", code: "APM", progress: 41, health: 72, status: "暫停等待", mission: "Installer Final Gate", blocker: "1", tone: "red" },
];

const blockers: { priority: Priority; title: string; project: string; owner: string; age: string; advice: string }[] = [
  { priority: "High", title: "GEN-0013 Final Gate 尚未完成", project: "APM Runtime", owner: "CTO", age: "6 天", advice: "先在本機重新執行 final gate，確認 EPERM 是否已排除。" },
  { priority: "High", title: "REAL-0036 等待 UX 方向確認", project: "Real Estate", owner: "Founder", age: "2 天", advice: "先核准垂直切片範圍，避免 UI 與資料層同時擴張。" },
  { priority: "Medium", title: "本機 AI 員工尚未配置模型", project: "AI Runtime", owner: "Founder", age: "今天", advice: "3090 安裝後先建立單一 Reviewer Agent 驗證流程。" },
  { priority: "Low", title: "Analytics 仍使用 Mock Data", project: "Office", owner: "Product", age: "今天", advice: "維持 Mock，等 Core 資料接口穩定後再串接。" },
];

const missions = {
  backlog: ["建立本機 Agent Provider", "定義公司資金資料模型"],
  doing: ["OFFICE-0004 War Room", "OFFICE-0005 Project Center", "Mission Completion Slice"],
  blocked: ["GEN-0013 Final Gate", "REAL-0036 UX Approval"],
  review: ["Primitive Closure Review"],
  done: ["OFFICE-0001 Layout", "OFFICE-0002 Navigation", "OFFICE-0003 Home Dashboard"],
};

const activity = [
  ["14:30", "Office", "v0.9.3 Final Art Pass 完成"],
  ["10:55", "Core", "Mission State 測試全部通過"],
  ["10:10", "CTO", "Primitive Closure Review 完成 78%"],
  ["09:35", "QA", "偵測到 2 個 High Blocker"],
  ["09:00", "System", "12 位 AI 員工上線"],
];

const founderQueue = [
  { title: "確認 Mission Completion Vertical Slice", meta: "需要 Founder 決策 · 今天", tone: "urgent" },
  { title: "核准 REAL-0036 UX 範圍", meta: "產品方向 · 等待確認", tone: "normal" },
  { title: "3090 本機 AI 員工配置", meta: "硬體與模型策略 · 下午", tone: "normal" },
];

const ctoQueue = [
  { title: "Review Primitive Closure", progress: 78 },
  { title: "整理 Mission State Gate", progress: 64 },
  { title: "準備本機 Agent Runtime", progress: 42 },
];

const navItems: { id: View; icon: string; label: string; badge?: string; danger?: boolean }[] = [
  { id: "home", icon: "🏠", label: "首頁", badge: "H" },
  { id: "projects", icon: "📂", label: "專案", badge: "4" },
  { id: "war", icon: "🚨", label: "戰情室", badge: "2", danger: true },
  { id: "missions", icon: "📋", label: "任務", badge: "9" },
  { id: "queues", icon: "🗂️", label: "工作佇列" },
  { id: "team", icon: "👥", label: "AI 團隊", badge: "12" },
  { id: "analytics", icon: "📈", label: "分析" },
  { id: "messages", icon: "💬", label: "訊息", badge: "3" },
  { id: "office", icon: "🏢", label: "像素辦公室" },
];

function PanelTitle({ kicker, title, right }: { kicker: string; title: string; right?: React.ReactNode }) {
  return <header className="panel-heading"><div><span className="panel-kicker">{kicker}</span><h3>{title}</h3></div>{right}</header>;
}

export default function CommandCenter() {
  const [view, setView] = useState<View>("home");
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "早安";
    if (hour < 18) return "午安";
    return "晚安";
  }, []);

  if (view === "office") {
    return <div className="office-stage"><button className="return-command" onClick={() => setView("home")}>← 返回 Command Center</button><PixelOffice /></div>;
  }

  const titles: Record<Exclude<View, "office">, [string, string]> = {
    home: [`${greeting}，Founder ☀️`, "公司運作正常。先處理紅色事項，再開始今天的工作。"],
    projects: ["Project Center", "查看所有產品、Plugin 與基礎設施的健康狀態。"],
    war: ["War Room 戰情室", "把卡住、緊急與需要決策的事情集中在同一個地方。"],
    missions: ["Mission Board", "追蹤任務從待辦、執行、阻塞、審查到完成。"],
    queues: ["Work / Research Queue", "唯讀查看權威 Work 與 Research 清單、狀態、等待原因與來源新鮮度。"],
    team: ["AI Team", "查看每位 AI 員工的專長、任務與目前狀態。"],
    analytics: ["Company Analytics", "用最少的圖表掌握公司成長、效率與成本。"],
    messages: ["Notification Center", "集中查看需要注意、決策與追蹤的公司訊息。"],
  };

  return (
    <main className="command-shell">
      <aside className="command-sidebar">
        <div className="pixel-logo"><img src="/assets/v091/crest.png" alt="" /><div><strong>AI-DOS</strong><small>PIXEL COMMAND</small></div></div>
        <div className="founder-profile pixel-panel">
          <div className="founder-art"><img src="/assets/v091/founder-avatar.png" alt="Founder pixel avatar" /></div>
          <div><small>FOUNDER</small><b>Lv.18</b><span>在線</span></div>
          <div className="founder-xp"><i /></div>
          <p>HP 98 / FOCUS 76</p>
        </div>
        <nav className="command-nav">
          {navItems.map(item => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}><img className="nav-art" src={navArt[item.id]} alt="" /> <span>{item.label}</span>{item.badge && <em className={item.danger ? "danger-dot" : ""}>{item.badge}</em>}</button>)}
          <button><img className="nav-art" src={navArt.settings} alt="" /> <span>設定</span></button>
        </nav>
        <div className="sidebar-status"><span className="status-orb" /><div><b>系統在線</b><small>12 位 AI 員工工作中</small></div></div>
      </aside>

      <section className="command-main">
        <div className="game-hud">
          <div><span>📅 DAY 18</span><b>09:42 ☀️</b></div>
          <div className="hud-meter"><span>⚡ ENERGY</span><i><em style={{width:"82%"}} /></i><b>82/100</b></div>
          <div className="hud-meter mood"><span>🙂 TEAM MOOD</span><i><em style={{width:"87%"}} /></i><b>GOOD</b></div>
          <div className="hud-wallet"><span>🪙 1,250</span><span>💎 35</span></div>
        </div>
        <header className="command-topbar">
          <div><span className="tiny-label">AI-DOS OFFICE v0.9.3</span><h1>{titles[view][0]}</h1><p>{titles[view][1]}</p></div>
          <div className="top-actions"><button>🔔 <i>3</i></button><button className="founder-chip"><span>🧑🏻‍💻</span><div><b>Founder</b><small>總部在線</small></div></button></div>
        </header>

        {view === "home" && <HomeView setView={setView} />}
        {view === "projects" && <ProjectsView />}
        {view === "war" && <WarRoomView />}
        {view === "missions" && <MissionView />}
        {view === "queues" && <QueueDashboard />}
        {view === "team" && <TeamView />}
        {view === "analytics" && <AnalyticsView />}
        {view === "messages" && <MessagesView />}
      </section>
      <footer className="command-footer"><span>AI-DOS Office v0.9.3</span><span><i className="status-orb" /> 系統運行正常</span><strong>All systems operational. Keep building, Founder! 🚀</strong></footer>
    </main>
  );
}

function HomeView({ setView }: { setView: (view: View) => void }) {
  return <>
    <section className="hero-status pixel-panel art-hero">
      <img className="hero-castle" src="/assets/v091/castle-hero.png" alt="AI-DOS pixel headquarters" />
      <div className="hero-shade" />
      <div className="robot-guide"><img src="/assets/v091/robot-guide.png" alt="" /><span>指揮官，今天一起征服任務吧！</span></div>
      <div className="hero-copy"><span className="panel-kicker">WAR ROOM OVERVIEW</span><h2>AI-DOS 總部一切正常</h2><p>目前沒有 Critical 事件。2 個 High Blocker 已列入戰情室，等待依序處理。</p><div className="hero-actions"><button className="primary-pixel" onClick={() => setView("missions")}>⚔️ 查看今日任務</button><button onClick={() => setView("office")}>🏰 進入像素辦公室 →</button></div></div>
      <div className="company-health"><div className="health-ring"><strong>92</strong><small>健康度</small></div><span>❤️ ❤️ ❤️ ❤️ 🤍</span><b>EXCELLENT</b></div>
    </section>
    <section className="metric-grid art-metrics"><Metric icon="🤖" art="/assets/v093/team-stat.png" label="AI 員工" value="12" meta="10 工作中 · 2 待命" /><Metric icon="📂" art="/assets/v093/project-stat.png" label="進行中專案" value="4" meta="3 健康 · 1 等待" /><Metric icon="🚨" art="/assets/v093/alert-stat.png" label="需要處理" value="2" meta="沒有 Critical" alert /><Metric icon="💰" art="/assets/v093/coin-stat.png" label="公司資金" value="$12,580" meta="今日 +$86 · Mock" /></section>
    <section className="quick-action-bar pixel-panel"><div><span className="panel-kicker">QUICK ACTIONS</span><b>指揮官捷徑</b></div><button onClick={() => setView("missions")}><img src="/assets/v093/quest-sword.png" alt=""/><span>建立任務</span></button><button onClick={() => setView("war")}><img src="/assets/v093/review-shield.png" alt=""/><span>任務 Review</span></button><button onClick={() => setView("team")}><img src="/assets/v093/meeting-team.png" alt=""/><span>召開討論</span></button><button onClick={() => setView("projects")}><img src="/assets/v093/deploy-rocket.png" alt=""/><span>部署系統</span></button></section>
    <section className="dashboard-grid">
      <article className="pixel-panel queue-panel"><PanelTitle kicker="FOUNDER QUEUE" title="需要你的決策" right={<button>查看全部</button>} />{founderQueue.map((item,index)=><div className={`queue-row ${item.tone}`} key={item.title}><span className="quest-no">{String(index+1).padStart(2,"0")}</span><div><b>{item.title}</b><small>{item.meta}</small></div><button>處理 →</button></div>)}</article>
      <article className="pixel-panel cto-panel"><PanelTitle kicker="CTO QUEUE" title="技術指揮台" right={<span className="live-badge">LIVE</span>} />{ctoQueue.map(item=><div className="cto-row" key={item.title}><div><b>{item.title}</b><small>{item.progress}%</small></div><div className="pixel-progress"><i style={{width:`${item.progress}%`}} /></div></div>)}<div className="cto-note"><span>💡</span><p><b>CTO 建議</b>先完成 Mission Closure，再開始新 Primitive，能避免範圍再次擴張。</p></div></article>
      <article className="pixel-panel report-panel"><PanelTitle kicker="TODAY REPORT" title="今日公司報告" right={<span>Day 64</span>} /><div className="report-list"><div><span>Runtime</span><b className="green">穩定</b></div><div><span>Architecture</span><b className="green">健康</b></div><div><span>Blockers</span><b className="amber">2 個待處理</b></div><div><span>Security</span><b className="green">沒有重大風險</b></div></div><div className="mini-timeline">{activity.slice(0,3).map(([time,,text])=><><span key={`${time}-t`}>{time}</span><p key={`${time}-p`}>{text}</p></>)}</div></article>
      <article className="pixel-panel office-entry art-office-entry"><div className="office-preview"><img src="/assets/v091/team-party.png" alt="Pixel Office preview" /><span>12 AI ONLINE</span></div><div><span className="panel-kicker">PIXEL OFFICE</span><h3>走進你的 AI 公司</h3><p>查看每位 AI 員工目前的位置、任務、心情與工作狀態。</p><button className="primary-pixel" onClick={() => setView("office")}>進入辦公室</button></div></article>
    </section>
  </>;
}

function Metric({icon,art,label,value,meta,alert}:{icon:string;art?:string;label:string;value:string;meta:string;alert?:boolean}) { return <article className={`metric-card pixel-panel ${alert?"alert":""}`}>{art?<img className="metric-art" src={art} alt=""/>:<span>{icon}</span>}<div><small>{label}</small><strong>{value}</strong><em>{meta}</em></div></article>; }

function ProjectsView() {
  const [selected, setSelected] = useState(projects[0]);
  return <div className="v082-grid project-layout">
    <section className="project-list">{projects.map(project=><button key={project.code} className={`project-card pixel-panel ${selected.code===project.code?"selected":""}`} onClick={()=>setSelected(project)}><span className="project-icon">{project.icon}</span><div className="project-main"><small>{project.code}</small><h3>{project.name}</h3><p>{project.status}</p><div className="project-progress"><i style={{width:`${project.progress}%`}} /></div></div><div className="project-score"><strong>{project.progress}%</strong><span className={project.tone}>{project.health} HP</span></div></button>)}</section>
    <aside className="project-detail pixel-panel"><PanelTitle kicker="PROJECT DETAIL" title={selected.name} right={<span className={`health-tag ${selected.tone}`}>{selected.health} HEALTH</span>} /><div className="project-hero"><span>{selected.icon}</span><div><small>目前 Mission</small><h2>{selected.mission}</h2><p>{selected.status}</p></div></div><div className="detail-stats"><div><small>進度</small><b>{selected.progress}%</b></div><div><small>Blocker</small><b>{selected.blocker}</b></div><div><small>本週完成</small><b>6</b></div></div><div className="ai-advice"><b>🤖 AI 建議</b><p>{selected.blocker==="0"?"目前可以繼續推進，但先維持單一垂直切片，避免同時打開新範圍。":"先處理目前 Blocker，再啟動下一個 Mission，能降低返工風險。"}</p></div><h4>最近活動</h4><div className="activity-list">{activity.slice(0,4).map(([time,scope,text])=><div key={time}><time>{time}</time><span><b>{scope}</b>{text}</span></div>)}</div></aside>
  </div>;
}

function WarRoomView() {
  const counts = { Critical: 0, High: 2, Medium: 1, Low: 1 };
  return <>
    <section className="war-hero pixel-panel"><div><span className="panel-kicker">SURVIVAL STATUS</span><h2>總部安全，但有 2 個高優先阻塞</h2><p>今天的目標不是做更多，而是讓紅色與橘色項目往前移動。</p></div><div className="danger-meter"><span>DANGER LEVEL</span><strong>LOW</strong><div>❤️ ❤️ ❤️ ❤️ 🤍</div></div></section>
    <section className="severity-grid">{(["Critical","High","Medium","Low"] as Priority[]).map(priority=><article className={`severity-card pixel-panel ${priority.toLowerCase()}`} key={priority}><small>{priority}</small><strong>{counts[priority]}</strong><span>{priority==="Critical"?"立即處理":priority==="High"?"今日處理":priority==="Medium"?"排入計畫":"持續觀察"}</span></article>)}</section>
    <section className="war-layout"><article className="pixel-panel blocker-board"><PanelTitle kicker="BLOCKER CENTER" title="目前阻塞" right={<span className="live-badge">LIVE</span>} />{blockers.map((item,index)=><div className="blocker-row" key={item.title}><div className={`priority-rune ${item.priority.toLowerCase()}`}>{item.priority[0]}</div><div className="blocker-copy"><div><b>{item.title}</b><span>{item.project}</span></div><small>Owner：{item.owner} · 已等待 {item.age}</small><p>💡 {item.advice}</p></div><button>展開</button></div>)}</article><aside className="pixel-panel situation-panel"><PanelTitle kicker="CTO SITUATION REPORT" title="今日戰情報告" /><div className="situation-sprite">🧙‍♂️</div><h3>Founder，現在先處理這兩件事：</h3><ol><li>完成 GEN-0013 Final Gate</li><li>核准 REAL-0036 UX 範圍</li></ol><div className="war-note"><b>預估結果</b><p>解開後可讓 3 個 Mission 恢復流動，並降低下一輪架構返工。</p></div><button className="primary-pixel">產生處理順序</button></aside></section>
  </>;
}

function MissionView() {
  const columns = [
    ["BACKLOG",missions.backlog,"📦"], ["DOING",missions.doing,"⚒️"], ["BLOCKED",missions.blocked,"⛔"], ["REVIEW",missions.review,"🔎"], ["DONE",missions.done,"✅"],
  ] as const;
  return <><section className="mission-summary pixel-panel"><div><b>9</b><span>全部 Mission</span></div><div><b>3</b><span>進行中</span></div><div className="warn"><b>2</b><span>阻塞</span></div><div><b>3</b><span>本週完成</span></div><p><strong>AI 建議：</strong>今天只要讓一個 Blocked Mission 回到 Doing，就算是高價值進展。</p></section><section className="kanban-board">{columns.map(([title,items,icon])=><div className={`kanban-column ${title.toLowerCase()}`} key={title}><header><span>{icon} {title}</span><b>{items.length}</b></header>{items.map((item,index)=><article className="mission-card pixel-panel" key={item}><small>{title.slice(0,2)}-{String(index+1).padStart(3,"0")}</small><h4>{item}</h4><div><span>{title==="DONE"?"完成":title==="BLOCKED"?"等待處理":"AI-DOS"}</span><em>{title==="DOING"?`${55+index*12}%`:""}</em></div>{title==="DOING"&&<div className="project-progress"><i style={{width:`${55+index*12}%`}} /></div>}</article>)}</div>)}</section></>;
}


const aiTeam = [
  {name:"Nova",role:"CTO",icon:"cto",status:"Review 中",task:"Mission Completion Slice",load:86,mood:"專注",skill:"架構 / 決策",place:"CTO Office"},
  {name:"Atlas",role:"系統架構師",icon:"architect",status:"工作中",task:"Primitive Closure",load:72,mood:"思考",skill:"架構 / 邊界",place:"War Room"},
  {name:"Kai",role:"前端工程師",icon:"frontend",status:"工作中",task:"Office v0.9.3",load:91,mood:"愉快",skill:"React / UI",place:"Dev Zone"},
  {name:"Mika",role:"UI/UX 設計師",icon:"designer",status:"待命",task:"Pixel UI Polish",load:34,mood:"愉快",skill:"UX / Pixel UI",place:"Design Lab"},
  {name:"Echo",role:"QA Engineer",icon:"qa",status:"測試中",task:"Release Validation",load:78,mood:"專注",skill:"測試 / 風險",place:"QA Lab"},
  {name:"Forge",role:"DevOps",icon:"devops",status:"監控中",task:"Build Pipeline",load:61,mood:"專注",skill:"CI / Runtime",place:"Server Room"},
  {name:"Lumi",role:"秘書",icon:"secretary",status:"整理中",task:"Founder Queue",load:47,mood:"愉快",skill:"摘要 / 排程",place:"Front Desk"},
  {name:"Coin",role:"AI CFO",icon:"finance",status:"分析中",task:"API Cost Forecast",load:55,mood:"思考",skill:"成本 / 營收",place:"Finance Desk"},
];

function TeamView(){
  const [selected,setSelected]=useState(aiTeam[0]);
  return <section className="team-layout"><div className="team-grid">{aiTeam.map(agent=><button key={agent.name} className={`agent-card pixel-panel ${selected.name===agent.name?"selected":""}`} onClick={()=>setSelected(agent)}><div className="agent-avatar"><img src={`/assets/characters/${agent.icon}.png`} alt={agent.role}/><span className="agent-online"/></div><div className="agent-copy"><small>{agent.role}</small><h3>{agent.name}</h3><p>{agent.status}</p><div className="project-progress"><i style={{width:`${agent.load}%`}}/></div><em>{agent.load}% LOAD</em></div></button>)}</div><aside className="agent-detail pixel-panel"><PanelTitle kicker="AI EMPLOYEE" title={selected.name} right={<span className="live-badge">ONLINE</span>}/><div className="agent-portrait"><img src={`/assets/characters/${selected.icon}.png`} alt={selected.role}/><div><small>{selected.role}</small><h2>{selected.name}</h2><p>心情：{selected.mood}</p></div></div><dl><div><dt>目前任務</dt><dd>{selected.task}</dd></div><div><dt>專長</dt><dd>{selected.skill}</dd></div><div><dt>所在位置</dt><dd>{selected.place}</dd></div><div><dt>工作負載</dt><dd>{selected.load}%</dd></div></dl><div className="ai-advice"><b>🤖 派工建議</b><p>{selected.load>80?"目前負載偏高，先完成現有任務，不建議再追加工作。":"仍有可用容量，適合接一個小型、邊界清楚的 Mission。"}</p></div><button className="primary-pixel">開啟對話（v0.9）</button></aside></section>;
}

function AnalyticsView(){
 const bars=[68,74,81,77,88,92,96];
 return <><section className="metric-grid analytics-metrics"><Metric icon="💰" label="公司資金" value="$12,580" meta="Mock Data · 今日 +$86"/><Metric icon="📈" label="本月收入" value="$1,840" meta="API / Plugin / Service"/><Metric icon="⚡" label="Mission Velocity" value="6.4" meta="每週平均完成"/><Metric icon="🧾" label="AI 成本" value="$126" meta="本月估算"/></section><section className="analytics-grid"><article className="pixel-panel chart-panel"><PanelTitle kicker="COMPANY GROWTH" title="最近 7 天進度" right={<span>+28%</span>}/><div className="bar-chart">{bars.map((v,i)=><div key={i}><i style={{height:`${v}%`}}/><span>D{i+1}</span></div>)}</div></article><article className="pixel-panel finance-panel"><PanelTitle kicker="AI CFO" title="資金與成本"/><div className="cash-display"><span>可用資金</span><strong>$12,580</strong><small>此版本為 Mock Data</small></div><div className="finance-row"><span>今日收入</span><b className="green">+$86</b></div><div className="finance-row"><span>API 成本</span><b className="amber">-$12</b></div><div className="finance-row"><span>GPU 電費估算</span><b className="amber">-$3</b></div><div className="finance-row total"><span>今日淨變化</span><b className="green">+$71</b></div></article><article className="pixel-panel wide-chart"><PanelTitle kicker="PROJECT HEALTH" title="產品健康分布"/><div className="health-bars">{projects.map(p=><div key={p.code}><span>{p.code}</span><div><i style={{width:`${p.health}%`}}/></div><b>{p.health}</b></div>)}</div></article><article className="pixel-panel cfo-note"><div className="situation-sprite">🧮</div><div><span className="panel-kicker">CFO REPORT</span><h3>目前適合小幅擴張</h3><p>專案健康度上升，成本仍可控。3090 上線後先觀察一週電費與本機模型產出，再決定是否增加第二位常駐 Agent。</p></div></article></section></>;
}

function MessagesView(){
 const notices=[
  ["🚨","高優先","GEN-0013 Final Gate 等待處理","CTO · 10 分鐘前"],
  ["🧑🏻‍💻","Founder","REAL-0036 UX 範圍需要你的決策","Product · 35 分鐘前"],
  ["✅","完成","Office v0.9.3 Final Art Build 驗證完成","QA · 1 小時前"],
  ["🤖","AI Team","Reviewer Agent 已準備等待 3090","Runtime · 今天"],
  ["💰","Finance","本月 API 成本仍在預算範圍內","CFO · 今天"],
 ];
 return <section className="messages-layout"><article className="pixel-panel notice-list"><PanelTitle kicker="NOTIFICATION CENTER" title="公司訊息" right={<button>全部標為已讀</button>}/>{notices.map(([icon,type,title,meta],i)=><button className={`notice-row ${i<2?"unread":""}`} key={title}><span>{icon}</span><div><small>{type}</small><b>{title}</b><em>{meta}</em></div><i>›</i></button>)}</article><aside className="pixel-panel inbox-summary"><PanelTitle kicker="TODAY" title="訊息摘要"/><div className="detail-stats"><div><small>未讀</small><b>3</b></div><div><small>需決策</small><b>2</b></div><div><small>系統</small><b>5</b></div></div><div className="cto-note"><span>💡</span><p><b>優先閱讀</b>先處理 Founder 與 High Blocker 訊息，其他通知可以留到 Mission Review 後。</p></div></aside></section>;
}
