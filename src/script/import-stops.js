const fs = require('fs')
const csv = require('fast-csv')

const fstream = fs.createReadStream('./src/data/stops.csv')
const cstream = csv({ headers: true }).on('data', (d) => console.log(d.stop_name)).on('end', console.log)

fstream.pipe(cstream)