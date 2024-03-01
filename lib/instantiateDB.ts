import {
  AsyncDuckDB,
  ConsoleLogger,
  DuckDBBundles,
  DuckDBConfig,
  InstantiationProgressHandler,
  Logger,
  getJsDelivrBundles,
  selectBundle
} from '@duckdb/duckdb-wasm'

/**
 * Instantiate a DuckDB database using a provided bundle.
 *
 * @param bundles The DuckDB bundles
 * @param logger An optional logger
 * @param progress An optional installation progress callback.
 * @returns The DuckDB database
 */
async function instantiateWithBundles(
  bundles: DuckDBBundles,
  logger?: Logger,
  progress?: InstantiationProgressHandler
): Promise<AsyncDuckDB> {
  // Select a bundle based on browser checks.
  const bundle = await selectBundle(bundles)

  // Instantiate the asynchronous version of DuckDB-wasm.
  const db = new AsyncDuckDB(
    logger || new ConsoleLogger(),
    new Worker(bundle.mainWorker!)
  )
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker, progress)

  return db
}

/**
 * Instantiate a DuckDB database using a bundle provided by the JsDelivr CDN.
 *
 * @param logger An optional logger.
 * @param progress An optional installation progress callback.
 * @returns The DuckDB database.
 */
async function instantiateWithJsDelivr(
  logger?: Logger,
  progress?: InstantiationProgressHandler
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
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker, progress)

  URL.revokeObjectURL(workerUrl)

  return db
}

export async function instantiateDuckDB(
  bundles?: DuckDBBundles,
  config?: DuckDBConfig,
  logger?: Logger,
  progress?: InstantiationProgressHandler
) {
  const db = bundles
    ? await instantiateWithBundles(bundles, logger, progress)
    : await instantiateWithJsDelivr(logger, progress)

  if (config) {
    await db.open(config)
  }

  return db
}
