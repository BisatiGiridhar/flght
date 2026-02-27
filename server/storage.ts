import { db } from "./db";
import { users, flights, bookings, type InsertUser, type User, type InsertFlight, type Flight, type InsertBooking, type Booking } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getFlights(): Promise<Flight[]>;
  getFlight(id: number): Promise<Flight | undefined>;
  createFlight(flight: InsertFlight): Promise<Flight>;
  updateFlight(id: number, flight: Partial<InsertFlight>): Promise<Flight>;
  deleteFlight(id: number): Promise<void>;

  getBookings(): Promise<(Booking & { user: User; flight: Flight })[]>;
  getUserBookings(userId: number): Promise<(Booking & { flight: Flight })[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getFlights(): Promise<Flight[]> {
    return await db.select().from(flights);
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    const [flight] = await db.select().from(flights).where(eq(flights.id, id));
    return flight;
  }

  async createFlight(flight: InsertFlight): Promise<Flight> {
    const [created] = await db.insert(flights).values(flight).returning();
    return created;
  }

  async updateFlight(id: number, flightUpdate: Partial<InsertFlight>): Promise<Flight> {
    const [updated] = await db.update(flights).set(flightUpdate).where(eq(flights.id, id)).returning();
    return updated;
  }

  async deleteFlight(id: number): Promise<void> {
    await db.delete(flights).where(eq(flights.id, id));
  }

  async getBookings(): Promise<(Booking & { user: User; flight: Flight })[]> {
    const allBookings = await db.select({
      booking: bookings,
      user: users,
      flight: flights,
    }).from(bookings)
      .innerJoin(users, eq(bookings.userId, users.id))
      .innerJoin(flights, eq(bookings.flightId, flights.id));
    
    return allBookings.map(r => ({
      ...r.booking,
      user: r.user,
      flight: r.flight
    }));
  }

  async getUserBookings(userId: number): Promise<(Booking & { flight: Flight })[]> {
    const userBookings = await db.select({
      booking: bookings,
      flight: flights,
    }).from(bookings)
      .innerJoin(flights, eq(bookings.flightId, flights.id))
      .where(eq(bookings.userId, userId));

    return userBookings.map(r => ({
      ...r.booking,
      flight: r.flight
    }));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [created] = await db.insert(bookings).values(booking).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();