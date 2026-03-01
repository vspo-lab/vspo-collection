import { AppError, Err, Ok, type Result, wrap } from "@vspo/errors";
import type {
	TranscriptParams,
	TranscriptStage,
} from "../../domain/transcript";
import { TranscriptKey } from "../../domain/transcript";

export type TranscriptRepository = Readonly<{
	save: (
		stage: TranscriptStage,
		params: TranscriptParams,
		data: string,
	) => Promise<Result<{ key: string }, AppError>>;
	get: (
		stage: TranscriptStage,
		params: TranscriptParams,
	) => Promise<Result<string | null, AppError>>;
}>;

export const TranscriptRepository = {
	from: (bucket: R2Bucket): TranscriptRepository => ({
		save: async (stage, params, data) => {
			const key = TranscriptKey.fromStage(stage, params);
			return wrap(
				bucket
					.put(key, data, {
						httpMetadata: { contentType: "application/json" },
						customMetadata: {
							videoId: params.videoId,
							lang: params.lang,
							stage,
						},
					})
					.then(() => ({ key })),
				(err) =>
					new AppError({
						code: "INTERNAL_SERVER_ERROR",
						message: `Failed to save transcript to R2: ${key}`,
						cause: err,
						context: { key, videoId: params.videoId },
					}),
			);
		},

		get: async (stage, params) => {
			const key = TranscriptKey.fromStage(stage, params);
			return wrap(
				bucket.get(key).then((obj) => (obj ? obj.text() : null)),
				(err) =>
					new AppError({
						code: "INTERNAL_SERVER_ERROR",
						message: `Failed to get transcript from R2: ${key}`,
						cause: err,
						context: { key, videoId: params.videoId },
					}),
			);
		},
	}),
} as const;
