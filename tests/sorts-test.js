import {sorts} from "../sorts.js"
import {test} from 'uvu';
import * as assert from 'uvu/assert';


const UNSORTED_ARRAY = [
    86, 13, 16, 80, 50, 93, 50, 55, 34, 22, 83, 91, 23, 45, 63, 68, 81, 35,  2, 93,
    18, 76, 94, 55, 68, 94,  7, 48, 63, 46, 63, 68, 84, 49, 13, 24,  0, 85, 95, 33,
    60, 59, 34, 62, 11, 95, 87, 27,  9, 95, 69, 54, 10, 32, 36, 30, 80, 67, 91, 12,
    24,  1, 38, 92, 54, 65, 27, 54, 57, 21, 36, 38, 45, 69, 78, 75, 85, 86, 47, 94,
    33, 84, 54, 92, 28, 99, 93, 88, 87, 36, 50, 91,  6, 18, 95, 86, 65, 17, 12, 23
];

const SORTED_ARRAY = [...UNSORTED_ARRAY].sort((a, b) => a - b);


sorts.forEach((sort) => {
  const testFn = () => {
    const actual = sort([...UNSORTED_ARRAY]);
    assert.equal(actual, SORTED_ARRAY, `sort ${sort.name} error: actual ${actual}, expected ${SORTED_ARRAY}`);
  };
  test('should sort array', testFn);
});

test.run();
