import { useUI } from "../hooks/useUI";

export default function GlobalLoader() {
  const { loading } = useUI();

  if (!loading) return null;

  return (
    <div className="global-loader">
      Loading...
    </div>
  );
}
