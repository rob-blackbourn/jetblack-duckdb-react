# @jetblack/duckdb-react

A DuckDB context provider for React.

You can find an example app using vite [here](https://github.com/rob-blackbourn/demo-duckdb-react-vite),
webpack  [here](https://github.com/rob-blackbourn/demo-duckdb-react-webpack).
and create-react-app [here](https://github.com/rob-blackbourn/demo-duckdb-react-cra)

## Development

If you are interested in the implementation, the library code is in [`lib`](./lib),
and an example application is in [`src`](./src). To use from source, clone the
project, install the packages, then run the example with `npm run dev`.

## Installation

Install from [npmjs](https://www.npmjs.com/package/@jetblack/duckdb-react).

```bash
npm install @jetblack/duckdb-react
```

## Usage

Use the `DuckDB` context provider to connect to the database.

Children of the `DuckDB` component will have access to the database context.

```typescript
import DuckDB, { useDuckDB } from '@jetblack/duckdb-react'

export default function App() {
  return (
    <DuckDB>
      <HelloWorld />
    </DuckDB>
  )
}

function HelloWorld() {
  // Get the DuckDB context from the hook.
  const { db, loading, error } = useDuckDB()

  useEffect(() => {
    if (loading || !db || error) {
      return
    }

    // Do something with duckdb.

  }, [loading, db, error])

  return <div>Hello, World!</div>
}

```

The `DuckDB` component takes the following properties:

* `bundles`: `DuckDBBundles | undefined` - see the section on bundles below,
* `config`: `DuckDBConfig | undefined` - Optional configuration to apply to the database.
* `logger`: `Logger | undefined` - defaults to the built in `ConsoleLogger`.

The properties returned by `useDuckDB` are:

* `db`: `AsyncDuckDB | undefined` - Set to the database when successfully instantiated.
* `progress`: `InstantiationProgress | undefined` - This is updated during the database instantiation.
* `loading`: `boolean` - This is initially `false`, becoming `true` when either the `db` or `error` property is set.
* `error`: `string | Error | undefined` - Set to the error when instantiation has failed.

### Bundles

In order to create the context a wasm "bundle" may be provided. If a bundle is
not specified it will be downloaded from the JsDelivr CDN.

If specified the bundle is specific to the development environment. The following
gives the bundles defined by the [DuckDB documentation](https://duckdb.org/docs/api/wasm/instantiation).

#### No bundle

If no bundle is provided the bundle will be discovered from the JsDelivr CDN.

#### vite

For vite, create the following.

```typescript
import DuckDB from '@jetblack/duckdb-react'

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

export default function App() {
  return (
    <DuckDB bundles={VITE_BUNDLES}>
      ...
    </DuckDB>
  )
}
```

#### webpack

For webpack, create the following `bundle.ts`.

```typescript bundle.js
import DuckDB from '@jetblack/duckdb-react'

import { DuckDBBundles } from '@duckdb/duckdb-wasm'
import duckdbMvpWasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm'
import duckdbEHWasm from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm'

const WEBPACK_BUNDLES: DuckDBBundles = {
  mvp: {
    mainModule: duckdbMvpWasm,
    mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js', import.meta.url).toString(),
  },
  eh: {
    mainModule: duckdbEHWasm,
    mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js', import.meta.url).toString(),
  }
}

export default function App() {
  return (
    <DuckDB bundles={WEBPACK_BUNDLES}>
      ...
    </DuckDB>
  )
}
```
