import type { Context } from "hono";
import { Hono } from "hono/quick";
import { serve } from "inngest/hono";
import { runRequestSchema } from "./domain/transcript";
import { YtdlpContainer } from "./infra/container/ytdlp";
import { inngest } from "./infra/inngest/client";
import { processTranscript } from "./infra/inngest/functions/process-transcript";
import { TranscriptWorkflow } from "./infra/workflow/transcript-workflow";
import { TranscriptUseCase } from "./usecase/transcript";

// --- Exports (wrangler requires top-level exports) ---

export { YtdlpContainer as YTContainer };
export { TranscriptWorkflow };

// --- HTTP Handler ---

const app = new Hono<{ Bindings: Env }>();

// --- Inngest ---

app.on(
	["GET", "PUT", "POST"],
	"/api/inngest",
	serve({
		client: inngest,
		functions: [processTranscript],
	}),
);

app.get("/transcript", async (c: Context<{ Bindings: Env }>) => {
	const videoId = c.req.query("v");
	if (!videoId) {
		return c.json({ error: "query param 'v' is required" }, 400);
	}
	const lang = c.req.query("lang") || "ja";

	const usecase = TranscriptUseCase.from({
		containerBinding: c.env.YT_CONTAINER,
		bucket: c.env.TRANSCRIPT_BUCKET,
	});

	const result = await usecase.fetch({ videoId, lang });

	if (result.err) {
		return c.json(
			{
				error: result.err.message,
				code: result.err.code,
				context: result.err.context,
			},
			result.err.status as 500,
		);
	}

	return c.json(JSON.parse(result.val));
});

app.post("/run", async (c: Context<{ Bindings: Env }>) => {
	const parsed = runRequestSchema.safeParse(await c.req.json());
	if (!parsed.success) {
		return c.json({ error: parsed.error.flatten() }, 400);
	}

	const { videoIds, lang } = parsed.data;
	const results = await Promise.all(
		videoIds.map(async (videoId) => {
			const instance = await c.env.TRANSCRIPT_WORKFLOW.create({
				params: { videoId, lang },
			});
			return { videoId, instanceId: instance.id };
		}),
	);

	return c.json({ workflows: results });
});

app.get("/run/:instanceId", async (c: Context<{ Bindings: Env }>) => {
	const instanceId = c.req.param("instanceId");
	const instance = await c.env.TRANSCRIPT_WORKFLOW.get(instanceId);
	return c.json({ instanceId, status: await instance.status() });
});

export default app;
