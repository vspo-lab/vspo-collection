import type { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import { ManifestSchema } from "../types/parquet-schema";
import type { Manifest } from "../types/parquet-schema";

const DEFAULT_MANIFEST_URL = "/datasets/manifest.json";

/** Fetch manifest.json and validate with Zod schema. */
export async function fetchManifest(manifestUrl?: string): Promise<Manifest> {
	const url = manifestUrl ?? DEFAULT_MANIFEST_URL;
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(
			`Failed to fetch manifest: ${res.status} ${res.statusText}`,
		);
	}
	const json: unknown = await res.json();
	return ManifestSchema.parse(json);
}

/** Register Parquet files as DuckDB views. */
export async function registerViews(
	db: AsyncDuckDB,
	manifest: Manifest,
	baseUrl: string,
): Promise<void> {
	const conn = await db.connect();
	try {
		const transcriptsUrl = `${baseUrl}/${manifest.files.transcripts.path}`;
		const segmentsUrl = `${baseUrl}/${manifest.files.transcript_segments.path}`;

		await conn.query(`
      CREATE OR REPLACE VIEW transcripts AS
      SELECT * FROM read_parquet('${transcriptsUrl}');
    `);
		await conn.query(`
      CREATE OR REPLACE VIEW transcript_segments AS
      SELECT * FROM read_parquet('${segmentsUrl}');
    `);
	} finally {
		await conn.close();
	}
}
