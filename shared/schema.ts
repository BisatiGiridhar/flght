import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // user or admin
});

export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  airline: text("airline").notNull(),
  departureCity: text("departure_city").notNull(),
  destinationCity: text("destination_city").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  duration: text("duration").notNull(),
  price: text("price").notNull(), // using text or numeric for simplicity
  classType: text("class_type").notNull(), // Economy, Business, First Class
  seatsAvailable: integer("seats_available").notNull(),
  isDirect: boolean("is_direct").notNull().default(true),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  flightId: integer("flight_id").notNull(),
  seatNumber: text("seat_number").notNull(),
  classType: text("class_type").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed
  bookingDate: timestamp("booking_date").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertFlightSchema = createInsertSchema(flights).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, bookingDate: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Flight = typeof flights.$inferSelect;
export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginRequest = z.infer<typeof loginSchema>;
