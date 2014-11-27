
# gocsp-go

goroutine / coroutine

## Example

```js
go(function* () {

    yield chan.take()
    yield chan.put()

    // kind of like select statement in golang
    yield select(s =>
        s(chan.take(), function (err, result) {
            if (result.done) {
                console.log('channel is closed')
            } else {
                console.log('take from channel: ' + result.value)
            }
        })
        ||
        s(chan.put(value), function (err, ok) {
            if (ok) {
                // put okk
            } else {
                // put operation failed
            }
        })
        ||
        s(timeout(1000), function () {
            console.log('timeout!!!')
        })
    )
})
```

## API
### `go( generator / generatorFunction )`

Example:
```js

```
---
### `go.wrap( generatorFunction )`

Wrap a generator function into a regular function that returns a gocsp-thunk.

Example:
```js

```

## License

MIT
