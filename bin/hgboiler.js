#!/usr/bin/env node

const HargassnerTelnet = require('../index.js')

const { getopt } = require('stdio')
const options = getopt({
  ip: { description: 'IP address of the Hargassner boiler', args: 1, required: true },
  raw: { description: 'emit raw format instead of JSON' }
})

const heizung = new HargassnerTelnet({ IP: options.ip })

heizung.connect({ quiet: 1 })

heizung.on('data', data => {
  if (options.raw) {
    console.log(heizung.raw.join(' '))
  } else {
    console.log(JSON.stringify(data))
  }
})
