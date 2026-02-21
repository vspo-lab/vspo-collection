import type { AsyncDuckDB } from "@duckdb/duckdb-wasm";

/** Raw search result row from the DuckDB query. */
export type SearchResultRow = {
	video_id: string;
	title: string;
	channel_id: string;
	channel_name: string;
	published_at: string;
	video_type: string;
	duration_sec: number;
	thumbnail_url: string;
	start_ms: number;
	duration_ms: number;
	text: string;
};

export type SearchParams = {
	keyword: string;
	videoTypes?: ("stream" | "clip")[];
	dateFrom?: string;
	dateTo?: string;
	limit?: number;
};

/**
 * Execute an ILIKE-based transcript search.
 * Returns raw SQL result rows. Mapping to domain VideoCard types
 * is handled by the container/hook layer.
 */
export async function searchTranscripts(
	db: AsyncDuckDB,
	params: SearchParams,
): Promise<SearchResultRow[]> {
	const conn = await db.connect();
	try {
		const limit = params.limit ?? 50;
		const safeKeyword = params.keyword.replace(/'/g, "''");

		const result = await conn.query(`
      SELECT t.video_id, t.title, t.channel_id, t.channel_name,
             t.published_at, t.video_type, t.duration_sec, t.thumbnail_url,
             s.start_ms, s.duration_ms, s.text
      FROM transcript_segments s
      JOIN transcripts t ON s.video_id = t.video_id
      WHERE s.text ILIKE '%${safeKeyword}%'
      ORDER BY t.published_at DESC
      LIMIT ${limit};
    `);

		return result.toArray().map((row) => ({
			video_id: String(row.video_id),
			title: String(row.title),
			channel_id: String(row.channel_id),
			channel_name: String(row.channel_name),
			published_at: String(row.published_at),
			video_type: String(row.video_type),
			duration_sec: Number(row.duration_sec),
			thumbnail_url: String(row.thumbnail_url),
			start_ms: Number(row.start_ms),
			duration_ms: Number(row.duration_ms),
			text: String(row.text),
		}));
	} finally {
		await conn.close();
	}
}
