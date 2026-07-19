"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Direction="down"|"left"|"right"|"up";
type Agent={id:string;name:string;role:string;avatar:string;sprite:string;x:number;y:number;status:string;task:string;mood:number;energy:number;efficiency:number};
type Feed={time:string;name:string;text:string;avatar:string};

const agents:Agent[]=[
{id:"cto",name:"小智",role:"CTO",avatar:"/assets/cto-portrait.png",sprite:"/assets/characters/cto.png",x:15,y:21,status:"工作中",task:"Plugin Runtime 架構設計",mood:85,energy:72,efficiency:90},
{id:"backend",name:"阿強",role:"後端工程師",avatar:"/assets/backend-portrait.png",sprite:"/assets/characters/backend.png",x:35,y:21,status:"工作中",task:"API 整合測試",mood:78,energy:66,efficiency:86},
{id:"frontend",name:"凱文",role:"前端工程師",avatar:"/assets/frontend-portrait.png",sprite:"/assets/characters/frontend.png",x:43,y:29,status:"工作中",task:"儀表板 UI 優化",mood:82,energy:79,efficiency:88},
{id:"ai",name:"艾德",role:"AI 工程師",avatar:"/assets/ai-portrait.png",sprite:"/assets/characters/ai_engineer.png",x:55,y:21,status:"工作中",task:"AI Assistant 功能開發",mood:88,energy:74,efficiency:91},
{id:"designer",name:"小美",role:"設計師",avatar:"/assets/designer-portrait.png",sprite:"/assets/characters/designer.png",x:18,y:48,status:"討論中",task:"新功能 UI Flow",mood:89,energy:70,efficiency:87},
{id:"pm",name:"小明",role:"PM",avatar:"/assets/pm-portrait.png",sprite:"/assets/characters/pm.png",x:31,y:53,status:"移動中",task:"整理 Sprint 任務",mood:81,energy:68,efficiency:84},
{id:"secretary",name:"艾米",role:"AI 助理",avatar:"/assets/secretary-portrait.png",sprite:"/assets/characters/secretary.png",x:58,y:52,status:"待命中",task:"整理會議紀錄",mood:92,energy:80,efficiency:89},
{id:"qa",name:"小花",role:"QA",avatar:"/assets/qa-portrait.png",sprite:"/assets/characters/qa.png",x:70,y:55,status:"測試中",task:"回報新 Bug",mood:76,energy:64,efficiency:85},
{id:"ops",name:"大衛",role:"運維工程師",avatar:"/assets/ops-portrait.png",sprite:"/assets/characters/devops.png",x:21,y:74,status:"工作中",task:"監控 API 與資源",mood:80,energy:77,efficiency:88},
{id:"marketing",name:"凱莉",role:"行銷",avatar:"/assets/marketing-portrait.png",sprite:"/assets/characters/marketing.png",x:12,y:77,status:"工作中",task:"產品發表素材",mood:90,energy:73,efficiency:83},
{id:"hr",name:"麗莎",role:"HR",avatar:"/assets/hr-portrait.png",sprite:"/assets/characters/hr.png",x:31,y:78,status:"工作中",task:"人員配置規劃",mood:87,energy:69,efficiency:81},
{id:"admin",name:"露西",role:"秘書",avatar:"/assets/admin-portrait.png",sprite:"/assets/characters/secretary.png",x:61,y:72,status:"接待中",task:"安排今日行程",mood:91,energy:82,efficiency:86},
];

const taskRows=[
["Plugin Runtime 架構設計",68,"cto"],["AI Assistant 功能開發",45,"ai"],["儀表板 UI 優化",32,"frontend"],["資料庫結構設計",60,"backend"]
] as const;

const initialFeed:Feed[]=[
{time:"10:21",name:"CTO 小智",text:"完成了任務：Plugin Runtime 架構設計",avatar:"/assets/cto-portrait.png"},
{time:"10:18",name:"設計師 小美",text:"與 PM 小明 討論了新功能的 UI 流程",avatar:"/assets/designer-portrait.png"},
{time:"10:15",name:"後端工程師 阿強",text:"開始處理 API 整合",avatar:"/assets/backend-portrait.png"},
{time:"10:12",name:"QA 測試員 小花",text:"發現了 2 個 Bug",avatar:"/assets/qa-portrait.png"},
{time:"10:05",name:"AI 助理 艾米",text:"整理會議記錄",avatar:"/assets/secretary-portrait.png"},
];

export default function PixelOffice(){
 const [selectedId,setSelectedId]=useState("cto");
 const [paused,setPaused]=useState(false);
 const [speed,setSpeed]=useState(2);
 const [meeting,setMeeting]=useState(false);
 const [positions,setPositions]=useState(()=>Object.fromEntries(agents.map(a=>[a.id,{x:a.x,y:a.y,walking:false,direction:"down" as Direction}])));
 const homePositions=useRef(Object.fromEntries(agents.map(a=>[a.id,{x:a.x,y:a.y}])));
 const [observation,setObservation]=useState(true);
 const [coffee,setCoffee]=useState(true);
 const [feed,setFeed]=useState(initialFeed);
 const [clock,setClock]=useState(new Date());
 const selected=useMemo(()=>agents.find(a=>a.id===selectedId)!,[selectedId]);
 useEffect(()=>{const t=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(t)},[]);
 useEffect(()=>{if(paused)return;const lines=["API 環境架好了，等前端串接","架構部分我會再 Review 一次","新的設計稿已經上傳到 Figma","剛剛找到一個可以優化的地方","今天進度比預期快"];const t=setInterval(()=>{const a=agents[Math.floor(Math.random()*agents.length)];setFeed(v=>[{time:new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"}),name:`${a.role} ${a.name}`,text:lines[Math.floor(Math.random()*lines.length)],avatar:a.avatar},...v].slice(0,8))},5000/Math.max(speed,1));return()=>clearInterval(t)},[paused,speed]);

 useEffect(()=>{
  if(paused||meeting)return;
  const t=setInterval(()=>{
   const a=agents[Math.floor(Math.random()*agents.length)];
   const home=homePositions.current[a.id];
   const nx=Math.max(8,Math.min(90,home.x+(Math.random()*8-4)));
   const ny=Math.max(8,Math.min(90,home.y+(Math.random()*6-3)));
   setPositions(prev=>{
    const dx=nx-prev[a.id].x, dy=ny-prev[a.id].y;
    const direction:Direction=Math.abs(dx)>Math.abs(dy)?(dx>=0?"right":"left"):(dy>=0?"down":"up");
    return {...prev,[a.id]:{x:nx,y:ny,walking:true,direction}};
   });
   setTimeout(()=>setPositions(prev=>({...prev,[a.id]:{...prev[a.id],walking:false}})),900);
  },2400/Math.max(speed,1));
  return()=>clearInterval(t);
 },[paused,meeting,speed]);

 const toggleMeeting=()=>{
  setMeeting(v=>{
   const next=!v;
   if(next){
    const spots=[[58,22],[64,22],[70,22],[58,28],[64,28],[70,28],[58,34],[64,34],[70,34],[61,40],[67,40],[73,40]];
    setPositions(prev=>Object.fromEntries(agents.map((a,i)=>[a.id,{x:spots[i][0],y:spots[i][1],walking:true,direction:(Math.abs(spots[i][0]-prev[a.id].x)>Math.abs(spots[i][1]-prev[a.id].y)?(spots[i][0]>=prev[a.id].x?"right":"left"):(spots[i][1]>=prev[a.id].y?"down":"up")) as Direction}])));
    setTimeout(()=>setPositions(prev=>Object.fromEntries(Object.entries(prev).map(([id,pos])=>[id,{...pos,walking:false}]))),1400);
   }else{
    setPositions(prev=>Object.fromEntries(agents.map(a=>[a.id,{x:homePositions.current[a.id].x,y:homePositions.current[a.id].y,walking:true,direction:(Math.abs(homePositions.current[a.id].x-prev[a.id].x)>Math.abs(homePositions.current[a.id].y-prev[a.id].y)?(homePositions.current[a.id].x>=prev[a.id].x?"right":"left"):(homePositions.current[a.id].y>=prev[a.id].y?"down":"up")) as Direction}])));
    setTimeout(()=>setPositions(prev=>Object.fromEntries(Object.entries(prev).map(([id,pos])=>[id,{...pos,walking:false}]))),1400);
   }
   return next;
  });
 };

 const moodIcon=(a:Agent)=>{
  if(meeting)return a.id==='cto'?'📊':a.id==='qa'?'❓':'💬';
  if(coffee)return ['☕','😊','🍪','💬'][agents.indexOf(a)%4];
  if(a.id==='cto')return '💡';
  if(a.id==='qa')return '🐞';
  if(a.id==='designer')return '🎨';
  if(a.id==='admin')return '👋';
  return ['😊','💭','⚡','💻'][agents.indexOf(a)%4];
 };

 const bars=(value:number,kind:string)=><div className={`meter ${kind}`}><i style={{width:`${value}%`}}/></div>;
 return <main className="app">
  <aside className="left-rail">
   <div className="brand"><span>🏢</span><div><b>AI-DOS</b><small>PIXEL OFFICE</small></div></div>
   <section><div className="section-title">公司動態 <select><option>全部</option></select></div><div className="feed">{feed.map((f,i)=><article key={i}><img src={f.avatar}/><div><time>{f.time}</time><b>{f.name}</b><p>{f.text}</p></div></article>)}</div><button className="wide-btn">查看全部動態</button></section>
   <section className="company"><h3>公司狀態</h3><dl><div><dt>員工數量</dt><dd>12 / 20</dd></div><div><dt>專案進度</dt><dd>{bars(68,"green")} 68%</dd></div><div><dt>公司心情</dt><dd>😊 良好</dd></div><div><dt>今日會議</dt><dd>2 場</dd></div><div><dt>未讀通知</dt><dd className="yellow">3</dd></div></dl><h4>資源監控</h4>{[["CPU",42],["Memory",58],["GPU",67]].map(([n,v])=><div className="resource" key={n}><span>{n}</span>{bars(v as number,"green")}<em>{v}%</em></div>)}</section>
   <nav>{["🐸 工作 (W)","🦀 會議 (M)","🗂 任務 (T)","🧑 人員 (P)","⚙ 系統 (S)"].map(x=><button key={x}>{x}</button>)}</nav>
  </aside>

  <section className="center">
   <header className="topbar"><div>◷ <b>{clock.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</b></div><div>▣ {clock.toLocaleDateString("zh-TW")}</div><div>🌧 晴 24°C</div><div>☀ Day 62</div><div className="spacer"/><button onClick={()=>setPaused(v=>!v)}>{paused?"▶":"Ⅱ"}</button><button className="play" onClick={()=>setPaused(false)}>▶</button><select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={1}>1x</option><option value={2}>2x</option><option value={3}>3x</option></select><button onClick={toggleMeeting}>{meeting?"結束會議":"召集開會"}</button><button>⚙</button></header>
   <div className={`office-map ${meeting?"meeting-on":""}`}>
    <img className="office-bg" src="/assets/office-floor-v06.png" alt="AI-DOS office floor"/>
    {agents.map(a=>{const pos=positions[a.id];const row=({down:0,left:1,right:2,up:3} as Record<Direction,number>)[pos.direction];return <button key={a.id} className={`person ${selectedId===a.id?"active":""} ${pos.walking?"walking":""}`} style={{left:`${pos.x}%`,top:`${pos.y}%`,["--sprite" as string]:`url(${a.sprite})`,["--row-y" as string]:`${-row*56}px`}} onClick={()=>setSelectedId(a.id)}><span className="mood-bubble">{moodIcon(a)}</span><span className="sprite-wrap"><span className="character-sprite"/></span><b>{a.role} {a.name}</b></button>})}
    {meeting&&<div className="meeting-flash">MEETING LIVE</div>}
   </div>
   <div className="lower-grid">
    <section className="task-panel"><h3>任務隊列</h3><div className="tabs"><button>進行中 (4)</button><button>待處理 (2)</button><button>已完成 (12)</button></div>{taskRows.map(([name,p,id])=><div className="task-row" key={name}><img src={agents.find(a=>a.id===id)?.avatar}/><div><span>{name}</span>{bars(p,"green")}</div><b>{p}%</b></div>)}</section>
    <section className="chat-panel"><h3>🦖 團隊聊天</h3>{feed.slice(0,5).reverse().map((f,i)=><p key={i}><img src={f.avatar}/><span><small>{f.time} {f.name}</small>{f.text}</span></p>)}<input placeholder="輸入訊息..."/></section>
    <section className="observe-panel"><h3>👁 觀察模式 <i>LIVE</i></h3><div className="observe-lines"><p>關於 Plugin 的載入機制，我有個想法…</p><p>說說看，我聽聽你的方案</p><p>我覺得可以用動態載入的方式，效能會更好</p></div><div><button onClick={()=>setObservation(v=>!v)}>{observation?"Ⅱ 暫停觀察":"▶ 繼續觀察"}</button><button>退出觀察</button></div></section>
    <section className="coffee-panel"><h3>☕ 咖啡時間 <small>{coffee?"休息中":"工作中"}</small></h3><p>凱莉：今天的咖啡特別香 ☕</p><p>大衛：下午的會議應該會很精彩！</p><p>小花：希望我找到的 Bug 不會太多 😅</p><button onClick={()=>setCoffee(v=>!v)}>{coffee?"結束休息，回來工作":"開始 Coffee Break"}</button></section>
   </div>
  </section>

  <aside className="right-rail">
   <section className="profile"><h3>選擇的角色 <button>×</button></h3><div className="profile-head"><img src={selected.avatar}/><div><h2>{selected.role} {selected.name}</h2><p>● {selected.status}</p></div></div><div className="stats"><label>心情 😊 {bars(selected.mood,"green")} {selected.mood}%</label><label>體力 ⚡ {bars(selected.energy,"blue")} {selected.energy}%</label><label>效率 ⭐ {bars(selected.efficiency,"yellow")} {selected.efficiency}%</label></div></section>
   <section><h3>目前執行任務</h3><div className="current-task"><b>{selected.task}</b><span>進度 {bars(68,"green")} 68%</span><small>◷ 預計剩餘：2 小時 15 分鐘</small><button className="wide-btn">查看任務詳情</button></div></section>
   <section><h3>技能</h3>{["程式開發 ★★★★★","系統設計 ★★★★☆","領導力 ★★★★☆","溝通能力 ★★★★★","問題解決 ★★★★☆"].map(x=><p className="skill" key={x}>{x}</p>)}<button className="wide-btn">查看詳細技能</button></section>
   <section><h3>今日行程</h3><p>09:00 - 12:00　專案開發</p><p>13:30 - 14:30　技術討論會</p><p>15:00 - 16:00　架構設計</p><button className="wide-btn">完整行程</button></section>
   <section><h3>系統通知 <i className="badge">3</i></h3><p>🧭 新任務已指派給你</p><p>💬 QA 回報了新的 Bug</p></section>
  </aside>
 </main>
}
