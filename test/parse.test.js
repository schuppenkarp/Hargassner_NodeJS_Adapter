const hargassner = require("hargassner_telnet")
const boiler = new hargassner()

test("cases", () => {
  const cases = require("./cases.json")

  for (let { raw, parsed } of cases) {
    expect(boiler.parse(raw)).toEqual(parsed)
  }
})
