import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_dev_only"; // Use fallback for local dev

// Middleware to authenticate JWT
const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Missing token" });
  }
};

const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed db initially
  const flights = await storage.getFlights();
  if (flights.length === 0) {
    await storage.createFlight({
      airline: "Delta Airlines",
      departureCity: "New York (JFK)",
      destinationCity: "Paris (CDG)",
      departureTime: new Date("2026-03-10T18:00:00Z"),
      arrivalTime: new Date("2026-03-11T07:30:00Z"),
      duration: "7h 30m",
      price: "450.00",
      classType: "Economy",
      seatsAvailable: 120,
      isDirect: true,
    });
    await storage.createFlight({
      airline: "Air France",
      departureCity: "New York (JFK)",
      destinationCity: "Paris (CDG)",
      departureTime: new Date("2026-03-12T20:00:00Z"),
      arrivalTime: new Date("2026-03-13T12:00:00Z"),
      duration: "10h 00m",
      price: "320.00",
      classType: "Economy",
      seatsAvailable: 45,
      isDirect: false,
    });
  }

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByEmail(input.email);
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await storage.createUser({ ...input, password: hashedPassword });
      
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.status(201).json({ token, user });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(input.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValid = await bcrypt.compare(input.password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(400).json({ message: "Bad request" });
    }
  });

  app.get(api.auth.me.path, authenticateJWT, async (req: any, res) => {
    const user = await storage.getUser(req.user.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.status(200).json(user);
  });

  // Flight Routes
  app.get(api.flights.search.path, async (req, res) => {
    const flights = await storage.getFlights();
    res.status(200).json(flights);
  });

  app.get(api.flights.get.path, async (req, res) => {
    const flight = await storage.getFlight(Number(req.params.id));
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.status(200).json(flight);
  });

  app.post(api.flights.create.path, authenticateJWT, requireAdmin, async (req: any, res) => {
    try {
      const input = api.flights.create.input.parse({
        ...req.body,
        departureTime: new Date(req.body.departureTime),
        arrivalTime: new Date(req.body.arrivalTime)
      });
      const created = await storage.createFlight(input);
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.put(api.flights.update.path, authenticateJWT, requireAdmin, async (req: any, res) => {
    try {
      let inputRaw = req.body;
      if (inputRaw.departureTime) inputRaw.departureTime = new Date(inputRaw.departureTime);
      if (inputRaw.arrivalTime) inputRaw.arrivalTime = new Date(inputRaw.arrivalTime);
      
      const input = api.flights.update.input.parse(inputRaw);
      const updated = await storage.updateFlight(Number(req.params.id), input);
      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.flights.delete.path, authenticateJWT, requireAdmin, async (req: any, res) => {
    await storage.deleteFlight(Number(req.params.id));
    res.status(204).end();
  });

  // Booking Routes
  app.post(api.bookings.create.path, authenticateJWT, async (req: any, res) => {
    try {
      const input = api.bookings.create.input.parse({
        ...req.body,
        userId: req.user.id
      });
      const created = await storage.createBooking(input);
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.get(api.bookings.userBookings.path, authenticateJWT, async (req: any, res) => {
    if (req.user.id !== Number(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    const bookings = await storage.getUserBookings(Number(req.params.id));
    res.status(200).json(bookings);
  });

  app.get(api.bookings.all.path, authenticateJWT, requireAdmin, async (req: any, res) => {
    const allBookings = await storage.getBookings();
    res.status(200).json(allBookings);
  });

  return httpServer;
}