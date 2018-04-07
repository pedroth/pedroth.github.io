var DenseNDArray = require('./DenseNDArray.js');

function denseTest() {
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

        console.log(table.get("1,:,:").get([0, 0]) === 1);
        console.log(table.get("1,:,:").get([1, 1]) === 13);
        console.log(table.get("1,:,:").get([2, 2]) === 25);

        var secondTable = table.get("0:1,1:2,:");
        console.log(secondTable.get([1,1,0]) === 7);
        console.log(secondTable.get([1,1,1]) === 16);
        console.log(secondTable.get([1,1,2]) === 25);

        var thirdTable = new DenseNDArray([3, 3]);
        for (var j = 0; j < 3; j++) {
            for (var i = 0; i < 3; i++) {
                thirdTable.set([i, j], 100);
            }
        }

        table.set("1,:,:", thirdTable);

        console.log(table.get( [0, 0, 0 ]) === 0);
        console.log(table.get( [1, 1, 1 ]) === 100 && table.get([1, 2, 1]) === 100);
        console.log(table.get( [2, 2, 2 ]) === 26);
}

denseTest();