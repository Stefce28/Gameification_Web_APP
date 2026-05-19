export default function LoadingState({ label = "Loading" }) {
  return (
    <div className="state-card">
      <div className="loader" />
      <p>{label}</p>
    </div>
  );
}
