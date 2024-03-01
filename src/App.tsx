import DuckDB from '../lib/main'
import VITE_BUNDLES from './bundles'
import WeatherForecast from './components/WeatherForecast'
import Shell from './components/Shell'
import DbProgressBar from './components/DbProgressBar'

export default function App() {
  const useVite = false
  const bundles = useVite ? VITE_BUNDLES : undefined

  return (
    <DuckDB bundles={bundles}>
      <div>
        <DbProgressBar />
        <WeatherForecast />
        <Shell />
      </div>
    </DuckDB>
  )
}
