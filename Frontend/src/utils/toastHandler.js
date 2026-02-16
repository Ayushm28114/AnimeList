// Standalone toast handler for use outside React components (e.g., Axios interceptors)
let toastHandler = null;

export function setToastHandler(handler) {
  toastHandler = handler;
}

export function showToast(message, type = "error") {
  if (toastHandler) {
    toastHandler(message, type);
  } else {
    console.warn("Toast handler not initialized:", message);
  }
}
