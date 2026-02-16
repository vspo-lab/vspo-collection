import { z } from "zod";

// --- Schema ---

export const jobStatusSchema = z.enum([
	"pending",
	"processing",
	"completed",
	"failed",
]);

export type JobStatus = z.infer<typeof jobStatusSchema>;

export const transcriptJobSchema = z.object({
	id: z.string(),
	videoId: z.string(),
	lang: z.string().default("ja"),
	status: jobStatusSchema,
	r2Key: z.string().nullable(),
	error: z.string().nullable(),
	eventId: z.string().nullable(),
	retryCount: z.number().default(0),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type TranscriptJob = z.infer<typeof transcriptJobSchema>;

// --- Row mapper (D1 snake_case → domain camelCase) ---

export const TranscriptJobMapper = {
	fromRow: (row: Record<string, unknown>): TranscriptJob =>
		transcriptJobSchema.parse({
			id: row.id,
			videoId: row.video_id,
			lang: row.lang,
			status: row.status,
			r2Key: row.r2_key,
			error: row.error,
			eventId: row.event_id,
			retryCount: row.retry_count,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		}),
} as const;
