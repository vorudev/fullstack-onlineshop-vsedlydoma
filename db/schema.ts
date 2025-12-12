import { phoneNumber } from "better-auth/plugins";
import { desc, or, relations, sql } from "drizzle-orm";
import { integer, text, boolean, pgTable, uuid, real, timestamp, varchar, pgEnum, AnyPgColumn, index} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ['admin', 'user']);

export const user = pgTable("user", {
id: text('id').primaryKey(),
name: text('name').notNull(),
role: roleEnum('role').default('user').notNull(), // добавляем это поле
 email: text('email').notNull().unique(),
 emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
 phoneNumber: text('phone_number').unique(),
 phoneNumberVerified: boolean('phone_number_verified').$defaultFn(() => false).notNull(),
 image: text('image'),
 createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
 twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
banned: boolean("banned").notNull().default(false), // Добавьте эту строку

                });
                export const session = pgTable("session", {
                    id: text('id').primaryKey(),
                    expiresAt: timestamp('expires_at').notNull(),
 token: text('token').notNull().unique(),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull(),
 ipAddress: text('ip_address'),
 userAgent: text('user_agent'),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
                });

export const account = pgTable("account", {
                    id: text('id').primaryKey(),
                    accountId: text('account_id').notNull(),
 providerId: text('provider_id').notNull(),
 userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
 accessToken: text('access_token'),
 refreshToken: text('refresh_token'),
 idToken: text('id_token'),
 accessTokenExpiresAt: timestamp('access_token_expires_at'),
 refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
 scope: text('scope'),
 password: text('password'),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull()
                });

export const verification = pgTable("verification", {
                    id: text('id').primaryKey(),
                    identifier: text('identifier').notNull(),
 value: text('value').notNull(),
 expiresAt: timestamp('expires_at').notNull(),
 createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
 updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
                });
export const twoFactor = pgTable("two_factor", {
  id: text("id").primaryKey(),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  userId: text("user_id").notNull().references(()=> user.id, { onDelete: 'cascade' }),
});
  
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  slugIndex: index("slug_index").on(table.slug),
  nameIndex: index("name_index").on(table.name),
  idxParentId: index("idx_parent_id").on(table.parentId),
  
}));
export const categoryImages = pgTable("categoryImages", {
  id: uuid("id").primaryKey().defaultRandom(),
 categoryId: uuid("category_id").references(() => categories.id).notNull(),
  imageUrl: text("image_url").notNull(),
  storageType: text("storage_type").notNull().default("url"),
  storageKey: text("storage_key"),
  order: integer("order").default(0),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  idxCategoryId: index("idx_category_id").on(table.categoryId),
  idxOrder: index("idx_order").on(table.order),
  idxIsFeatured: index("idx_is_featured").on(table.isFeatured),
}));
export const filterCategories = pgTable("filtersCategories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  displayOrder: integer("display_order").default(0),
  productCategory: uuid("product_category").references(() => categories.id),
});
export const filters = pgTable("filters", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  displayOrder: integer("display_order").default(0),
  categoryId: uuid("category_id").references(() => filterCategories.id),
});
export const products = pgTable("products", {
id: uuid("id").primaryKey().defaultRandom(),
categoryId: uuid("category_id").references(() => categories.id),
inStock: text("inStock"),
price: real("price").notNull(),
slug: varchar("slug", { length: 255 }).notNull().unique(),
title: text("title").notNull(),
description: text("description").notNull(),
manufacturerId: uuid("manufacturer_id").references(() => manufacturers.id),
createdAt: timestamp("created_at").defaultNow(),
updatedAt: timestamp("updated_at").defaultNow(),
 sku: varchar("sku", { length: 16 })
    .unique()
    .default(sql`'PRD-' || upper(to_hex(floor(random() * 4294967295)::int))`),
}, (table) => ({
  // Индекс для поиска по title
  titleIdx: index("products_title_idx").on(table.title),
  
  // Индекс для фильтрации по категории
  categoryIdx: index("products_category_idx").on(table.categoryId),
  
  // Индекс для фильтрации по производителю
  manufacturerIdx: index("products_manufacturer_idx").on(table.manufacturerId),
  
  // Составной индекс для фильтрации и сортировки
  categoryCreatedIdx: index("products_category_created_idx")
    .on(table.categoryId, table.createdAt),
  
  // Уникальный индекс на slug (если нужно)
  slugIdx: index("products_slug_idx").on(table.slug),
  
  // Уникальный индекс на sku (если нужно)
  skuIdx: index("products_sku_idx").on(table.sku),

  priceIdx: index("products_price_idx").on(table.price),
  // === pg_trgm индексы для fuzzy search ===
  // GIN индекс для title (основной поиск)
  titleTrigramIdx: index("products_title_trgm_idx")
    .using('gin', sql`${table.title} gin_trgm_ops`),
  
}));
export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("image_url").notNull(), // URL для доступа к изображению
  storageType: text("storage_type").notNull().default("url"), // 'url' | 'upload'
  storageKey: text("storage_key"), // ключ файла в хранилище (если upload)
  order: integer("order").default(0),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Индекс для поиска по productId
  productIdIdx: index("product_images_product_id_idx").on(table.productId),
}));
export const manufacturerImages = pgTable("manufacturer_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  manufacturerId: uuid("manufacturer_id")
    .references(() => manufacturers.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("image_url").notNull(), // URL для доступа к изображению
  storageType: text("storage_type").notNull().default("url"), // 'url' | 'upload'
  storageKey: text("storage_key"), // ключ файла в хранилище (если upload)
  order: integer("order").default(0),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Индекс для поиска по manufacturerId
  manufacturerIdIdx: index("manufacturer_images_manufacturer_id_idx").on(table.manufacturerId),
}));
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").references(() => products.id, { onDelete: 'cascade' }).notNull(),
  user_id: text("user_id").references(() => user.id, { onDelete: 'cascade' }).notNull(),
  rating: real("rating").notNull(), // или можешь использовать integer, если рейтинг только целые числа
  comment: text("comment"),
  status: varchar("status", { length: 255 }).notNull(),
  author_name: varchar("author_name", { length: 255 }), // для анонимных отзывов
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  idx: index("reviews_idx").on(table.product_id, table.user_id),
  productIdx: index("reviews_product_idx").on(table.product_id),
  userIdx: index("reviews_user_idx").on(table.user_id),
}));

export const manufacturers = pgTable("manufacturers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  slugIdx: index("manufacturers_slug_idx").on(table.slug),
  nameIdx: index("manufacturers_name_idx").on(table.name),
}));
export const productAttributes = pgTable("product_attributes", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(), // например, "Процессор", "RAM"
  value: text("value").notNull(), // например, "Intel i7", "16 GB"
  order: integer("order").default(0), // для сортировки
  slug: varchar("slug", { length: 255 }).notNull(), // для фильтрации, например "Color"
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  slugValueIdx: index("product_attributes_slug_value_idx")
  .on(table.slug, table.value),

// Для подсчета фильтров
productSlugIdx: index("product_attributes_product_slug_idx")
  .on(table.productId, table.slug),

// Составной для JOIN
productSlugValueIdx: index("product_attributes_product_slug_value_idx")
  .on(table.productId, table.slug, table.value),

}));


export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id),
  status: varchar("status", { length: 255 }).notNull(),
  notes: text("notes"),
  total: real("total").notNull(),
  customerName: varchar("customer_name", { length: 255 }),
  customerEmail: varchar("customer_email", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  sku: varchar("sku", { length: 16 })
    .unique()
    .default(sql`'#' || upper(to_hex(floor(random() * 4294967295)::bigint))`),

}, (table) => ({
   // ✅ Основные индексы (работают без расширений)
  statusIdx: index("orders_status_idx").on(table.status),
  userIdIdx: index("orders_user_id_idx").on(table.userId),
  createdAtIdx: index("orders_created_at_idx").on(table.createdAt.desc()),
  
  // ✅ Композитные для популярных запросов
  statusCreatedIdx: index("orders_status_created_idx").on(table.status, table.createdAt.desc()),
  createdStatusIdx: index("orders_created_status_idx").on(table.createdAt.desc(), table.status),
  
  // ✅ Для точного поиска (без ILIKE)
  customerEmailIdx: index("orders_customer_email_idx").on(table.customerEmail),
  customerPhoneIdx: index("orders_customer_phone_idx").on(table.customerPhone),
  
}));
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id),
  productId: uuid("product_id").references(() => products.id),
 productSku: varchar("product_sku", { length: 16 }).references(() => products.sku),
  price: real("price").notNull(),
title: text("title").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  // Индекс на productId
  productIdIdx: index("order_items_product_id_idx").on(table.productId),
}));

export const about = pgTable("about", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    home: text("home").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    titleIdx: index("about_title_idx").on(table.title),
}));

export const contactUs = pgTable("contact_us", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    titleIdx: index("contact_us_title_idx").on(table.title),
}));
export const news = pgTable("news", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    titleIdx: index("news_title_idx").on(table.title),
}));
export const newsImages = pgTable("news_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    newsId: uuid("news_id").references(() => news.id),
    imageUrl: text("image_url").notNull(), // URL для доступа к изображению
  storageType: text("storage_type").notNull().default("url"), // 'url' | 'upload'
  storageKey: text("storage_key"), // ключ файла в хранилище (если upload)
  order: integer("order").default(0),
  isFeatured: boolean("is_featured").default(false),
  isArticle: boolean("is_article").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    newsIdIdx: index("news_images_news_id_idx").on(table.newsId),
}));
export const contactPhones = pgTable("contact_phones", {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: varchar("phone", { length: 255 }).notNull(),
    src: varchar("src", { length: 255 }).notNull(),
    link: varchar("link", { length: 255 }).notNull(),
    contactUsId: uuid("contact_us_id").references(() => contactUs.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    contactUsIdIdx: index("contact_phones_contact_us_id_idx").on(table.contactUsId),
}));
export const contactUsTelephones = pgTable("contact_us_telephones", {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: varchar("phone", { length: 255 }).notNull(),
    contactUsId: uuid("contact_us_id").references(() => contactUs.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    contactUsIdIdx: index("contact_us_telephones_contact_us_id_idx").on(table.contactUsId),
}));
export const telegramChatIds = pgTable("telegram_chat_ids", {
    id: uuid("id").primaryKey().defaultRandom(),
    chatId: varchar("chat_id", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    chatIdIdx: index("telegram_chat_ids_chat_id_idx").on(table.chatId),
}));
export const adminEmails = pgTable("admin_emails", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    emailIdx: index("admin_emails_email_idx").on(table.email),
}));

export const privacyPolicy = pgTable("privacy_policy", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    titleIdx: index("privacy_policy_title_idx").on(table.title),
}));
export const termsOfService = pgTable("terms_of_service", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    titleIdx: index("terms_of_service_title_idx").on(table.title),
}));
export const schema = {
                
                    products, 
                    categories, 
                    user, 
                    session, 
                    account, 
                    verification,
                    orders,
                    orderItems,
                    productAttributes,
                    manufacturers,
                    filters,
                    filterCategories, 
                    reviews, 
                    productImages,
                    categoryImages,
                    manufacturerImages,
                    about,
                    privacyPolicy,
                    termsOfService,
                    contactUs,
                    contactPhones,
                    contactUsTelephones,  
                    twoFactor,
                    news,
                    newsImages,
                    telegramChatIds,
                    adminEmails,
                }

export type Product = typeof products.$inferSelect 
export type Category = typeof categories.$inferSelect
export type User = typeof user.$inferSelect
export type Order = typeof orders.$inferSelect
export type OrderItem = typeof orderItems.$inferSelect
export type ProductAttribute = typeof productAttributes.$inferSelect
export type Manufacturer = typeof manufacturers.$inferSelect
export type Filter = typeof filters.$inferSelect
export type FilterCategory = typeof filterCategories.$inferSelect
export type About = typeof about.$inferSelect
export type News = typeof news.$inferSelect
export type NewsImage = typeof newsImages.$inferSelect
export type Review = typeof reviews.$inferSelect 
export type ContactUs = typeof contactUs.$inferSelect
export type TwoFactor = typeof twoFactor.$inferSelect
export type ContactPhone = typeof contactPhones.$inferSelect
export type ContactTelephone = typeof contactUsTelephones.$inferSelect

export type ProductImage = typeof productImages.$inferSelect
export type CategoryImage = typeof categoryImages.$inferSelect
export type ManufacturerImage = typeof manufacturerImages.$inferSelect
export type TelegramChatId = typeof telegramChatIds.$inferSelect
export type AdminEmail = typeof adminEmails.$inferSelect
export type PrivacyPolicy = typeof privacyPolicy.$inferSelect
export type TermsOfService = typeof termsOfService.$inferSelect
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  reviews: many(reviews),
  images: many(productImages),
  attributes: many(productAttributes),
}));

export const productAttributesRelations = relations(productAttributes, ({ one }) => ({
  product: one(products, {
    fields: [productAttributes.productId],
    references: [products.id],
  }),
}));

