import { Container, getContainer } from "@cloudflare/containers";
import { AppError, Err, Ok, type Result } from "@vspo/errors";

// --- Container Durable Object ---

export class YtdlpContainer extends Container<Env> {
	defaultPort = 8080;
	sleepAfter = "2m";
	enableInternet = true;
}

// --- Transcript Fetcher ---

type ExecResult = {
	stdout: string;
	stderr: string;
	exit_code: number;
};

const CONTAINER_ID = "transcript-worker";

export const TranscriptFetcher = {
	fetch: async (
		binding: DurableObjectNamespace<YtdlpContainer>,
		videoId: string,
		lang: string,
	): Promise<Result<string, AppError>> => {
		const container = getContainer(binding, CONTAINER_ID);
		const tmpPath = `/tmp/${videoId}`;

		const resp = await container.fetch(
			new Request("http://container/exec", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					bin: "sh",
					args: [
						"-c",
						'yt-dlp --write-auto-sub --sub-lang "$1" --sub-format json3 --skip-download -o "$2" "https://www.youtube.com/watch?v=$3" >&2 && cat "$2.$1.json3"',
						"_",
						lang,
						tmpPath,
						videoId,
					],
				}),
			}),
		);

		const result = (await resp.json()) as ExecResult;

		if (result.exit_code !== 0) {
			return Err(
				new AppError({
					code: "INTERNAL_SERVER_ERROR",
					message: `yt-dlp failed for ${videoId} (exit ${result.exit_code})`,
					context: { videoId, lang, stderr: result.stderr },
				}),
			);
		}

		return Ok(result.stdout);
	},

	healthCheck: async (
		binding: DurableObjectNamespace<YtdlpContainer>,
	): Promise<Response> => {
		const container = getContainer(binding, CONTAINER_ID);
		return container.fetch(new Request("http://container/"));
	},
} as const;
