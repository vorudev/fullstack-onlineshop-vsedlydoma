'use server';

import { db } from "@/db/drizzle";
import { user, User, telegramChatIds, TelegramChatId, adminEmails, AdminEmail } from "@/db/schema";
import { eq, ilike, or,  } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { sql, and } from "drizzle-orm";
interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
export async function getUsers() {
  try {
    const allUsers = await db.select().from(user);
    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function deleteUser(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await db.delete(user).where(eq(user.id, id));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}
export async function updateUser(id: string, data: Partial<User>) {
  try {
const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await db.update(user).set(data).where(eq(user.id, id));
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

export async function getUserById(id: string) {
  try {
    const userInfo = await db.select().from(user).where(eq(user.id, id));
    return userInfo[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}
export const getAllUsers = (
  async ({
    page = 1,
    pageSize = 20,
    search = '',
  }: GetUsersParams = {}) => {
    try {
      const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session || session.user.role !== 'admin') {
      throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
      const offset = (page - 1) * pageSize;
      const conditions = [];
      
      if (search) {
        conditions.push(
          or(
            ilike(user.name, `%${search}%`),
            ilike(user.email, `%${search}%`),
            ilike(user.role, `%${search}%`),
            ilike(user.phoneNumber, `%${search}%`),
          )
        );
      }
      
      let query = db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, 
          twoFactorEnabled: user.twoFactorEnabled,
          phoneNumber: user.phoneNumber,
          banned: user.banned
        })
        .from(user)
        .$dynamic();
        
    let countQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(user)
        .$dynamic(); // Добавьте .$dynamic() здесь

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
        countQuery = countQuery.where(and(...conditions));
      }
      
      const users = await query
        .limit(pageSize)
        .offset(offset)
        .orderBy(user.name);
        
      const [{ count }] = await countQuery;
      
      return {
        users,
        pagination: {
          page,
          pageSize,
          total: count,
          totalPages: Math.ceil(count / pageSize),
        }
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }
);
 

export async function createTelegramChatId(telegramChatId: Omit<TelegramChatId, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session || session.user.role !== 'admin') {
      throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await db.insert(telegramChatIds).values(telegramChatId);
  } catch (error) {
    console.error("Error creating Telegram chat ID:", error);
    throw new Error("Failed to create Telegram chat ID");
  }
}
export async function updateTelegramChatId(telegramChatId: Omit<TelegramChatId,  'createdAt' | 'updatedAt'>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session || session.user.role !== 'admin') {
      throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await db.update(telegramChatIds).set(telegramChatId).where(eq(telegramChatIds.id, telegramChatId.id));
  } catch (error) {
    console.error("Error updating Telegram chat ID:", error);
    throw new Error("Failed to update Telegram chat ID");
  }
}
export async function deleteTelegramChatId(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session || session.user.role !== 'admin') {
      throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await db.delete(telegramChatIds).where(eq(telegramChatIds.id, id));
  } catch (error) {
    console.error("Error deleting Telegram chat ID:", error);
    throw new Error("Failed to delete Telegram chat ID");
  }
}

export async function getTelegramChatIds() {
  try {
    const chatIds = await db.select().from(telegramChatIds);
    return chatIds;
  } catch (error) {
    console.error("Error fetching Telegram chat IDs:", error);
    throw new Error("Failed to fetch Telegram chat IDs");
  }
}
export async function createAdminEmail(adminEmail: Omit<AdminEmail, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session || session.user.role !== 'admin') {
      throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await db.insert(adminEmails).values(adminEmail);
  } catch (error) {
    console.error("Error creating admin email:", error);
    throw new Error("Failed to create admin email");
  }
}
export async function updateAdminEmail(adminEmail: Omit<AdminEmail,  'createdAt' | 'updatedAt'>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session || session.user.role !== 'admin') {
      throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await db.update(adminEmails).set(adminEmail).where(eq(adminEmails.id, adminEmail.id));
  } catch (error) {
    console.error("Error updating admin email:", error);
    throw new Error("Failed to update admin email");
  }
}
export async function deleteAdminEmail(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (!session || session.user.role !== 'admin') {
      throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await db.delete(adminEmails).where(eq(adminEmails.id, id));
  } catch (error) {
    console.error("Error deleting admin email:", error);
    throw new Error("Failed to delete admin email");
  }
}
export async function getAdminEmails() {
  try {
    const emails = await db.select().from(adminEmails);
    return emails;
  } catch (error) {
    console.error("Error fetching admin emails:", error);
    throw new Error("Failed to fetch admin emails");
  }
}
