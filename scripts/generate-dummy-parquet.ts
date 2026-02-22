/**
 * Generate dummy Parquet files for local DuckDB-WASM development.
 *
 * Usage: npx tsx scripts/generate-dummy-parquet.ts
 *
 * Outputs:
 *   services/web/public/datasets/v1/transcripts.parquet
 *   services/web/public/datasets/v1/transcript_segments.parquet
 *   services/web/public/datasets/manifest.json
 */
import { DuckDBInstance } from "@duckdb/node-api";
import * as fs from "node:fs";
import * as path from "node:path";

const transcripts = [
	{
		video_id: "example1",
		title: "【VALORANT】CR CUP 本番前日！最後のスクリム練習【花芽すみれ/ぶいすぽっ!】",
		channel_id: "UCyLGcqYs7RsBb3L0SJfzGYA",
		channel_name: "花芽すみれ",
		published_at: "2025-01-14T15:00:00Z",
		duration_sec: 15150,
		thumbnail_url: "https://i.ytimg.com/vi/example1/hqdefault.jpg",
		video_type: "stream",
	},
	{
		video_id: "example2",
		title: "【APEX】ぶいすぽカスタム大会に向けて猛特訓！！！【橘ひなの/ぶいすぽっ!】",
		channel_id: "UCurEA8YoqFwimJcAuSHU0MQ",
		channel_name: "橘ひなの",
		published_at: "2025-01-11T14:00:00Z",
		duration_sec: 19425,
		thumbnail_url: "https://i.ytimg.com/vi/example2/hqdefault.jpg",
		video_type: "stream",
	},
	{
		video_id: "example3",
		title: "【切り抜き】大会練習中のぶいすぽメンバーまとめ【VALORANT/APEX】",
		channel_id: "UCclipch",
		channel_name: "ぶいすぽ切り抜き",
		published_at: "2025-01-16T10:00:00Z",
		duration_sec: 522,
		thumbnail_url: "https://i.ytimg.com/vi/example3/hqdefault.jpg",
		video_type: "clip",
	},
	{
		video_id: "example4",
		title: "【雑談】最近あったおもしろい話を聞いてくれ〜！！【小森めと/ぶいすぽっ!】",
		channel_id: "UCzUNASdzI4PV5SlqtYwAkKQ",
		channel_name: "小森めと",
		published_at: "2025-01-20T13:00:00Z",
		duration_sec: 11750,
		thumbnail_url: "https://i.ytimg.com/vi/example4/hqdefault.jpg",
		video_type: "stream",
	},
	{
		video_id: "example5",
		title: "【切り抜き】小森めとの爆笑エピソードまとめ【雑談配信ハイライト】",
		channel_id: "UCclipch2",
		channel_name: "ぶいすぽ切り抜きch",
		published_at: "2025-01-22T08:00:00Z",
		duration_sec: 754,
		thumbnail_url: "https://i.ytimg.com/vi/example5/hqdefault.jpg",
		video_type: "clip",
	},
];

const segments = [
	{
		video_id: "example1",
		start_ms: 2712000,
		duration_ms: 5000,
		text: "大会前の練習ってほんとに緊張する、明日やばいよ",
	},
	{
		video_id: "example1",
		start_ms: 9005000,
		duration_ms: 4000,
		text: "今日の練習で大会の作戦固まったかも",
	},
	{
		video_id: "example2",
		start_ms: 750000,
		duration_ms: 5000,
		text: "大会の練習しないとまずい、めっちゃやる",
	},
	{
		video_id: "example2",
		start_ms: 13510000,
		duration_ms: 4000,
		text: "今日の練習で結構仕上がってきた気がする",
	},
	{
		video_id: "example3",
		start_ms: 30000,
		duration_ms: 3000,
		text: "大会練習中のすみれとひなの",
	},
	{
		video_id: "example4",
		start_ms: 1395000,
		duration_ms: 5000,
		text: "この前おもしろいことがあってさ、聞いて",
	},
	{
		video_id: "example4",
		start_ms: 6330000,
		duration_ms: 5000,
		text: "雑談配信ってほんと楽しい、おもしろい話いっぱいある",
	},
	{
		video_id: "example5",
		start_ms: 130000,
		duration_ms: 4000,
		text: "めとのおもしろすぎる雑談",
	},
	{
		video_id: "example5",
		start_ms: 465000,
		duration_ms: 4000,
		text: "雑談中に起きたおもしろハプニング集",
	},
];

async function main() {
	const outDir = path.resolve("services/web/public/datasets/v1");
	const manifestDir = path.resolve("services/web/public/datasets");
	fs.mkdirSync(outDir, { recursive: true });

	const instance = await DuckDBInstance.create(":memory:");
	const conn = await instance.connect();

	// Create and populate transcripts table
	await conn.run(`CREATE TABLE transcripts (
    video_id VARCHAR NOT NULL,
    title VARCHAR,
    channel_id VARCHAR,
    channel_name VARCHAR,
    published_at TIMESTAMP,
    duration_sec INTEGER,
    thumbnail_url VARCHAR,
    video_type VARCHAR
  )`);

	for (const t of transcripts) {
		await conn.run(
			`INSERT INTO transcripts VALUES ($1, $2, $3, $4, $5::TIMESTAMP, $6, $7, $8)`,
			[
				t.video_id,
				t.title,
				t.channel_id,
				t.channel_name,
				t.published_at,
				t.duration_sec,
				t.thumbnail_url,
				t.video_type,
			],
		);
	}

	// Create and populate transcript_segments table
	await conn.run(`CREATE TABLE transcript_segments (
    video_id VARCHAR NOT NULL,
    start_ms INTEGER,
    duration_ms INTEGER,
    text VARCHAR
  )`);

	for (const s of segments) {
		await conn.run(
			"INSERT INTO transcript_segments VALUES ($1, $2, $3, $4)",
			[s.video_id, s.start_ms, s.duration_ms, s.text],
		);
	}

	// Export to Parquet
	const transcriptsPath = path.join(outDir, "transcripts.parquet");
	const segmentsPath = path.join(outDir, "transcript_segments.parquet");

	await conn.run(
		`COPY transcripts TO '${transcriptsPath}' (FORMAT PARQUET)`,
	);
	await conn.run(
		`COPY transcript_segments TO '${segmentsPath}' (FORMAT PARQUET)`,
	);

	// Generate manifest.json
	const transcriptsStats = fs.statSync(transcriptsPath);
	const segmentsStats = fs.statSync(segmentsPath);

	const manifest = {
		version: 1,
		generated_at: new Date().toISOString(),
		files: {
			transcripts: {
				path: "v1/transcripts.parquet",
				size_bytes: transcriptsStats.size,
				row_count: transcripts.length,
			},
			transcript_segments: {
				path: "v1/transcript_segments.parquet",
				size_bytes: segmentsStats.size,
				row_count: segments.length,
			},
		},
	};

	fs.writeFileSync(
		path.join(manifestDir, "manifest.json"),
		JSON.stringify(manifest, null, 2),
	);

	conn.closeSync();
	instance.closeSync();

	console.log("Dummy Parquet files generated:");
	console.log(`  ${transcriptsPath}`);
	console.log(`  ${segmentsPath}`);
	console.log(`  ${path.join(manifestDir, "manifest.json")}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
