
var test = require('tape')

test('gocsp-go', go.wrap(function* (t) {

    yield someAsyncWork()

    t.end()

}))
