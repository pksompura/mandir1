// utils/apiBase.js
const isLocal = window.location.hostname === "localhost";

export const IMAGE_BASE_URL = isLocal
  ? "http://localhost:5001"
  : // : "https://88.222.214.214/api";
    "https://giveaze.com/api"; // ✅ Changed from IP to domain
