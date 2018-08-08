// @flow
import * as redis from 'redis'
import type { TTProvider } from '../'

const client = redis.createClient(process.env.REDIS_URI || '')

const { promisify } = require('util')

const set = promisify(client.set).bind(client)
const get = promisify(client.get).bind(client)
const hgetall = promisify(client.hgetall).bind(client)

const geo = require('georedis').initialize(client)

const getRadius = (coords, radius, options) => new Promise((resolve, reject) => {
    geo.radius(coords, radius, options, 
        (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
})

const keys = {
    PROVIDERS: 'providers',
    STOPS: 'stops'
} 

export default {
    setProviders: async (providers: TTProvider[]) => set(keys.PROVIDERS, providers),
    getProviders: async () => get(keys.PROVIDERS),
    getStop: async (id: string) => hgetall(id),
    getStopsInRadius: (latitude: string, longitude: string, radius: number, units: string) => getRadius({latitude, longitude}, radius, { units })
}