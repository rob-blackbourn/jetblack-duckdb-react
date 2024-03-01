import { useContext } from 'react'

import DuckDBContext from './DuckDBContext'

export const useDuckDB = () => useContext(DuckDBContext)
