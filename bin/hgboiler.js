#!/usr/bin/env node

const HargassnerTelnet = require('../index.js')

const { getopt } = require('stdio')
const options = getopt({
  ip: { description: 'IP address of the Hargassner boiler', args: 1, required: true },
  raw: { description: 'emit raw format instead of JSON' },
  model: { description: 'model name', args: 1, required: false, default: 'default' },
  once: { description: 'emit one reading and exit' },
  timestamps: { description: 'Log timestamp in returned data', default: false, required: false },
  site: { description: 'Name of site where Hargassner is deployed', default: '', required: false},
  endpoint: { description: 'Send data to public HTTP/HTTPS endpoint', default: '', required: false }
})

const heizung = new HargassnerTelnet({ IP: options.ip, model: options.model })

heizung.connect({ quiet: 1 })

heizung.on('data', data => {
  if (options.timestamps) {
    // Add local timestamp to data
    data['timestamp'] = Date.now()
  }

  if (options.site) {
    // Add local site name to data
    data['site'] = options.site
  }

  if (options.raw) {
    console.log(heizung.raw.join(' ').trim())
  } elif (options.endpoint) {
    // Send to public HTTP/HTTPS endpoint
    
  } else {
    console.log(JSON.stringify(data))
  }
  if (options.once) {
    process.exit()
  }
})
