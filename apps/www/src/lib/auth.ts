// Auth stub for self-hosted mode - Better Auth has been removed.
// All auth functions are handled by auth-server.ts using a default user.

// Stub auth object to maintain type compatibility
export const auth = {
  api: {
    createApiKey: async () => {
      throw new Error("API keys are not supported in self-hosted mode");
    },
    setRole: async () => {
      throw new Error("Role management is not supported in self-hosted mode");
    },
    listUsers: async () => {
      throw new Error("User listing API is not supported in self-hosted mode");
    },
    banUser: async () => {
      throw new Error("User banning is not supported in self-hosted mode");
    },
    unbanUser: async () => {
      throw new Error("User unbanning is not supported in self-hosted mode");
    },
  },
};
