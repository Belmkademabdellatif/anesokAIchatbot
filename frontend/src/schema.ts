import { relations } from "drizzle-orm";
import { serial, text, timestamp, pgTable,integer, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  imgUrl: text('image_url'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  relationShipStatus:text('relation_status'),
  workingStatus:text('working_status'),
  bestFriendShortIntro:text('friend_intro')
});


export const userRelations = relations(usersTable, ({ one, many }) => ({
	conversationList: many(conversationsTable),
	messageList: many(messagesTable),
}))

export const conversationsTable = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export const conversationRelations = relations(conversationsTable, ({ one, many }) => ({
  user: one(usersTable, {
		relationName: 'conversationToUser',
		fields: [conversationsTable.userId],
		references: [usersTable.id]
	}),
	messageList: many(messagesTable),
}))


export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversationsTable.id).notNull(),
  userId: integer("user_id").references(() => usersTable.id),
  content: text("content").notNull(),
  isAI:boolean("is_ai"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messageRelations = relations(messagesTable, ({ one, many }) => ({
  user: one(usersTable, {
		relationName: 'messageToUser',
		fields: [messagesTable.userId],
		references: [usersTable.id]
	}),
  conversation: one(conversationsTable, {
		relationName: 'messageToConversation',
		fields: [messagesTable.conversationId],
		references: [conversationsTable.id]
	}),
}))