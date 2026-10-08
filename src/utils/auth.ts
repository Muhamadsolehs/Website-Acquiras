export const fetchUserInfo = async () => {
  try {
    const userStr = localStorage.getItem("eproc_user") || localStorage.getItem("user");

    if (!userStr) {
      return null;
    }
    return JSON.parse(userStr); 
  } catch (err) {
    console.error("❌ Failed to fetch user info:", err);
    return null;
  }
};
