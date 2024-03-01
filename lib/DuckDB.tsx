import { ReactNode, useEffect, useState } from 'react'

import {
  AsyncDuckDB,
  DuckDBBundles,
  DuckDBConfig,
  InstantiationProgress,
  Logger
} from '@duckdb/duckdb-wasm'

import DuckDBContext from './DuckDBContext'

import {
  instantiateWithBundles,
  instantiateWithJsDelivr
} from './instantiateDB'

export type DuckDBProps = {
  /** Optional DuckDB bundles. If undefined the JsDelivr CDN will be used */
  bundles?: DuckDBBundles
  /** Optional logger. If undefined ConsoleLogger will be used. */
  logger?: Logger
  /** Optional configuration. */
  config?: DuckDBConfig
  /** Child elements will have access to the DuckDB context with useContext */
  children: ReactNode | ReactNode[]
}

/**
 * Provides a context provider for DuckDB.
 *
 * @param props The provider properties
 * @returns A context provider for DuckDB
 */
export default function DuckDB({
  bundles,
  logger,
  config,
  children
}: DuckDBProps) {
  const [db, setDb] = useState<AsyncDuckDB>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()
  const [progress, setProgress] = useState<InstantiationProgress>()

  const handleProgress = (progress: InstantiationProgress) => {
    setProgress(progress)
  }

  useEffect(() => {
    const createDbAsync = async () => {
      const db = bundles
        ? await instantiateWithBundles(bundles, logger, handleProgress)
        : await instantiateWithJsDelivr(logger, handleProgress)

      if (config) {
        await db.open(config)
      }

      return db
    }

    createDbAsync()
      .then(setDb)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [logger, bundles, config])

  return (
    <DuckDBContext.Provider value={{ db, loading, error, progress }}>
      {children}
    </DuckDBContext.Provider>
  )
}
