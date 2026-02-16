import { useUI } from "../hooks/useUI";

export default function ErrorToast() {
  const { error, setError } = useUI();

  if (!error) return null;

  return (
    <div className="error-toast" onClick={() => setError(null)}>
      {error}
    </div>
  );
}
