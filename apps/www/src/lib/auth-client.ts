// Auth client stub for self-hosted mode - Better Auth has been removed.
// No-op methods to satisfy any remaining client-side references.

export const authClient = {
  signOut: async () => {},
  signIn: {
    social: async () => {},
    magicLink: async () => {},
  },
  admin: {
    impersonateUser: async () => {},
    stopImpersonating: async () => {},
  },
  useSession: () => ({
    data: null,
    isPending: false,
    error: null,
  }),
  subscription: {
    upgrade: async () => {},
    list: async () => ({ data: [] }),
  },
};
