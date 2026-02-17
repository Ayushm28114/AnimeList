const pendingRequests = new Map();

export function getRequestKey(config) {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
}

export function addPendingRequest(key, promise) {
  pendingRequests.set(key, promise);
}

export function getPendingRequest(key) {
  return pendingRequests.get(key);
}

export function removePendingRequest(key) {
  pendingRequests.delete(key);
}
