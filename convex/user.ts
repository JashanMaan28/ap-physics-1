import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Determine provider from tokenIdentifier
    const tokenId = identity.tokenIdentifier ?? "";
    let provider = "email";
    if (tokenId.includes("github")) provider = "github";
    else if (tokenId.includes("google")) provider = "google";

    // Get user doc from DB for fields not in the JWT (e.g. email/password users)
    let user = null;
    try {
      const userId = await getAuthUserId(ctx);
      if (userId) {
        user = await ctx.db.get(userId);
      }
    } catch {
      // Session may be inconsistent — continue with identity-only data
    }

    return {
      name: identity.name ?? user?.name ?? null,
      email: identity.email ?? user?.email ?? null,
      image: identity.pictureUrl ?? null,
      provider,
      hasPassword: provider === "email",
    };
  },
});
