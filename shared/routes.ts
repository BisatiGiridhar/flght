import { z } from 'zod';
import { insertUserSchema, insertFlightSchema, insertBookingSchema, users, flights, bookings, loginSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.object({ token: z.string(), user: z.custom<typeof users.$inferSelect>() }),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: loginSchema,
      responses: {
        200: z.object({ token: z.string(), user: z.custom<typeof users.$inferSelect>() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    }
  },
  flights: {
    search: {
      method: 'GET' as const,
      path: '/api/flights/search' as const,
      responses: {
        200: z.array(z.custom<typeof flights.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/flights/:id' as const,
      responses: {
        200: z.custom<typeof flights.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/flights' as const,
      input: insertFlightSchema,
      responses: {
        201: z.custom<typeof flights.$inferSelect>(),
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/flights/:id' as const,
      input: insertFlightSchema.partial(),
      responses: {
        200: z.custom<typeof flights.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/flights/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    }
  },
  bookings: {
    create: {
      method: 'POST' as const,
      path: '/api/bookings' as const,
      input: insertBookingSchema,
      responses: {
        201: z.custom<typeof bookings.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    userBookings: {
      method: 'GET' as const,
      path: '/api/bookings/user/:id' as const,
      responses: {
        200: z.array(z.custom<typeof bookings.$inferSelect & { flight: typeof flights.$inferSelect }>()),
        401: errorSchemas.unauthorized,
      },
    },
    all: {
      method: 'GET' as const,
      path: '/api/bookings' as const,
      responses: {
        200: z.array(z.custom<typeof bookings.$inferSelect & { flight: typeof flights.$inferSelect, user: typeof users.$inferSelect }>()),
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
