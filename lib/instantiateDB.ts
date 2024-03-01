import {
  AsyncDuckDB,
  ConsoleLogger,
  DuckDBBundles,
  Logger,
  getJsDelivrBundles,
  selectBundle
} from '@duckdb/duckdb-wasm'

export async function instantiateWithBundles(
  bundles: DuckDBBundles,
  logger?: Logger
): Promise<AsyncDuckDB> {
  // Select a bundle based on browser checks.
  const bundle = await selectBundle(bundles)

  // Instantiate the asynchronous version of DuckDB-wasm.
  const db = new AsyncDuckDB(
    logger || new ConsoleLogger(),
    new Worker(bundle.mainWorker!)
  )
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

  return db
}

export async function instantiateWithJsDelivr(
  logger?: Logger
): Promise<AsyncDuckDB> {
  // Get the bundles from the JsDelivr CDN.
  const bundles = getJsDelivrBundles()

  // Select a bundle based on browser checks.
  const bundle = await selectBundle(bundles)

  const workerUrl = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker!}");`], {
      type: 'text/javascript'
    })
  )

  // Instantiate the asynchronous version of DuckDB-Wasm
  const db = new AsyncDuckDB(
    logger || new ConsoleLogger(),
    new Worker(workerUrl)
  )
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

  URL.revokeObjectURL(workerUrl)

  return db
}
