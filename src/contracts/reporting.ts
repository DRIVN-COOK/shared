import { z } from 'zod';
import { idSchema } from './common';

/** Périodes valides: "YYYY-MM" (mois) ou "YYYY-MM-DD" (jour) */
export const periodMonthSchema = z.string().regex(/^\d{4}-\d{2}$/, 'Format attendu: YYYY-MM');
export const periodDaySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format attendu: YYYY-MM-DD');

/** Filtres ventes (agrégats) */
export const salesQuerySchema = z.object({
  from: z.string().min(7),         // "2025-07" ou "2025-07-01"
  to: z.string().min(7),
  granularity: z.enum(['month','day']).default('month'),
  franchiseeId: idSchema.optional(),
});

export type SalesQuery = z.infer<typeof salesQuerySchema>;

/** DTO pour SalesSummary */
export const salesSummarySchema = z.object({
  id: z.string(),
  franchiseeId: z.string(),
  period: z.string(), // "YYYY-MM" ou "YYYY-MM-DD"
  grossHT: z.string(),   // ou number -> on affiche tel quel
  grossTVA: z.string(),
  grossTTC: z.string(),
  ordersCount: z.number(),
  createdAt: z.string(),
});
export type SalesSummaryDTO = z.infer<typeof salesSummarySchema>;

/** DTO pour RevenueShareReport */
export const royaltyReportSchema = z.object({
  id: z.string(),
  franchiseeId: z.string(),
  period: periodMonthSchema,          // "YYYY-MM"
  grossSales: z.string(),
  sharePct: z.string(),               // ex: "0.0400"
  amountDue: z.string(),
  generatedPdfUrl: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type RoyaltyReportDTO = z.infer<typeof royaltyReportSchema>;

/** Commande de génération d’un report de redevance */
export const royaltyGenerateSchema = z.object({
  period: periodMonthSchema,          // "YYYY-MM"
  franchiseeId: idSchema,             // un à la fois (tu pourras aussi faire "ALL" côté API si besoin)
});
export type RoyaltyGenerate = z.infer<typeof royaltyGenerateSchema>;
