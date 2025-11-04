export const fakeAuth = {
  login(username, password) {
    if (username === "admin" && password === "password") {
      const token = btoa(
        JSON.stringify({ user: "admin", exp: Date.now() + 5 * 60 * 1000 })
      ); // 5 mins expiry
      localStorage.setItem("token", token);
      return token;
    }
    throw new Error("Invalid credentials");
  },

  logout() {
    localStorage.removeItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isTokenValid() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const data = JSON.parse(atob(token));
      return data.exp > Date.now();
    } catch {
      return false;
    }
  },

  refreshToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const data = JSON.parse(atob(token));
      const refreshed = btoa(
        JSON.stringify({ ...data, exp: Date.now() + 5 * 60 * 1000 })
      );
      localStorage.setItem("token", refreshed);
      return refreshed;
    } catch {
      return null;
    }
  },
};
