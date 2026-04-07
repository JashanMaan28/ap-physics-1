import { query } from "./_generated/server";

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

    return {
      name: identity.name ?? null,
      email: identity.email ?? null,
      image: identity.pictureUrl ?? null,
      provider,
      hasPassword: provider === "email",
    };
  },
});
