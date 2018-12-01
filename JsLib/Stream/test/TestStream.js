var UnitTest = require('../../UnitTest/main/UnitTest.js');
var ArrayUtils = require('../../ArrayUtils/main/ArrayUtils.js');
var Stream = require("../main/Stream.js");

var TestStreams = function() {
    this.mapTest = () => {
        var assert = UnitTest.Assert(this);
        var array = [1, 2, 3, 4, 5];
        assert.assertTrue(Stream.of(array)
                                .map(x => x * x)
                                .reduce(0, (x, y) => x + y) == array.map(x => x * x).reduce((x, y) => x + y, 0)
                         );
        assert.assertTrue(ArrayUtils.arrayEquals(array, Stream.of(Stream.generatorOf(1, s=>s+1, s=>s, s=>s <= 5))
                                                              .map(x=>x*x)
                                                              .map(Math.sqrt)
                                                              .reduce([], (x,y) => x.concat(y))
                                                )
                         );
    }

    this.reduceTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(Stream.range(1,6).map(x => x * x).reduce(0, (x, y) => x + y) == ArrayUtils.range(1,6,1).map(x => x * x).reduce((x, y) => x + y, 0));
        assert.assertTrue(Stream.range(1,6,2).map(x => x * x).reduce(1, (x, y) => x * y) == ArrayUtils.range(1,6,2).map(x => x * x).reduce((x, y) => x * y, 1));
    }

    this.collectTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(ArrayUtils.arrayEquals(Stream.range(0,10).collect(Stream.Collectors.toArray()), ArrayUtils.range(0,10)));
    }

    this.headTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(Stream.range(0,100).head() == 0)
    }

    this.tailTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(ArrayUtils.arrayEquals(Stream.range(0,100).tail().collect(Stream.Collectors.toArray()), ArrayUtils.range(1,100)));
    }

    this.takeTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(ArrayUtils.arrayEquals(Stream.range(0,100).take(10), ArrayUtils.range(0,10)));
        assert.assertTrue(ArrayUtils.arrayEquals(Stream.range(0,100).takeWhile(x => x < 10), ArrayUtils.range(0,10)));
    }

    this.filterTest = () => {
        var assert = UnitTest.Assert(this);
        assert.assertTrue(ArrayUtils.arrayEquals(Stream.range(0, 100)
                                                       .filter(x => x % 2 == 0)
                                                       .collect(Stream.Collectors.toArray()),
                                                 ArrayUtils.range(0, 100).filter(x => x % 2 == 0)
        ));
    }

    this.forEach = () => {
        var assert = UnitTest.Assert(this);
        let stack = [];
        Stream.range(0, 10).filter(x => x % 2 == 0).forEach(x => stack.push(x));
        assert.assertTrue(ArrayUtils.arrayEquals(ArrayUtils.range(0,10).filter(x=>x % 2 == 0), stack));
    }
}

UnitTest.builder()
        .addLogger(UnitTest.bodyLogger)
        .push(new TestStreams())
        .test()