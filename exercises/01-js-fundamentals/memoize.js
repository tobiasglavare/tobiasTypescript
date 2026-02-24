function memoize(fn) {
    const cache = {};

    return function(x) {
        if (x in cache) {
            console.log("from cache!");
            return cache[x];
        }

        console.log("computing...");
        cache[x] = fn(x);
        return cache[x];
    };
}

const square = memoize((n) => n * n);
square(4);
square(4);
square(5);
square(5);