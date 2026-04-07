import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Determine provider from tokenIdentifier
    const tokenId = identity.tokenIdentifier ?? "";
    let provider = "email";
    if (tokenId.includes("github")) provider = "github";
    else if (tokenId.includes("google")) provider = "google";

    // Also check if password provider by looking at the user doc
    const user = await ctx.db.get(userId);

    return {
      name: identity.name ?? user?.name ?? null,
      email: identity.email ?? user?.email ?? null,
      image: identity.pictureUrl ?? null,
      provider,
      hasPassword: provider === "email",
    };
  },
});
