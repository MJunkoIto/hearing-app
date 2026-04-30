import { useState, useEffect } from 'react'
import './App.css'

// 質問項目（番号と本文）
const QUESTIONS = [
  'Webサイトの主な目的は何ですか？',
  '貴社の事業・サービスを1〜2文でご説明ください。',
  '主なターゲット（お客様）はどのような方ですか？',
  'Webサイトを制作することで得たい効果は何ですか？',
  '必要な機能やコンテンツについて教えてください。',
  '競合となるサイトや参考にしているサイトはありますか？',
  'デザインのイメージや、参考にしているサイトはありますか？',
  '現在のWebサイトについて、良い点・改善したい点を教えてください。',
]

const STORAGE_KEY = 'hearing-app-answers'

// 空の回答配列をつくるヘルパー
function createEmptyAnswers() {
  return QUESTIONS.map(() => '')
}

function App() {
  // 入力中の回答
  const [answers, setAnswers] = useState(createEmptyAnswers)
  // 送信済みかどうか（true なら一覧画面を表示）
  const [submitted, setSubmitted] = useState(false)

  // 初回マウント時に localStorage から復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (Array.isArray(data.answers) && data.answers.length === QUESTIONS.length) {
          setAnswers(data.answers)
          setSubmitted(Boolean(data.submitted))
        }
      } catch {
        // JSONが壊れていた場合は無視して初期状態のまま
      }
    }
  }, [])

  // answers / submitted が変わるたびに localStorage に保存
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, submitted }),
    )
  }, [answers, submitted])

  // 各テキストエリアの変更を反映
  const handleChange = (index, value) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  // 送信ボタン → 一覧画面へ
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 編集に戻る
  const handleEdit = () => {
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 全削除
  const handleDelete = () => {
    if (window.confirm('入力内容をすべて削除します。よろしいですか？')) {
      setAnswers(createEmptyAnswers())
      setSubmitted(false)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero-title">Webサイト制作ヒアリングシート</h1>
        <p className="hero-sub">ご記入ください</p>
        <p className="hero-desc">
          このヒアリングシートは、より良いWebサイトを制作するために必要な情報を把握する目的で使用します。
          <br />
          可能な範囲でご記入をお願いいたします。
        </p>
      </header>

      <main className="container">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="form">
            {QUESTIONS.map((q, index) => (
              <section key={index} className="card">
                <label className="question" htmlFor={`q-${index}`}>
                  {index + 1}. {q}
                </label>
                <textarea
                  id={`q-${index}`}
                  className="textarea"
                  value={answers[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder="ご回答をご記入ください"
                  rows={4}
                />
              </section>
            ))}

            <button type="submit" className="submit-button">
              送信する
            </button>
          </form>
        ) : (
          <section className="result">
            <h2 className="result-title">ご回答の確認</h2>
            <p className="result-desc">
              入力された内容は下記のとおりです。修正する場合は「編集する」を押してください。
            </p>

            <ul className="answer-list">
              {QUESTIONS.map((q, index) => (
                <li key={index} className="card">
                  <p className="question">
                    {index + 1}. {q}
                  </p>
                  <p className="answer">
                    {answers[index].trim() === ''
                      ? '（未入力）'
                      : answers[index]}
                  </p>
                </li>
              ))}
            </ul>

            <div className="action-row">
              <button
                type="button"
                className="secondary-button"
                onClick={handleEdit}
              >
                編集する
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={handleDelete}
              >
                すべて削除
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <small>© Webサイト制作ヒアリングシート</small>
      </footer>
    </div>
  )
}

export default App
