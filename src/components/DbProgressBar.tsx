import { useDuckDB } from '../../lib/main'
import ProgressBar from './ProgressBar'

export default function DbProgressBar() {
  const { progress } = useDuckDB()

  const pct = Math.min(
    100,
    progress ? (100 * progress?.bytesLoaded) / progress?.bytesTotal : 0
  )
  console.log({ pct, progress })

  return <ProgressBar progress={pct} color="blue" height={30} />
}
