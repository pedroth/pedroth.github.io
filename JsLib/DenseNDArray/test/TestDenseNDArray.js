var DenseNDArray = require('../main/DenseNDArray.js');

var Assertion = function(test) {
    this.testFunction = test;
    this.index = 0;

    this.assertTrue = function(boolean) {
        if(!boolean) throw "Assertion failed : " + [this.testFunction, this.index];
        console.log("Assertion successful : " + [this.testFunction, this.index]);
        this.index++;
    }
};

function Tester() {
    this.basicTest = function() {
        var assert = new Assertion(this.basicTest);
        var table = new DenseNDArray([3, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.assertTrue(table.get([0,0]) == 1);
        assert.assertTrue(table.get([1,2]) == 6);
        assert.assertTrue(table.get([0,2]) == 3);
        assert.assertTrue(table.get([2,1]) == 8);
        var tableReshape = DenseNDArray.of(table, [9,1]);
        assert.assertTrue(table.get([0,0]) == 1);
        assert.assertTrue(table.get([4,0]) == 5);
        assert.assertTrue(table.get([8,0]) == 8);
    }

    this.denseTest = function() {
        var assert = new Assertion(this.denseTest);
        var table = new DenseNDArray([3, 3, 3]);
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 3; k++) {
                    table.set([i, j, k], i + 3 * j + 9 * k);
                }
            }
        }
        for (var k = 0; k < 3; k++) {
            for (var j = 0; j < 3; j++) {
                for (var i = 0; i < 3; i++) {
                    console.log(table.get([i, j, k]));
                }
            }
        }

        assert.assertTrue(table.get("1,:,:").get([0, 0]) === 1);
        assert.assertTrue(table.get("1,:,:").get([1, 1]) === 13);
        assert.assertTrue(table.get("1,:,:").get([2, 2]) === 25);

        var secondTable = table.get("0:1,1:2,:");
        assert.assertTrue(secondTable.get([1,1,0]) === 7);
        assert.assertTrue(secondTable.get([1,1,1]) === 16);
        assert.assertTrue(secondTable.get([1,1,2]) === 25);

        var thirdTable = new DenseNDArray([3, 3]);
        for (var j = 0; j < 3; j++) {
            for (var i = 0; i < 3; i++) {
                thirdTable.set([i, j], 100);
            }
        }

        table.set("1,:,:", thirdTable);

        assert.assertTrue(table.get( [0, 0, 0 ]) === 0);
        assert.assertTrue(table.get( [1, 1, 1 ]) === 100 && table.get([1, 2, 1]) === 100);
        assert.assertTrue(table.get( [2, 2, 2 ]) === 26);

        var denseNDArray = table.get("1:,0:,:1");
        var jsArray = console.log(table.toArray());
        assert.assertTrue(denseNDArray.dim[0] == 2 && denseNDArray.dim[1] == 3 && denseNDArray.dim[2] == 3);
        assert.assertTrue(11 == denseNDArray.get([1, 1, 1]));
    }

    for(key in this) {
        this[key]();
    }
}

new Tester();
