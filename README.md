# 收件匣分類助手 — 半成品（你的保底）

> 新北市青年局 AI 實戰職涯營｜第二堂的完成版範例

**這顆 repo 的東西全部裝好了，只有一格是空的：API key。**
填進去就是一個真的能用、也能拿去 demo 的產品。

如果你自己那份今天沒做完，**fork 這顆**，你手上就有東西 ——
10 月 Demo Day 可以直接長在它上面。

---

## 已經幫你裝好的

| 這一層 | 狀態 |
|---|---|
| **前端畫面** | ✅ 貼上 email → 按送出 → 看結果（`app/page.jsx`） |
| **AI Agent** | ✅ 伺服器端呼叫 Groq，分三級 ＋ 建議動作 ＋ 期限（`app/api/ai/route.js`） |
| **Vercel 部署設定** | ✅ `vercel.json`，import 完直接 Deploy |
| **CI／CD** | ✅ `.github/workflows/ci.yml` —— 每次 push 自動檢查 build 得起來 |
| **安全邊界** | ✅ key 只在伺服器端、輸入長度上限、`User-Agent` header |
| **API key** | ⬜ **空的 —— 這是你要填的唯一一格** |

---

## 唯一要你做的事

**1. 拿一把 key**
[console.groq.com](https://console.groq.com) → API Keys → **Create API Key**
（免費，llama-3.3-70b 每天 1,000 次。它只出現一次，馬上複製）

**2. 填進去**

部署在 Vercel（推薦）：
`Vercel 專案 → Settings → Environment Variables → 新增 GROQ_API_KEY → 貼上`
→ 回 **Deployments → ⋯ → Redeploy**（🔴 不重新部署不會生效）

只想在自己電腦跑：把 `.env.example` 複製成 `.env.local`，把 key 填在 `GROQ_API_KEY=` 後面。

**3. 驗收**
打開你的網址 → 按「放一封範例信」→ 按「幫我分類」→
看到一張分好級的表格，就是通了。

| 你看到 | 意思 |
|---|---|
| 「還沒設定 GROQ_API_KEY」 | key 沒加，或加了沒 Redeploy |
| 「Groq 回了 401」 | key 貼錯或已被刪，重產一把 |
| 「Groq 回了 429」 | 碰到 Groq 的 rate limit。稍後再試，不是你弄壞了 |
| 「Groq 回了 403」 | `User-Agent` 那行被拿掉了，加回去 |

---

## 不用打指令也能上線

整個流程都可以交辦給 Codex（ChatGPT 桌面版）：

```
請幫我把這個專案部署上線。我不會用終端機，
每一步先講你要做什麼，再執行。

1. fork 並下載 github.com/young-ai-courses/ai-agent-product
2. 部署到 Vercel production，第一次問的設定全部用預設
3. 把 GROQ_API_KEY 加進環境變數（key 我貼給你，不要印在畫面上）
4. 加完再部署一次讓 key 生效，不重跑不會生效
5. 把網址給我，並確認打開不是 404
```

---

## 想改成自己的東西

它現在做的是「分類 email」。要換成別的（分類客服訊息、整理會議筆記、
判斷履歷…），改的都是同一個地方 —— **AI 的角色設定**。跟 Codex 說：

```
把 AI 的角色設定換成這段 —

（寫你要它做什麼、輸出什麼格式、遇到不確定怎麼辦）

只改這件事，其他都不要動。
```

| 你想動 | 改哪裡 |
|---|---|
| AI 的行為、輸出格式 | `app/api/ai/route.js` 的角色設定 |
| 畫面文字、顏色、按鈕 | `app/page.jsx` |
| 回答不穩、格式每次都跑掉 | 先把 temperature 調低（現在是 0.2），不要急著換 model |

---

## 這顆跟另外兩顆的分工

| repo | 用途 |
|---|---|
| [ai-agent-workshop](https://github.com/young-ai-courses/ai-agent-workshop) | **練習用** —— 從空的開始自己做，附助教（`AGENTS.md`）與六張工單 |
| **ai-agent-product**（這顆） | **保底用** —— 全部裝好、只差 key，拿去就能 demo 跟繼續長 |
| [ai-workflow-workshop](https://github.com/young-ai-courses/ai-workflow-workshop) | 第一堂的競品監控器 |

---

## ⚠️ 要對外開放之前

這支 API 目前**沒有認證** —— 任何知道你網址的人都能用（花的是你的額度）。
自己用或給少數人試沒問題；真的要公開，最少要加：**限流**、**認證**、**用量上限**。

這三個字之後在職場上你會一直聽到。現在先知道「為什麼需要它們」就夠了 ——
因為你手上這個東西，正好就缺它們。
