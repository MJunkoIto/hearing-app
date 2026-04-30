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

// メール送信先・件名（クライアント側で完結する mailto 用の固定値）
const MAIL_TO = 'soutozen2018@gmail.com'
const MAIL_SUBJECT = 'ヒアリングシート回答'

// 空の回答配列をつくるヘルパー
function createEmptyAnswers() {
  return QUESTIONS.map(() => '')
}

// 回答配列からメール本文文字列を組み立てる
function buildMailBody(answers) {
  return QUESTIONS.map((q, i) => {
    const a = answers[i].trim() === '' ? '（未入力）' : answers[i]
    return `${i + 1}. ${q}\n回答：${a}\n`
  }).join('\n')
}

function App() {
  // 入力中の回答
  const [answers, setAnswers] = useState(createEmptyAnswers)
  // 画面状態：'form' = 入力, 'result' = 確認, 'thanks' = サンクス
  const [view, setView] = useState('form')

  // 初回マウント時に localStorage から復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (
          Array.isArray(data.answers) &&
          data.answers.length === QUESTIONS.length
        ) {
          setAnswers(data.answers)
          if (
            data.view === 'form' ||
            data.view === 'result' ||
            data.view === 'thanks'
          ) {
            setView(data.view)
          }
        }
      } catch {
        // JSONが壊れていた場合は無視して初期状態のまま
      }
    }
  }, [])

  // answers / view が変わるたびに localStorage に保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, view }))
  }, [answers, view])

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
    setView('result')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 編集に戻る
  const handleEdit = () => {
    setView('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 全削除
  const handleDelete = () => {
    if (window.confirm('入力内容をすべて削除します。よろしいですか？')) {
      setAnswers(createEmptyAnswers())
      setView('form')
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // メールで送信する → mailto を起動 → サンクスページへ
  const handleSendMail = () => {
    const body = buildMailBody(answers)
    const mailto =
      `mailto:${MAIL_TO}` +
      `?subject=${encodeURIComponent(MAIL_SUBJECT)}` +
      `&body=${encodeURIComponent(body)}`
    // メールアプリ起動（同タブのまま遷移してもOK）
    window.location.href = mailto
    // 案内ページへ遷移
    setView('thanks')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // サンクスページから入力画面へ戻る
  const handleBackToForm = () => {
    setView('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        {view === 'form' && (
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
        )}

        {view === 'result' && (
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

            <button
              type="button"
              className="submit-button"
              onClick={handleSendMail}
            >
              メールで送信する
            </button>

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

        {view === 'thanks' && (
          <section className="thanks">
            <div className="card thanks-card">
              <h2 className="result-title">ありがとうございました</h2>
              <p className="thanks-message">
                メールアプリが起動しました。送信を完了してください。
              </p>
              <p className="thanks-note">
                メールアプリが起動しない場合は、確認画面に戻り
                「メールで送信する」をもう一度お試しください。
              </p>
              <div className="action-row">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setView('result')}
                >
                  確認画面に戻る
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleBackToForm}
                >
                  入力画面に戻る
                </button>
              </div>
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
