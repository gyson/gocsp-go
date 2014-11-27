
var go = require('..')
var timeout = require('gocsp-timeout')

go(function* () {
    for (var i = 0; i < 10; i++) {
        yield timeout(1000)
        console.log('ping...')
    }
    console.log('done')
})
