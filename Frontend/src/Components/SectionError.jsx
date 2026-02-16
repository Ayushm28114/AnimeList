export default function SectionError({ message = "Failed to load", onRetry }) {
  return (
    <div className="section-error">
      <span className="section-error-icon">⚠️</span>
      <p className="section-error-message">{message}</p>
      {onRetry && (
        <button className="section-retry-btn" onClick={onRetry}>
          🔄 Retry
        </button>
      )}
    </div>
  );
}
