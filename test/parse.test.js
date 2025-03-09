const Hargassner = require('hargassner_telnet')

test('Should create a JSON object from a input data string separated by empty spaces', () => {
  const boiler = new Hargassner()

  // Loads raw empty space separated input string and expected JSON data
  const cases = require('./cases.json')

  for (const { raw, parsed } of cases) {
    expect(boiler.parse(raw)).toEqual(parsed)
  }
})
