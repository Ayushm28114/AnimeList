import { useState, useCallback, useRef, useEffect } from "react";
import { ToastContext } from "./ToastContextDef";
import { setToastHandler } from "../utils/toastHandler";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);
  
  // Track recent messages to prevent duplicates
  const recentMessagesRef = useRef(new Set());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = "error", duration = 5000) => {
    // Prevent duplicate toasts for the same message within a short time
    const messageKey = `${type}:${message}`;
    if (recentMessagesRef.current.has(messageKey)) {
      return;
    }
    
    recentMessagesRef.current.add(messageKey);
    
    // Clear from recent after duration
    setTimeout(() => {
      recentMessagesRef.current.delete(messageKey);
    }, duration);

    const id = ++toastIdRef.current;
    
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  }, [removeToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
    recentMessagesRef.current.clear();
  }, []);

  // Register toast handler for use outside React (Axios interceptors)
  useEffect(() => {
    setToastHandler(addToast);
    return () => setToastHandler(null);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
    </ToastContext.Provider>
  );
}
