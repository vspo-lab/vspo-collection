import * as duckdb from "@duckdb/duckdb-wasm";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
	mvp: {
		mainModule: duckdb_wasm,
		mainWorker: mvp_worker,
	},
	eh: {
		mainModule: duckdb_wasm_eh,
		mainWorker: eh_worker,
	},
};

let dbInstance: duckdb.AsyncDuckDB | null = null;

/** Initialize DuckDB-WASM singleton. Idempotent. */
export async function initDuckDB(): Promise<duckdb.AsyncDuckDB> {
	if (dbInstance) return dbInstance;

	const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
	const worker = new Worker(bundle.mainWorker!);
	const logger = new duckdb.ConsoleLogger();
	const db = new duckdb.AsyncDuckDB(logger, worker);
	await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

	dbInstance = db;
	return db;
}

/** Tear down the DuckDB instance and release resources. */
export async function terminateDuckDB(): Promise<void> {
	if (!dbInstance) return;
	await dbInstance.terminate();
	dbInstance = null;
}
