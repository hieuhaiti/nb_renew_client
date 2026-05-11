import { z } from 'zod';

const COLLECTIONS = ['S2', 'L8', 'L9', 'ALL'];

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'satellite.errors.invalid_date')
  .or(
    z
      .instanceof(Date)
      .transform((d) => d.toISOString().split('T')[0])
  );

export const satelliteSinglePeriodSchema = z
  .object({
    startDate: dateString,
    endDate: dateString,
    collection: z.enum(COLLECTIONS).default('S2'),
    cloudCover: z.number().min(0).max(100).default(20),
    geometry: z.any().optional(),
  })
  .refine((d) => new Date(d.startDate) < new Date(d.endDate), {
    message: 'satellite.errors.date_order',
    path: ['endDate'],
  });

export const satelliteNdviSchema = satelliteSinglePeriodSchema.extend({
  ndviMinThresh: z.number().min(-1).max(1).optional(),
});

export const satelliteDualPeriodSchema = z
  .object({
    startDate1: dateString,
    endDate1: dateString,
    startDate2: dateString,
    endDate2: dateString,
    collection: z.enum(COLLECTIONS).default('S2'),
    cloudCover: z.number().min(0).max(100).default(20),
    geometry: z.any().optional(),
  })
  .refine((d) => new Date(d.startDate1) < new Date(d.endDate1), {
    message: 'satellite.errors.date_order',
    path: ['endDate1'],
  })
  .refine((d) => new Date(d.startDate2) < new Date(d.endDate2), {
    message: 'satellite.errors.date_order',
    path: ['endDate2'],
  });
