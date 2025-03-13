import { defineSchema, defineTable } from "convex/server"
import { Infer, v } from "convex/values"

export const INTERVALS = {
    MONTH: "month",
    YEAR: "year",
} as const;

export const intervalValidator = v.union(
    v.literal(INTERVALS.MONTH),
    v.literal(INTERVALS.YEAR),
);

export type Interval = Infer<typeof intervalValidator>;

// Define a price object structure that matches your data
const priceValidator = v.object({
    amount: v.number(),
    polarId: v.string(),
});

// Define a prices object structure for a specific interval
const intervalPricesValidator = v.object({
    usd: priceValidator,
});


export default defineSchema({
    users: defineTable({
        createdAt: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        userId: v.string(),
        subscription: v.optional(v.string()),
        credits: v.optional(v.string()),
        tokenIdentifier: v.string(),
    }).index("by_token", ["tokenIdentifier"]),
    subscriptions: defineTable({
        userId: v.optional(v.string()),
        polarId: v.optional(v.string()),
        polarPriceId: v.optional(v.string()),
        currency: v.optional(v.string()),
        interval: v.optional(v.string()),
        status: v.optional(v.string()),
        currentPeriodStart: v.optional(v.number()),
        currentPeriodEnd: v.optional(v.number()),
        cancelAtPeriodEnd: v.optional(v.boolean()),
        amount: v.optional(v.number()),
        startedAt: v.optional(v.number()),
        endsAt: v.optional(v.number()),
        endedAt: v.optional(v.number()),
        canceledAt: v.optional(v.number()),
        customerCancellationReason: v.optional(v.string()),
        customerCancellationComment: v.optional(v.string()),
        metadata: v.optional(v.any()),
        customFieldData: v.optional(v.any()),
        customerId: v.optional(v.string()),
    })
        .index("userId", ["userId"])
        .index("polarId", ["polarId"]),
    webhookEvents: defineTable({
        type: v.string(),
        polarEventId: v.string(),
        createdAt: v.string(),
        modifiedAt: v.string(),
        data: v.any(),
    })
        .index("type", ["type"])
        .index("polarEventId", ["polarEventId"]),
    
    // New tables for social media automation
    integrations: defineTable({
        userId: v.string(),
        platformId: v.string(),
        platformName: v.string(),
        accessToken: v.string(),
        refreshToken: v.optional(v.string()),
        tokenExpiry: v.optional(v.number()),
        metadata: v.optional(v.any()),
        createdAt: v.string(),
        updatedAt: v.string(),
        isActive: v.boolean(),
    })
        .index("by_user", ["userId"])
        .index("by_platform", ["platformId"])
        .index("by_user_and_platform", ["userId", "platformId"]),
    
    agents: defineTable({
        userId: v.string(),
        name: v.string(),
        description: v.string(),
        instructions: v.string(),
        model: v.string(),
        temperature: v.number(),
        isActive: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
        metadata: v.optional(v.any()),
    })
        .index("by_user", ["userId"])
        .index("by_active", ["userId", "isActive"]),
    
    automations: defineTable({
        userId: v.string(),
        name: v.string(),
        description: v.string(),
        integrationId: v.optional(v.id("integrations")),
        agentId: v.optional(v.id("agents")),
        flowData: v.any(), // React Flow data structure
        isActive: v.boolean(),
        schedule: v.optional(v.string()),
        createdAt: v.string(),
        updatedAt: v.string(),
        metadata: v.optional(v.any()),
    })
        .index("by_user", ["userId"])
        .index("by_integration", ["integrationId"])
        .index("by_agent", ["agentId"])
        .index("by_active", ["userId", "isActive"]),
    
    faqs: defineTable({
        userId: v.string(),
        question: v.string(),
        answer: v.string(),
        agentId: v.optional(v.id("agents")),
        keywords: v.array(v.string()),
        category: v.optional(v.string()),
        isActive: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
    })
        .index("by_user", ["userId"])
        .index("by_agent", ["agentId"])
        .index("by_active", ["userId", "isActive"]),
    
    updates: defineTable({
        userId: v.string(),
        title: v.string(),
        content: v.string(),
        category: v.optional(v.string()),
        isActive: v.boolean(),
        scheduledAt: v.optional(v.string()),
        publishedAt: v.optional(v.string()),
        createdAt: v.string(),
        updatedAt: v.string(),
    })
        .index("by_user", ["userId"])
        .index("by_active", ["userId", "isActive"]),
    
    messages: defineTable({
        userId: v.string(),
        integrationId: v.id("integrations"),
        automationId: v.optional(v.id("automations")),
        platformId: v.string(),
        externalMessageId: v.string(),
        direction: v.string(), // 'incoming' or 'outgoing'
        content: v.string(),
        metadata: v.optional(v.any()),
        createdAt: v.string(),
    })
        .index("by_user", ["userId"])
        .index("by_integration", ["integrationId"])
        .index("by_external_id", ["externalMessageId"])
        .index("by_automation", ["automationId"]),
})