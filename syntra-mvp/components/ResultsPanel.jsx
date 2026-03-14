import SectionCard from './SectionCard';

const EmptyMessage = () => (
  <p className="muted">Run an analysis to see structured insights here.</p>
);

export default function ResultsPanel({ result, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="results">
        <SectionCard title="Syntra is thinking…">
          <p className="muted">Analyzing your idea and crafting the launch strategy.</p>
        </SectionCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results">
        <SectionCard title="Something went wrong">
          <p className="error-text">{error}</p>
        </SectionCard>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results">
        <SectionCard title="Insights">
          <EmptyMessage />
        </SectionCard>
      </div>
    );
  }

  const { market_fit, personas = [], go_to_market = {}, launch_roadmap = [] } = result;

  return (
    <div className="results">
      <SectionCard title="Market Fit">
        {market_fit ? (
          <div className="stack">
            <p className="score">Score: <strong>{market_fit.score ?? '—'}</strong></p>
            <p>{market_fit.summary || 'No summary provided.'}</p>
          </div>
        ) : (
          <EmptyMessage />
        )}
      </SectionCard>

      <SectionCard title="Personas">
        {personas.length ? (
          <div className="stack">
            {personas.map((persona) => (
              <article key={persona.name} className="persona">
                <h4>{persona.name}</h4>
                <p className="muted">{persona.description}</p>
                <div>
                  <p className="tag">Motivations</p>
                  <ul>
                    {(persona.motivations || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="tag">Pain Points</p>
                  <ul>
                    {(persona.pain_points || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyMessage />
        )}
      </SectionCard>

      <SectionCard title="Go-To-Market Strategy">
        {go_to_market.channels || go_to_market.strategy ? (
          <div className="stack">
            <div>
              <p className="tag">Best Channels</p>
              <ul>
                {(go_to_market.channels || []).map((channel) => (
                  <li key={channel}>{channel}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="tag">Messaging Angle</p>
              <p>{go_to_market.messaging || '—'}</p>
            </div>
            <div>
              <p className="tag">Launch Strategy</p>
              <p>{go_to_market.strategy || '—'}</p>
            </div>
          </div>
        ) : (
          <EmptyMessage />
        )}
      </SectionCard>

      <SectionCard title="Launch Roadmap">
        {launch_roadmap.length ? (
          <ol className="roadmap">
            {launch_roadmap.map((phase) => (
              <li key={phase.phase}>
                <h4>{phase.phase}</h4>
                <ul>
                  {(phase.tasks || []).map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyMessage />
        )}
      </SectionCard>
    </div>
  );
}
