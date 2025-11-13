'use server';

import { db } from "@/db/drizzle";
import { user, User } from "@/db/schema";
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
    return userInfo;
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
 

