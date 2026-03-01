import { AppError, type Result, wrap } from "@vspo/errors";
import {
	type JobStatus,
	type TranscriptJob,
	TranscriptJobMapper,
} from "../../domain/job";

type CreateJobInput = Readonly<{
	videoId: string;
	lang?: string;
	eventId?: string;
}>;

type UpdateStatusOptions = Readonly<{
	r2Key?: string | null;
	error?: string | null;
	retryCount?: number;
}>;

export type JobRepository = Readonly<{
	create: (input: CreateJobInput) => Promise<Result<TranscriptJob, AppError>>;
	updateStatus: (
		id: string,
		status: JobStatus,
		opts?: UpdateStatusOptions,
	) => Promise<Result<void, AppError>>;
	findByVideoId: (
		videoId: string,
	) => Promise<Result<TranscriptJob | null, AppError>>;
	listByStatus: (
		status: JobStatus,
	) => Promise<Result<TranscriptJob[], AppError>>;
}>;

export const JobRepository = {
	from: (db: D1Database): JobRepository => ({
		create: async (input) => {
			const id = crypto.randomUUID();
			const now = new Date().toISOString();
			const job: TranscriptJob = {
				id,
				videoId: input.videoId,
				lang: input.lang ?? "ja",
				status: "pending",
				r2Key: null,
				error: null,
				eventId: input.eventId ?? null,
				retryCount: 0,
				createdAt: now,
				updatedAt: now,
			};

			return wrap(
				db
					.prepare(
						`INSERT INTO transcript_jobs (id, video_id, lang, status, r2_key, error, event_id, retry_count, created_at, updated_at)
						 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
					)
					.bind(
						job.id,
						job.videoId,
						job.lang,
						job.status,
						job.r2Key,
						job.error,
						job.eventId,
						job.retryCount,
						job.createdAt,
						job.updatedAt,
					)
					.run()
					.then(() => job),
				(err) =>
					new AppError({
						code: "INTERNAL_SERVER_ERROR",
						message: `Failed to create job for video ${input.videoId}`,
						cause: err,
						context: { videoId: input.videoId },
					}),
			);
		},

		updateStatus: async (id, status, opts) => {
			const now = new Date().toISOString();
			const updates = ["status = ?", "updated_at = ?"];
			const bindValues: unknown[] = [status, now];

			if (opts && "r2Key" in opts) {
				updates.push("r2_key = ?");
				bindValues.push(opts.r2Key ?? null);
			}

			if (opts && "error" in opts) {
				updates.push("error = ?");
				bindValues.push(opts.error ?? null);
			}

			if (opts && "retryCount" in opts) {
				updates.push("retry_count = ?");
				bindValues.push(opts.retryCount ?? 0);
			}

			return wrap(
				db
					.prepare(
						`UPDATE transcript_jobs
						 SET ${updates.join(", ")}
						 WHERE id = ?`,
					)
					.bind(...bindValues, id)
					.run()
					.then(() => undefined),
				(err) =>
					new AppError({
						code: "INTERNAL_SERVER_ERROR",
						message: `Failed to update job status: ${id}`,
						cause: err,
						context: { jobId: id, status },
					}),
			);
		},

		findByVideoId: async (videoId) => {
			return wrap(
				db
					.prepare(
						"SELECT * FROM transcript_jobs WHERE video_id = ? ORDER BY created_at DESC LIMIT 1",
					)
					.bind(videoId)
					.first()
					.then((row) =>
						row
							? TranscriptJobMapper.fromRow(row as Record<string, unknown>)
							: null,
					),
				(err) =>
					new AppError({
						code: "INTERNAL_SERVER_ERROR",
						message: `Failed to find job for video ${videoId}`,
						cause: err,
						context: { videoId },
					}),
			);
		},

		listByStatus: async (status) => {
			return wrap(
				db
					.prepare(
						"SELECT * FROM transcript_jobs WHERE status = ? ORDER BY created_at ASC",
					)
					.bind(status)
					.all()
					.then((result) =>
						result.results.map((row) =>
							TranscriptJobMapper.fromRow(row as Record<string, unknown>),
						),
					),
				(err) =>
					new AppError({
						code: "INTERNAL_SERVER_ERROR",
						message: `Failed to list jobs by status: ${status}`,
						cause: err,
						context: { status },
					}),
			);
		},
	}),
} as const;
