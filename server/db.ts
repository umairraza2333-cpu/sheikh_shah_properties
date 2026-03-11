import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, properties, InsertProperty, projects, InsertProject, inquiries, InsertInquiry } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Property queries
export async function getProperties(filters?: { area?: string; priceMin?: number; priceMax?: number; bedrooms?: number }) {
  const db = await getDb();
  if (!db) return [];

  let results: any[] = [];
  if (filters?.area) {
    results = await db.select().from(properties).where(eq(properties.area, filters.area));
  } else if (filters?.bedrooms) {
    results = await db.select().from(properties).where(eq(properties.bedrooms, filters.bedrooms));
  } else {
    results = await db.select().from(properties);
  }

  // Ensure images is always an array
  return results.map(p => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : []),
  }));
}

export async function getPropertyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  if (result.length === 0) return undefined;
  
  const property = result[0];
  return {
    ...property,
    images: Array.isArray(property.images) ? property.images : (typeof property.images === 'string' ? JSON.parse(property.images) : []),
  };
}

export async function getFeaturedProperties(limit = 6) {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db.select().from(properties).where(eq(properties.featured, true)).limit(limit);
  
  // Ensure images is always an array
  return results.map(p => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : []),
  }));
}

export async function createProperty(data: InsertProperty) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Keep images as array - Drizzle will handle JSON serialization
  const sanitizedData = {
    ...data,
    images: Array.isArray(data.images) ? data.images : [],
  };
  
  await db.insert(properties).values(sanitizedData as any);
}

export async function updateProperty(id: number, data: Partial<InsertProperty>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Ensure images array is properly serialized
  const sanitizedData = {
    ...data,
    images: data.images ? JSON.stringify(data.images) : undefined,
  };
  
  await db.update(properties).set(sanitizedData as any).where(eq(properties.id, id));
}

export async function deleteProperty(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.delete(properties).where(eq(properties.id, id));
}

// Project queries
export async function getProjects(status?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let results: any[] = [];
  if (status) {
    results = await db.select().from(projects).where(eq(projects.status, status as any));
  } else {
    results = await db.select().from(projects);
  }
  
  // Ensure images is always an array
  return results.map(p => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : []),
  }));
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (result.length === 0) return undefined;
  
  const project = result[0];
  return {
    ...project,
    images: Array.isArray(project.images) ? project.images : (typeof project.images === 'string' ? JSON.parse(project.images) : []),
  };
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Keep images as array - Drizzle will handle JSON serialization
  const sanitizedData = {
    ...data,
    images: Array.isArray(data.images) ? data.images : [],
  };
  
  await db.insert(projects).values(sanitizedData as any);
}

export async function updateProject(id: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Keep images as array - Drizzle will handle JSON serialization
  const sanitizedData = {
    ...data,
    images: data.images ? (Array.isArray(data.images) ? data.images : []) : undefined,
  };
  
  await db.update(projects).set(sanitizedData as any).where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.delete(projects).where(eq(projects.id, id));
}

// Inquiry queries
export async function createInquiry(data: InsertInquiry) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.insert(inquiries).values(data);
}

export async function getInquiries() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(inquiries).orderBy(inquiries.createdAt);
}

export async function updateInquiry(id: number, data: Partial<InsertInquiry>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.update(inquiries).set(data).where(eq(inquiries.id, id));
}
