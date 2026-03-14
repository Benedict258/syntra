import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import InputForm from '@mvp/components/InputForm';
import ResultsPanel from '@mvp/components/ResultsPanel';

export default function Home() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = async (idea) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: idea })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to analyze right now.');
      }

      const payload = await response.json();
      setResult(payload.data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Syntra — AI Strategy Intelligence</title>
        <meta name="description" content="Syntra compresses weeks of launch strategy into minutes." />
      </Head>
      <div className="landing-shell">
        <main className="page">
          <header className="hero">
            <p className="eyebrow">Microsoft AI Dev Days Hackathon</p>
            <h1>Syntra — AI Strategy Intelligence</h1>
            <p className="muted">Paste your product idea and let Azure OpenAI assemble a complete launch plan.</p>
            <Link href="/platform" className="platform-link">
              Continue to full Syntra workspace →
            </Link>
          </header>

          <div className="grid">
            <InputForm onSubmit={runAnalysis} isLoading={isLoading} />
            <ResultsPanel result={result} isLoading={isLoading} error={error} />
          </div>
        </main>
      </div>
    </>
  );
}
