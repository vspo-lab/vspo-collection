import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";
import type { TranscriptParams } from "../../domain/transcript";
import { TranscriptUseCase } from "../../usecase/transcript";

export class TranscriptWorkflow extends WorkflowEntrypoint<
	Env,
	TranscriptParams
> {
	async run(event: WorkflowEvent<TranscriptParams>, step: WorkflowStep) {
		const { videoId, lang } = event.payload;

		await step.do(
			`fetch-and-save:${videoId}`,
			{
				retries: {
					limit: 3,
					delay: "10 second",
					backoff: "exponential",
				},
				timeout: "5 minutes",
			},
			async () => {
				const usecase = TranscriptUseCase.from({
					containerBinding: this.env.YT_CONTAINER,
					bucket: this.env.TRANSCRIPT_BUCKET,
				});

				const result = await usecase.fetchAndSave({ videoId, lang });

				if (result.err) {
					throw new Error(result.err.message);
				}

				return { key: result.val.key };
			},
		);
	}
}
