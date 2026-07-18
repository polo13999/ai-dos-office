export type AgentState = "工作中" | "移動中" | "聊天中" | "喝咖啡" | "會議中" | "休息中";
export type Character = { id:string; name:string; role:string; avatar:string; x:number; y:number; targetX:number; targetY:number; state:AgentState; task:string; dialogue:string; mood:"專注"|"愉快"|"思考"|"疲倦"; accent:string; };
export type OfficeEvent = { id:string; time:string; type:"對話"|"任務"|"會議"|"移動"; message:string; };
