// ============================================
// Auth Configuration
// ============================================

export const AUTH_CONFIG = {
  // OAuth providers to show on login/signup pages
  // Enable them in supabase/config.toml first
  providers: {
    google: {
      enabled: true, // Set true after configuring in Supabase dashboard
      name: "Google",
    },
    github: {
      enabled: true, // Set true after configuring in Supabase dashboard
      name: "GitHub",
    },
  },

  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: false,
  },

  // Redirect paths
  redirects: {
    afterLogin: "/dashboard",
    afterSignup: "/dashboard",
    afterLogout: "/",
    afterPasswordReset: "/login",
  },
} as const;
