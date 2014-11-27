'use strict';

module.exports = exports = go

var thunk = require('gocsp-thunk')

function go(gen) {
    return thunk(function (done) {
        if (isGeneratorFunction(gen)) {
            gen = gen()
        }
        if (!isGenerator(gen)) {
            throw new TypeError(gen +
                ' is not generator or generator function')
        }

        next()

        function next(err, res) {
            try {
                var ret = err ? gen.throw(err) : gen.next(res)
                if (ret.done) {
                    done(null, ret.value)
                } else {
                    wait(ret.value, next)
                }
            } catch (e) {
                done(e)
            }
        }
    })
}
exports.go = go
exports.spawn = go // alias

// internal
function wait(obj, next) {
    if (thunk.isThunk(obj)) {
        obj(next)
        return
    }
    if (obj && typeof obj.then === 'function') {
        thunk.from(obj)(next)
        return
    }
    if (typeof obj === 'function') {
        thunk(obj)(next)
        return
    }
    if (Array.isArray(obj)) {
        all(obj)(next)
        return
    }
    next(new TypeError(obj +
        ' is not thunk, promise, callback or array'))
}

// internal
// basic parallel support
function all(list) {
    return thunk(function (done) {
        var result = new Array(list.length)
        var length = list.length
        if (length === 0) {
            done(null, result)
            return
        }
        list.forEach(function (index) {
            if (result === null) { return }
            wait(list[key], function (err, val) {
                if (result === null) { return }
                if (err) {
                    result = null
                    done(err)
                } else {
                    result[index] = val
                    length -= 1
                    if (length === 0) {
                        done(null, result)
                    }
                }
            })
        })
    })
}

function wrap(fn) {
    if (!isGeneratorFunction(fn)) {
        throw new TypeError(fn + ' is not generator function')
    }
    return function () {
        return go(fn.apply(this, arguments))
    }
}
exports.wrap = wrap

// es7 async function
// function async(fn) {
//     if (!Promise) {
//         throw new Error('Cannot find Promise')
//     }
//     if (!isGeneratorFunction(fn)) {
//         throw new TypeError(fn + ' is not generator function')
//     }
//     return function () {
//         return new Promise(go(fn.apply(this, arguments)))
//     }
// }
// exports.async = async

function isGenerator(obj) {
    return Object.prototype.toString.call(obj) === '[object Generator]'
}

function isGeneratorFunction(obj) {
    return obj && obj.constructor
        && obj.constructor.name === 'GeneratorFunction'
}
