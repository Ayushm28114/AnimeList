import { useState } from "react";
import { UIContext } from "./UIContextDef";

export function UIProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <UIContext.Provider value={{ loading, setLoading, error, setError }}>
      {children}
    </UIContext.Provider>
  );
}
