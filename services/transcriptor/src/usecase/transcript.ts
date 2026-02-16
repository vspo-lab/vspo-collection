import { type AppError, type Result } from "@vspo/errors";
import type { TranscriptParams } from "../domain/transcript";
import type { YtdlpContainer } from "../infra/container/ytdlp";
import { TranscriptFetcher } from "../infra/container/ytdlp";
import { TranscriptRepository } from "../infra/repository/transcript";

type Dependencies = Readonly<{
	containerBinding: DurableObjectNamespace<YtdlpContainer>;
	bucket: R2Bucket;
}>;

export type TranscriptUseCaseType = Readonly<{
	fetch: (params: TranscriptParams) => Promise<Result<string, AppError>>;
	fetchAndSave: (
		params: TranscriptParams,
	) => Promise<Result<{ key: string }, AppError>>;
}>;

export const TranscriptUseCase = {
	from: ({ containerBinding, bucket }: Dependencies): TranscriptUseCaseType => {
		const repo = TranscriptRepository.from(bucket);

		return {
			fetch: async (params) => {
				return TranscriptFetcher.fetch(
					containerBinding,
					params.videoId,
					params.lang,
				);
			},

			fetchAndSave: async (params) => {
				const fetchResult = await TranscriptFetcher.fetch(
					containerBinding,
					params.videoId,
					params.lang,
				);
				if (fetchResult.err) {
					return fetchResult;
				}

				return repo.save("raw", params, fetchResult.val);
			},
		};
	},
} as const;
