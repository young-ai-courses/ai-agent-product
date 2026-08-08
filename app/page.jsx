'use client';
import { useState } from 'react';

const DEMO_EMAILS = `1. 來自：客戶王經理｜主旨：明天下午 2 點會議確認｜內容：請確認是否出席
2. 來自：人資部｜主旨：年假餘額提醒｜內容：您尚有 5 天年假未使用
3. 來自：供應商｜主旨：報價單 - 急件｜內容：附件為更新後報價，請今日回覆
4. 來自：電子報｜主旨：本週 AI 新聞摘要｜內容：OpenAI 發布新模型...
5. 來自：主管｜主旨：Q3 預算需今天送出｜內容：下午 5 點截止，請儘速`;

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const classify = () => {
    setLoading(true);
    // 模擬 Agent 分類結果（實際版本接 AI API）
    setTimeout(() => {
      setResult([
        { email: '客戶王經理 — 會議確認', level: '🔴', action: '回覆確認出席', tone: '正式' },
        { email: '供應商 — 報價單急件', level: '🔴', action: '回覆接受/議價', tone: '正式', alert: '⚠️ 今日截止' },
        { email: '主管 — Q3 預算', level: '🔴', action: '立刻送出', tone: '簡短', alert: '⚠️ 下午5點截止' },
        { email: '人資部 — 年假提醒', level: '🟡', action: '本週排假', tone: '輕鬆' },
        { email: '電子報 — AI 新聞', level: '⚪', action: '略過或週末讀', tone: '-' },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📬 Email 分類 Agent</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        貼上你的 email 清單，Agent 自動分成 🔴需回覆 / 🟡需追蹤 / ⚪可略過
      </p>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="貼上 email 清單..."
        style={{ width: '100%', height: 160, padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, resize: 'vertical' }}
      />

      <div style={{ display: 'flex', gap: 8, margin: '1rem 0' }}>
        <button onClick={classify} disabled={loading}
          style={{ padding: '10px 20px', background: '#e8590c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {loading ? '分類中...' : '🤖 Agent 分類'}
        </button>
        <button onClick={() => setInput(DEMO_EMAILS)}
          style={{ padding: '10px 20px', background: '#f1f1f1', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }}>
          載入範例
        </button>
      </div>

      {result && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ background: '#f8f8f8' }}>
              <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #e2e2e2' }}>優先</th>
              <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #e2e2e2' }}>Email</th>
              <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #e2e2e2' }}>建議動作</th>
              <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #e2e2e2' }}>語氣</th>
            </tr>
          </thead>
          <tbody>
            {result.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 10, fontSize: 20 }}>{r.level}</td>
                <td style={{ padding: 10 }}>
                  {r.alert && <span style={{ color: '#e8590c', fontWeight: 600, display: 'block', fontSize: 12 }}>{r.alert}</span>}
                  {r.email}
                </td>
                <td style={{ padding: 10 }}>{r.action}</td>
                <td style={{ padding: 10, color: '#888' }}>{r.tone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <footer style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #eee', color: '#999', fontSize: 13 }}>
        AI Agent 實作課 範例成品 · <a href="https://github.com/young-ai-courses/ai-agent-product" style={{ color: '#e8590c' }}>查看原始碼</a> · 
        <a href="https://github.com/young-ai-courses/ai-agent-workshop" style={{ color: '#e8590c' }}>Fork 帶走包開始做</a>
      </footer>
    </main>
  );
}
