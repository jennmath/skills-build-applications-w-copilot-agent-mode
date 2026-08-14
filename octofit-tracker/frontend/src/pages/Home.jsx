import React from 'react'

export default function Home() {
  const codespace = import.meta.env.VITE_CODESPACE_NAME || '(not set)'
  return (
    <section>
      <h1>Octofit Tracker</h1>
      <p>
        This demo frontend expects a backend API reachable at:
        <br />
        <code>
          {codespace && codespace !== '(not set)'
            ? `https://${codespace}-8000.app.github.dev/api/`
            : 'http://localhost:8000/api/ (fallback)'}
        </code>
      </p>
      <p>
        Environment variable <code>VITE_CODESPACE_NAME</code> should be defined in
        your dev environment (for example in <code>.env.local</code>) when running
        in Codespaces. See <code>.env.local.example</code> for example.
      </p>
    </section>
  )
}
