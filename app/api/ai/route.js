// 這支檔案就是「你的網站怎麼跟 AI 說話」的地方
//
// 前端（app/page.jsx）把使用者貼進來的 email 送到這裡 → 這裡轉給 Groq 的 AI
// → 把分類結果送回前端
//
// 為什麼不能讓前端直接打 Groq：API key 會被所有人看到（打開瀏覽器原始碼就有）。
// 所以 key 只放在這一層（伺服器端），前端永遠拿不到它。

// 👇 這就是這個 Agent 的人格與規則。改這裡 = 換一個 Agent
//
// 三個零件都在這段裡面：
//   ① 角色設定（你是誰、輸出什麼格式）
//   ② 判斷規則（怎麼分級、遇到模糊怎麼辦）
//   ③ 自我檢查（不確定的要講出來，不要編）
const SYSTEM_PROMPT = `你是一位資深行政助理，專長是幫忙分類收件匣。

使用者會貼一封 email（或一段訊息）給你。請輸出一個表格，欄位是：
「分級 | 這封在說什麼 | 建議動作 | 期限」

分級規則：
- 🔴 今天要處理：有明確期限且在三天內、或對方在等你回覆才能繼續
- 🟡 這週要處理：需要你做事但沒有急迫期限
- ⚪ 可以先放：通知、報告、訂閱，不需要你回應

規則：
- 期限只寫信裡真的有寫的日期。信裡沒寫就填「未提及」，不要自己推算
- 建議動作要具體到可以直接做（「回覆確認 9/3 是否可行」），不要寫「儘快處理」
- 判斷不了分級的，選較高的一級，並在最後說明為什麼
- 表格之後另外列一段「我不確定的地方」——沒有就寫「無」

只根據使用者貼的內容判斷，不要補你覺得應該有的事情。`;

// 一次最多接受多長的輸入
//
// 為什麼要有這行：沒有它，任何人都能貼 10 萬字進來，一次燒掉你一大塊免費額度。
// 這叫 size cap，是最便宜的一道防線。
const MAX_INPUT_CHARS = 4000;

// ⚠️ 這支 API 沒有做「認證」—— 任何知道你網址的人都可以用它（用的是你的 key）
//
// 自己用、或給少數人試用沒問題。真的要對不特定的人開放，最少要加這三樣：
//   1. 限流 rate limit — 同一個人一分鐘最多幾次
//   2. 認證 auth — 只有登入的人能用
//   3. 用量上限 quota — 一天最多花多少
export async function POST(request) {
  const { input } = await request.json();

  if (!input || !input.trim()) {
    return Response.json({ error: '沒有輸入內容' }, { status: 400 });
  }

  if (input.length > MAX_INPUT_CHARS) {
    return Response.json(
      { error: `一次最多 ${MAX_INPUT_CHARS} 個字，你給了 ${input.length} 個` },
      { status: 413 }
    );
  }

  // key 來自環境變數，不在程式碼裡 —— 這顆 repo 刻意留空，你自己填
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          '還沒設定 GROQ_API_KEY。到 Vercel 專案 → Settings → Environment Variables ' +
          '加上它，然後 Deployments → ⋯ → Redeploy（不重新部署不會生效）',
      },
      { status: 500 }
    );
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // ⚠️ 這行不能拿掉 —— 少了 User-Agent，Groq 會回 403
        'User-Agent': 'ai-agent-product/1.0',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: input },
        ],
        // temperature 調低 = 每次結果更穩定，格式比較不會跑掉
        temperature: 0.2,
        max_completion_tokens: 1200,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return Response.json(
        { error: `Groq 回了 ${res.status}`, detail: detail.slice(0, 500) },
        { status: 502 }
      );
    }

    const data = await res.json();
    const output = data.choices?.[0]?.message?.content ?? '(AI 沒有回傳內容)';
    return Response.json({ output });
  } catch (err) {
    return Response.json({ error: `呼叫失敗：${err.message}` }, { status: 500 });
  }
}
