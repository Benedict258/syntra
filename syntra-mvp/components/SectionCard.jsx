export default function SectionCard({ title, children }) {
  return (
    <section className="card">
      <header className="card__header">
        <h3>{title}</h3>
      </header>
      <div className="card__body">{children}</div>
    </section>
  );
}
