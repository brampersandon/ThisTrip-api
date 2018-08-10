// @flow
import * as redis from 'redis'

import type { RedisClient } from 'redis'
import type { TTProvider } from '../../types'

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

// Exporting this function simplifies testing
export const createCache = (client: RedisClient) => ({
  getStop: async (id: string) => hgetall(client)(id),
  getStopsInRadius: (
    latitude: string,
    longitude: string,
    radius: number,
    units: string
  ) => getRadius({ latitude, longitude }, radius, { units })
})

export default createCache(client)
