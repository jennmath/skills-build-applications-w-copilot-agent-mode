import React, { useEffect, useState } from 'react'

const getApiBase = () => {
  const codespace = import.meta.env.VITE_CODESPACE_NAME
  return codespace
    ? `https://${codespace}-8000.app.github.dev/api/`
    : 'http://localhost:8000/api/'
}

const normalize = (data) => {
  if (!data) return { items: [], next: null }
  if (Array.isArray(data)) return { items: data, next: null }
  if (Array.isArray(data.results)) return { items: data.results, next: data.next || null }
  if (Array.isArray(data.data)) return { items: data.data, next: data.next || null }
  return { items: [data], next: null }
}

export default function Leaderboard() {
  const [items, setItems] = useState([])
  const [nextUrl, setNextUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const endpoint = 'leaderboard/'

  const load = async (url) => {
    setLoading(true)
    setError(null)
    try {
      const base = getApiBase()
      const fetchUrl = url || (import.meta.env.VITE_CODESPACE_NAME
        ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
        : 'http://localhost:8000/api/leaderboard/')
      const res = await fetch(fetchUrl)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const data = await res.json()
      const { items: newItems, next } = normalize(data)
      setItems((prev) => (url ? [...prev, ...newItems] : newItems))
      setNextUrl(next)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section>
      <h1>Leaderboard</h1>
      <p>API endpoint: {import.meta.env.VITE_CODESPACE_NAME
        ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
        : 'http://localhost:8000/api/leaderboard/'} </p>
      {error && <div className="error">Error: {error}</div>}
      <ol>
        {items.map((it, idx) => (
          <li key={idx}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(it, null, 2)}</pre>
          </li>
        ))}
      </ol>
      {nextUrl ? (
        <button onClick={() => load(nextUrl)} disabled={loading}>
          {loading ? 'Loading...' : 'Load more'}
        </button>
      ) : null}
    </section>
  )
}
