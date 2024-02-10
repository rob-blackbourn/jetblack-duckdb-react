import { useEffect, useState } from 'react'

import { useDuckDB } from '../../lib/main'

import { arrowRowGenerator } from '../utils'
import weatherData from '../assets/data.json'

export default function WeatherForecast() {
  const { db, loading, error } = useDuckDB()
  const [isTableLoaded, setIsTableLoaded] = useState(false)

  useEffect(() => {
    if (!db) {
      return
    }
    const asyncFunc = async () => {
      console.log(weatherData)
      const text = JSON.stringify(weatherData)
      console.log('Loading table')
      await db.registerFileText('observations.json', text)
      const con = await db.connect()
      await con.insertJSONFromPath('observations.json', {
        name: 'observations'
      })
      console.log('Table loaded')

      setIsTableLoaded(true)
    }

    asyncFunc().catch(console.error)
  }, [db])

  useEffect(() => {
    if (!(isTableLoaded && db)) {
      return
    }

    const asyncFunc = async () => {
      console.log('Querying table')
      const con = await db.connect()
      const table = await con.query('SELECT * FROM observations;')
      const rows = Array.from(
        arrowRowGenerator(table, (key, value) =>
          key === 'time' && typeof value === 'number' ? new Date(value) : value
        )
      )
      console.log({ rows })
    }

    asyncFunc().catch(console.error)
  }, [isTableLoaded, db])

  console.log({ db, loading, error })

  return <div>Weather Forecast</div>
}
