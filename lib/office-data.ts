import { Character } from "./types";
export const INITIAL_CHARACTERS: Character[] = [
{id:"cto",name:"Nova",role:"CTO",avatar:"🧑‍💻",x:17,y:23,targetX:17,targetY:23,state:"工作中",task:"設計 Pixel Office Runtime",dialogue:"",mood:"專注",accent:"#7dd3fc"},
{id:"architect",name:"Atlas",role:"系統架構師",avatar:"🤖",x:37,y:21,targetX:37,targetY:21,state:"工作中",task:"整理角色行為狀態機",dialogue:"",mood:"思考",accent:"#c4b5fd"},
{id:"designer",name:"Mika",role:"UI/UX 設計師",avatar:"👩‍🎨",x:16,y:61,targetX:16,targetY:61,state:"工作中",task:"繪製辦公室互動介面",dialogue:"",mood:"愉快",accent:"#f9a8d4"},
{id:"developer",name:"Kai",role:"前端工程師",avatar:"🧑‍🚀",x:39,y:61,targetX:39,targetY:61,state:"工作中",task:"實作人物移動與動畫",dialogue:"",mood:"專注",accent:"#86efac"},
{id:"qa",name:"Echo",role:"QA",avatar:"🕵️",x:67,y:66,targetX:67,targetY:66,state:"工作中",task:"測試會議與對話流程",dialogue:"",mood:"思考",accent:"#fde68a"},
{id:"secretary",name:"Lumi",role:"秘書",avatar:"🧚",x:82,y:73,targetX:82,targetY:73,state:"工作中",task:"整理今日會議與任務",dialogue:"",mood:"愉快",accent:"#fca5a5"}
];
export const CHAT_LINES=["這個版本已經可以跑起來了。","我剛完成一個小功能。","等一下要一起開會嗎？","我正在整理目前的任務。","這個畫面可以再更像素一點。","今天的進度比預期快。","我需要喝杯咖啡再繼續。","剛剛發現一個可以改善的地方。"];
export const TASKS=["調整人物移動速度","整理辦公室空間配置","設計任務狀態面板","測試隨機對話","準備下一場產品會議","檢查地圖碰撞區域","更新角色工作進度","改善手機版畫面"];
