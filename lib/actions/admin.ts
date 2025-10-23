'use server';

import { db } from "@/db/drizzle";
import { user, User } from "@/db/schema";
import { eq, ilike, or,  } from "drizzle-orm";
import { unstable_cache } from "next/cache";
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
    await db.delete(user).where(eq(user.id, id));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}
export async function updateUser(id: string, data: Partial<User>) {
  try {
    await db.update(user).set(data).where(eq(user.id, id));
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}
export const getAllUsers = unstable_cache(
  async ({
    page = 1,
    pageSize = 20,
    search = '',
  }: GetUsersParams = {}) => {
    try {
      const offset = (page - 1) * pageSize;
      const conditions = [];
      
      if (search) {
        conditions.push(
          or(
            ilike(user.name, `%${search}%`),
            ilike(user.email, `%${search}%`),
            ilike(user.role, `%${search}%`)
          )
        );
      }
      
      let query = db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, 
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
  },
  ['users-list'],
  {
    revalidate: 3600,
    tags: ['users'],
  }
);
