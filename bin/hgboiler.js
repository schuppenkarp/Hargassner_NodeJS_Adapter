#!/usr/bin/env node

const HargassnerTelnet = require('../index.js')
const { getopt } = require('stdio')
const { exec } = require('child_process')

const options = getopt({
  ip: { description: 'IP address of the Hargassner boiler', args: 1, required: true },
  raw: { description: 'emit raw format instead of JSON' },
  model: { description: 'model name', args: 1, required: false, default: 'default' },
  once: { description: 'emit one reading and exit' },
  port: { description: 'Port of the Hargassner boiler', args: 1, required: false, default: 23 },
  timestamps: { description: 'Log timestamp in returned data', default: false, required: false },
  site: { description: 'Name of site where Hargassner is deployed', args: 1, default: '', required: false },
  endpoint: { description: 'Send data to public HTTP/HTTPS endpoint', args: 1, default: '', required: false }
})

const heizung = new HargassnerTelnet({ IP: options.ip, PORT: options.port, model: options.model })

heizung.connect({ quiet: 1 })

heizung.on('data', data => {
  if (options.timestamps) {
    // Add local timestamp to data
    data.timestamp = Math.round(new Date().getTime() / 1000)
  }

  if (options.site) {
    // Add local site name to data
    data.site = options.site
  }

  if (options.raw) {
    console.log(heizung.raw.join(' ').trim())
  } else if (options.endpoint) {
    // Send to public HTTP/HTTPS endpoint
    let postData = JSON.stringify(data)
    postData = '{"Data": ' + postData + '}'
    postData = '\'' + postData + '\''
    const curlCommand = 'curl -v -X POST ' + ' https://' + options.endpoint + ' -H "Content-Type: application/json" -d ' + postData
    exec(curlCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Fehler:', error.message)
        return
      }
      if (stderr) {
        console.error('⚠️ stderr:', stderr)
        return
      }
      console.log('✅ Erfolg:', stdout)
    })
    // console.log(data)
  } else {
    console.log(JSON.stringify(data))
  }

  if (options.once) {
    process.exit()
  }
})
