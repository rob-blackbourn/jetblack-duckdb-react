import { ReactNode, useEffect, useState } from 'react'

import {
  AsyncDuckDB,
  ConsoleLogger,
  DuckDBBundles,
  Logger,
  selectBundle
} from '@duckdb/duckdb-wasm'

import DuckDBContext from './DuckDBContext'

export type DuckDBProps = {
  bundles: DuckDBBundles
  logger?: Logger
  children: ReactNode | ReactNode[]
}

export default function DuckDB({ bundles, logger, children }: DuckDBProps) {
  const [db, setDb] = useState<AsyncDuckDB>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const asyncFunc = async () => {
      // Select a bundle based on browser checks
      const bundle = await selectBundle(bundles)

      // Instantiate the asynchronous version of DuckDB-wasm
      const db = new AsyncDuckDB(
        logger || new ConsoleLogger(),
        new Worker(bundle.mainWorker!)
      )
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

      return db
    }

    asyncFunc()
      .then(setDb)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [logger, bundles])

  return (
    <DuckDBContext.Provider value={{ db, loading, error }}>
      {children}
    </DuckDBContext.Provider>
  )
}
