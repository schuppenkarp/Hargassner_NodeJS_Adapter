const net = require('net')

class HargassnerTelnet {
  constructor (options = {}) {
    this.data = {}
    this.raw = []
    this._on = []

    this._ip = options.IP || 'localhost'
    this._port = options.PORT || 23

    const model = options.model || 'default'
    this.model = require('./model/' + model + '.json')

    this._client = new net.Socket()
  }

  connect (options) {
    var me = this

    me._client.connect(me._port, me._ip, function () {
      if (!options || !options.quiet) {
        console.log('Connected to ', me._ip, ':', me._port)
      }
    })
    me._client.on('close', function () {
      me.disconnect()
      me.connect()
    })
    me._client.on('data', function (str) {
      if (str.length > 100) {
        me.raw = str.toString().split(' ')
        me.data = me.parse(me.raw)
        me._on.forEach((elem) => {
          if (typeof (elem) === 'function') elem(me.data)
        })
      }else{
        console.log("Expected string to have greater length, got: " + str.toString());
      }
    })
  }

  on (name, callback) {
    if (name === 'data') {
      this._on.push(callback)
    }
  }

  disconnect () {
    this._client.destroy()
  }

  parse (arr) {
    return parseModel({}, this.model, arr)
  }
}

const isObject = o => o === Object(o) && !Array.isArray(o)

function parseModel (target, model, raw) {
  for (const key in model) {
    if (isObject(model[key])) {
      if (!(key in target)) {
        target[key] = {}
      }
      parseModel(target[key], model[key], raw)
    } else {
      let value
      const spec = model[key]
      if (typeof spec === 'number') {
        value = raw[spec]
      } else if (Array.isArray(spec)) {
        value = ((parseInt(raw[spec[0]], 16) & Number(spec[1])) > 0)
      } // else: "Unexpected configuration!"
      target[key] = value
    }
  }
  return target
}

module.exports = HargassnerTelnet
