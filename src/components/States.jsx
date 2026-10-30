export function Loading() {
  return (
    <div className="state-box">
      <span className="spinner" />
      Loading your data…
    </div>
  );
}
export function ErrorState({ message }) {
  return (
    <div className="state-box error-state">
      {message || "Something went wrong. Please try again."}
    </div>
  );
}
export function Empty({ message = "No records yet." }) {
  return <div className="empty-state">{message}</div>;
}
