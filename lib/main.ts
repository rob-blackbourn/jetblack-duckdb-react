import DuckDB, { DuckDBProps } from './DuckDB'
import DuckDBJsDelivr, { DuckDBJsDelivrProps } from './DuckDBJsDelivr'
import DuckDBContext, { DuckDBContextProps } from './DuckDBContext'
import { useDuckDB } from './helpers'

export default DuckDB
export { DuckDBContext, DuckDBJsDelivr, useDuckDB }
export type { DuckDBProps, DuckDBJsDelivrProps, DuckDBContextProps }
