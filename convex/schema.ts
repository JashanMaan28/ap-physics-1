import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  progress: defineTable({
    userId: v.id("users"),
    unitSlug: v.string(),
    completedTopics: v.array(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_unitSlug", ["userId", "unitSlug"]),

  mistakes: defineTable({
    userId: v.id("users"),
    unit: v.string(),
    topic: v.string(),
    question: v.string(),
    yourAnswer: v.string(),
    correctAnswer: v.string(),
    timestamp: v.float64(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_unit", ["userId", "unit"]),

  simulationPredictions: defineTable({
    userId: v.id("users"),
    simId: v.string(),
    unitSlug: v.string(),
    topicKey: v.string(),
    promptKind: v.string(),
    predictedNumber: v.optional(v.number()),
    predictedChoice: v.optional(v.string()),
    actualNumber: v.optional(v.number()),
    actualChoice: v.optional(v.string()),
    rationale: v.string(),
    confidence: v.string(),
    outcome: v.string(),
    score: v.number(),
    createdAt: v.number(),
    resolvedAt: v.union(v.number(), v.null()),
  })
    .index("by_userId_and_createdAt", ["userId", "createdAt"])
    .index("by_userId_and_simId", ["userId", "simId"]),

  examRuns: defineTable({
    userId: v.id("users"),
    modeKind: v.string(),
    durationSec: v.number(),
    questionCount: v.number(),
    correctCount: v.number(),
    accuracy: v.number(),
    unitAccuracy: v.record(v.string(), v.number()),
    topicMisses: v.record(v.string(), v.number()),
    startedAt: v.number(),
    completedAt: v.number(),
  }).index("by_userId_and_completedAt", ["userId", "completedAt"]),
});
