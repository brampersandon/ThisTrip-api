// @flow
const fs = require('fs')
const csv = require('fast-csv')

const redis = require('redis')

const client = redis.createClient(process.env.REDIS_URI || '')
const geo = require('georedis').initialize(client)

// Mapping from CSV data to desired values
//
// stop_id => id (key for hash and georedis zset)
// stop_name => name
// stop_desc => description
// stop_lat => latitude (value for georedis zset item)
// stop_lon => longitude (value for georedis zset item)

// Helper functions for working with stop records
const stopFns = {
    parseRecord: ({ stop_id, stop_name, stop_desc, stop_lat, stop_lon }) => ({
        key: stop_id, 
        value: {
            name: stop_name,
            description: stop_desc,
            id: stop_id,
            latitude: stop_lat.trim(),
            longitude: stop_lon.trim()
        }
    }),
    parseGeoRecord: ({ stop_id, stop_lat, stop_lon }) => ({
        key: stop_id, 
        value: {
            latitude: stop_lat.trim(),
            longitude: stop_lon.trim()
        }
    })
}

let stops = {}
const fstream = fs.createReadStream('./src/data/stops.csv')
const cstream = csv({ headers: true })
    .on('data', (data) => {
        const rec = stopFns.parseRecord(data)
        client.hmset(rec.key, rec.value)
        const geoRec = stopFns.parseGeoRecord(data)
        stops[geoRec.key] = geoRec.value
    })
    .on('end', () => geo.addLocations(stops, () => console.log('Import complete!')))
    .on('error', console.log)

fstream.pipe(cstream)