'use client';

import { useState } from 'react';

// 這是使用者看得到的畫面。它只做三件事：
//   ① 收使用者貼進來的 email
//   ② 送到 /api/ai（伺服器端，key 在那裡）
//   ③ 把 AI 回的分類結果印出來
//
// 注意：這裡完全沒有 API key。key 只存在伺服器端那支 route，
// 因為這個檔案的內容任何人打開瀏覽器原始碼就看得到。

const SAMPLE = `Hi Young,

上次提到的報價需要在 9/3 前回覆，客戶那邊在等。
另外季報表我已經放在共用資料夾，你有空看一下就好。
下週三的例會改到四點，記得改行事曆。

Thanks,
Amy`;

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || `發生錯誤（${res.status}）`);
      else setOutput(data.output);
    } catch (err) {
      setError(`連線失敗：${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 820,
        margin: '0 auto',
        padding: '3rem 1.5rem 5rem',
        fontFamily: '"Helvetica Neue", "Noto Sans TC", sans-serif',
        color: '#141414',
      }}
    >
      <h1 style={{ fontSize: '2rem', margin: 0, letterSpacing: '-0.02em' }}>
        收件匣分類助手
      </h1>
      <p style={{ fontSize: '1.05rem', color: '#4a4a48', lineHeight: 1.7, marginTop: '0.6rem' }}>
        貼一封 email 進來，它會分成 🔴 今天要處理 / 🟡 這週 / ⚪ 可以先放，
        並給你一個可以直接做的下一步。
      </p>

      <form onSubmit={submit} style={{ marginTop: '1.8rem' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          placeholder="把 email 貼在這裡…"
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            lineHeight: 1.6,
            border: '1.5px solid #e6e3dc',
            borderRadius: 8,
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.9rem' }}>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? '#c9c6bf' : '#e8590c',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '0.8rem 1.6rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: loading || !input.trim() ? 'default' : 'pointer',
            }}
          >
            {loading ? '分類中…' : '幫我分類'}
          </button>
          <button
            type="button"
            onClick={() => setInput(SAMPLE)}
            style={{
              background: 'none',
              border: 'none',
              color: '#c2410c',
              fontSize: '0.95rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            放一封範例信
          </button>
        </div>
      </form>

      {error && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem 1.2rem',
            background: '#fdefe4',
            borderLeft: '4px solid #e8590c',
            borderRadius: 4,
            lineHeight: 1.7,
          }}
        >
          {error}
        </div>
      )}

      {output && (
        <pre
          style={{
            marginTop: '1.5rem',
            padding: '1.2rem',
            background: '#f2f0ec',
            borderRadius: 8,
            whiteSpace: 'pre-wrap',
            fontSize: '0.98rem',
            lineHeight: 1.75,
            fontFamily: 'inherit',
          }}
        >
          {output}
        </pre>
      )}
    </main>
  );
}
