import { ReactNode, useEffect, useState } from 'react'

import {
  AsyncDuckDB,
  ConsoleLogger,
  Logger,
  getJsDelivrBundles,
  selectBundle
} from '@duckdb/duckdb-wasm'

import DuckDBContext from './DuckDBContext'

export type DuckDBJsDelivrProps = {
  logger?: Logger
  children: ReactNode | ReactNode[]
}

export default function DuckDBJsDelivr({
  logger,
  children
}: DuckDBJsDelivrProps) {
  const [db, setDb] = useState<AsyncDuckDB>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const createDbAsync = async () => {
      const bundles = getJsDelivrBundles()

      // Select a bundle based on browser checks
      const bundle = await selectBundle(bundles)

      const worker_url = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker!}");`], {
          type: 'text/javascript'
        })
      )

      // Instantiate the asynchronous version of DuckDB-Wasm
      const db = new AsyncDuckDB(
        logger || new ConsoleLogger(),
        new Worker(worker_url)
      )
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

      URL.revokeObjectURL(worker_url)

      return db
    }

    createDbAsync()
      .then(setDb)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [logger])

  return (
    <DuckDBContext.Provider value={{ db, loading, error }}>
      {children}
    </DuckDBContext.Provider>
  )
}
