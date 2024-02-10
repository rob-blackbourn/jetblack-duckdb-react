# @jetblack/duckdb-react

Utilities for using duckdb with react.

## Installation

Install from npmjs.

```bash
npm install @jetblack/duckdb-react
```

## Usage

The main component is the `DuckDB` context provider.

In order to create the context a wasm "bundle" must be created. The
bundle is specific to the development environment.

### Vite

For vite, create the following `bundle.ts`.

```typescript bundle.ts
import { DuckDBBundles } from '@duckdb/duckdb-wasm'
import duckdbMvpWasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
import duckdbMvpWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
import duckdbEHWasm from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import duckdbEHWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'

const VITE_BUNDLES: DuckDBBundles = {
  mvp: {
    mainModule: duckdbMvpWasm,
    mainWorker: duckdbMvpWorker
  },
  eh: {
    mainModule: duckdbEHWasm,
    mainWorker: duckdbEHWorker
  }
}

export default VITE_BUNDLES
```

### create-react-app

For create-react-app, create the following `bundle.ts`.

```typescript bundle.js
import { DuckDBBundles } from '@duckdb/duckdb-wasm'
import duckdbMvpWasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm';
import duckdbEHWasm from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm';

const CRA_BUNDLES: DuckDBBundles = {
  mvp: {
    mainModule: duckdbMvpWasm,
    mainWorker: ew URL('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js', import.meta.url).toString(),
  },
  eh: {
    mainModule: duckdbEHWasm,
    mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js', import.meta.url).toString(),
  }
}

export default CRA_BUNDLES
```

### DuckDB

Dependents of this component will have access to the context.

```typescript
import DuckDB from '../lib/DuckDB'
import VITE_BUNDLES from './bundles'
import WeatherForecast from './components/WeatherForecast'
import Shell from './components/Shell'

export default function App() {
  return (
    <DuckDB bundles={VITE_BUNDLES}>

      // Children will have access to the context

    </DuckDB>
  )
}
```

A descendent uses the `useDuckDB` hook to get the database.

```typescript
export default function SomeComponent() {
  const { db, loading, error } = useDuckDB()

  useEffect(() => {
    if (loading || !db || error) {
      return
    }

    // Do something with the duckdb

  }, [loading, db, error])

  ...
}
```
