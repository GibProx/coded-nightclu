export function checkAuth() {
  if (typeof window === "undefined") return false

  try {
    const session = localStorage.getItem("coded_admin_session")
    if (!session) return false

    const parsed = JSON.parse(session)

    // Check if session is less than 24 hours old
    const isValid = Date.now() - parsed.loginTime < 24 * 60 * 60 * 1000

    if (!isValid) {
      localStorage.removeItem("coded_admin_session")
      return false
    }

    return parsed.role === "admin"
  } catch {
    return false
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("coded_admin_session")
  }
}
