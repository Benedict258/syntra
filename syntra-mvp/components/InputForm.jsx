import { useState } from 'react';

export default function InputForm({ onSubmit, isLoading }) {
  const [idea, setIdea] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!idea.trim()) {
      setError('Please paste a product idea or PRD first.');
      return;
    }
    setError(null);
    onSubmit(idea.trim());
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="product-idea" className="form__label">
        Product Idea / PRD
      </label>
      <textarea
        id="product-idea"
        className="form__textarea"
        rows={10}
        value={idea}
        onChange={(event) => setIdea(event.target.value)}
        placeholder="Describe your product, audience, and goals..."
        disabled={isLoading}
      />
      {error && <p className="form__error">{error}</p>}
      <button type="submit" className="form__button" disabled={isLoading}>
        {isLoading ? 'Analyzing…' : 'Run Analysis'}
      </button>
    </form>
  );
}
