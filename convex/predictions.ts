import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./rls";

export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const limit = Math.max(1, Math.min(Math.floor(args.limit ?? 25), 100));

    return await ctx.db
      .query("simulationPredictions")
      .withIndex("by_userId_and_createdAt", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

export const create = mutation({
  args: {
    simId: v.string(),
    unitSlug: v.string(),
    topicKey: v.string(),
    promptKind: v.string(),
    predictedNumber: v.optional(v.number()),
    predictedChoice: v.optional(v.string()),
    rationale: v.string(),
    confidence: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const id = await ctx.db.insert("simulationPredictions", {
      userId,
      simId: args.simId,
      unitSlug: args.unitSlug,
      topicKey: args.topicKey,
      promptKind: args.promptKind,
      predictedNumber: args.predictedNumber,
      predictedChoice: args.predictedChoice,
      actualNumber: undefined,
      actualChoice: undefined,
      rationale: args.rationale,
      confidence: args.confidence,
      outcome: "pending",
      score: 0,
      createdAt: args.createdAt,
      resolvedAt: null,
    });

    return await ctx.db.get(id);
  },
});

export const resolve = mutation({
  args: {
    predictionId: v.id("simulationPredictions"),
    actualNumber: v.optional(v.number()),
    actualChoice: v.optional(v.string()),
    outcome: v.string(),
    score: v.number(),
    resolvedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const existing = await ctx.db.get(args.predictionId);

    if (!existing || existing.userId !== userId) {
      throw new Error("Prediction not found");
    }

    await ctx.db.patch(args.predictionId, {
      actualNumber: args.actualNumber,
      actualChoice: args.actualChoice,
      outcome: args.outcome,
      score: args.score,
      resolvedAt: args.resolvedAt,
    });

    return await ctx.db.get(args.predictionId);
  },
});
