# AI-DOS Pixel Office v0.6

本版以 v0.5 為基礎迭代：

- 改用 1536px 高解析度完整 Office Floor，移除低解析度 405px 放大底圖。
- 背景採原圖比例 1536:1133 顯示，避免拉伸與文字模糊。
- 從使用者提供的 Character Asset Foundation 圖重新切出 14 組透明 Sprite Sheet。
- 每組 Sprite 為 192×128：4 方向，每方向 4 格行走 + 2 格坐姿。
- 角色比例重新調整，並重新校準工作區與會議室座標。
- 心情泡泡提升圖層與高度，避免被姓名牌或角色遮住。
- 召集會議時角色會集中至會議室，結束後返回原位。

## 執行

```bash
npm install
npm run dev
```

瀏覽 `http://localhost:3000`。

## 驗證

```bash
npx tsc --noEmit
```

已通過 TypeScript 檢查。Next.js 開發伺服器已成功啟動並回傳 HTTP 200。
