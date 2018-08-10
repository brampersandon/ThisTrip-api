// @flow
import * as redis from 'redis'

import type { RedisClient } from 'redis'
import type { TTStop } from '../../types'

const client = redis.createClient(process.env.REDIS_URI || '')

type HGETALL = (
  client: RedisClient
) => (key: string) => Promise<{ [string]: string }>
const hgetall: HGETALL = client => key =>
  new Promise((resolve, reject) => {
    client.hgetall(key, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })

const geo = require('georedis').initialize(client)

const getRadius = (coords, radius, options) =>
  new Promise((resolve, reject) => {
    geo.radius(coords, radius, options, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })

type GeoredisStopResult = TTStop & { key: string, distance: string }
export type CacheClient = {
  getStop: (id: string) => Promise<?TTStop>,
  getStopsInRadius: (
    latitude: string,
    longitude: string,
    radius: number,
    units: string
  ) => Promise<?Array<GeoredisStopResult>>
}

export const createCache = (client: RedisClient): CacheClient => ({
  getStop: async (id: string) => {
    const response = await hgetall(client)(id)
    if (response == null) return null
    return {
      ...response,
      latitude: parseFloat(response.latitude),
      longitude: parseFloat(response.longitude)
    }
  },
  getStopsInRadius: (
    latitude: string,
    longitude: string,
    radius: number,
    units: string
  ) => getRadius({ latitude, longitude }, radius, { units })
})

export const defaultClient = client
