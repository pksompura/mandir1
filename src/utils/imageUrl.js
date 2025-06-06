// utils/apiBase.js
const isLocal = window.location.hostname === "localhost";

export const IMAGE_BASE_URL = isLocal
  ? "http://localhost:5001"
  : "https://giveaze.com";
