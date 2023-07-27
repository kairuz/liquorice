
/*
todo:
comb sort
pancake Sort
more...
 */


const CHANGE_SWAP = 0;
const CHANGE_SETAT = 1;


function radixSortWithBuckets(arr, changeCallback = () => {}) {

  const digits = arr.reduce((acc, e) => Math.max(acc, Math.max(Math.floor(Math.log10(Math.abs(e))), 0) + 1), 0);

  for (let i = 1; i <= digits; i++) {
    const buckets = Array.from(Array(10)).map(() => []);
    for (let j = 0; j < arr.length; j++) {
      const num = arr[j];
      const bucketInd = Math.trunc(num % Math.pow(10, i) / Math.pow(10, i - 1));
      buckets[bucketInd].push(num);
    }

    let rI = 0;
    for (let bI = 0; bI < buckets.length; bI++) {
      const bucket = buckets[bI];
      for (let bJ = 0 ; bJ < bucket.length; bJ++) {
        changeCallback(CHANGE_SETAT, rI, bucket[bJ]);
        arr[rI++] = bucket[bJ];
      }
    }
  }

  return arr;
}


function radixSort(arr, changeCallback = () => {}) {
  const output = Array(arr.length);

  const digits = arr.reduce((acc, e) => Math.max(acc, Math.max(Math.floor(Math.log10(Math.abs(e))), 0) + 1), 0);

  for (let i = 1; i <= digits; i++) {

    const counts = Array(10).fill(0);
    for (let j = 0; j < arr.length; j++) {
      const num = arr[j];
      const countInd = Math.trunc(num % Math.pow(10, i) / Math.pow(10, i - 1));
      counts[countInd]++;
    }

    for (let j = 1; j < counts.length; j++) {
      counts[j] += counts[j - 1];
    }

    for (let jj = arr.length - 1; jj >= 0; jj--) {
      const num = arr[jj];
      const countInd = Math.trunc(num % Math.pow(10, i) / Math.pow(10, i - 1));
      counts[countInd]--;
      const outputInd = counts[countInd];
      output[outputInd] = num;
      changeCallback(CHANGE_SETAT, outputInd, num);
    }

    for (let i = 0; i < output.length; i++) {
      arr[i] = output[i];
    }

  }

  return arr;

}

function countingSort(arr, changeCallback = () => {}) {
  const max = Math.max(...arr);
  const temp = Array(max + 1).fill(0);
  for (let i = 0; i < arr.length; i++) {
    temp[arr[i]]++;
  }

  for (let i = 1; i < temp.length - 1; i++) {
    temp[i] += temp[i - 1];
  }

  temp.pop();
  temp.unshift(0);

  const res = Array(arr.length);

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    const numInd = temp[num];
    temp[num]++;
    res[numInd] = num;

  }

  for (let i = 0; i < arr.length; i++) {
    changeCallback(CHANGE_SETAT, i, res[i]);
    arr[i] = res[i];
  }
}


function countingSortWithMap(arr, changeCallback = () => {}) {
  const counts = new Map();
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    if (num > max) {
      max = num;
    }
    if (!counts.has(num)) {
      counts.set(num, 1);
    }
    else {
      counts.set(num, counts.get(num) + 1);
    }
  }

  let num = 0;
  let i = 0;
  while (num <= max) {
    if (counts.has(num)) {
      const amt = counts.get(num);
      for (let j = 0; j < amt; j++) {
        changeCallback(CHANGE_SETAT, i, num);
        arr[i++] = num;
      }
    }
    num++;
  }
}


function heapSort(arr, changeCallback = () => {}) {
  function heapify(currSize, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < currSize && arr[l] > arr[largest])
      largest = l;

    if (r < currSize && arr[r] > arr[largest])
      largest = r;

    if (largest !== i) {
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;

      changeCallback(CHANGE_SWAP, i, largest);

      heapify(currSize, largest);
    }
  }

  const size = arr.length;

  for (let i = Math.floor(size / 2) - 1; i >= 0; i--)
    heapify(size, i);

  for (let i = size - 1; i > 0; i--) {
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    changeCallback(CHANGE_SWAP, 0, i);

    heapify(i, 0);
  }
}

// https://www.geeksforgeeks.org/iterative-merge-sort/
function mergeSort(arr, changeCallback = () => {}) {
  function merge(arr, l, m, r) {
    let i, j, k;
    const leftSize = m - l + 1;
    const rightSize = r - m;

    const left = Array(leftSize).fill(0);
    const right = Array(rightSize).fill(0);

    for (i = 0; i < leftSize; i++) {
      left[i] = arr[l + i];
    }
    for (j = 0; j < rightSize; j++) {
      right[j] = arr[m + 1 + j];
    }

    i = 0;
    j = 0;
    k = l;
    while (i < leftSize && j < rightSize) {
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        changeCallback(CHANGE_SETAT, k, left[i]);
        i++;
      } else {
        arr[k] = right[j];
        changeCallback(CHANGE_SETAT, k, right[j]);
        j++;
      }
      k++;
    }

    while (i < leftSize) {
      arr[k] = left[i];
      changeCallback(CHANGE_SETAT, k, left[i], true);
      i++;
      k++;
    }

    while (j < rightSize) {
      arr[k] = right[j];
      changeCallback(CHANGE_SETAT, k, right[j], true);
      j++;
      k++;
    }
  }

  const n = arr.length;

  for (let curr_size = 1; curr_size <= n - 1; curr_size = 2 * curr_size) {
    for (let left_start = 0; left_start < n - 1; left_start += 2 * curr_size) {
      const mid = Math.min(left_start + curr_size - 1, n - 1);
      const right_end = Math.min(left_start + 2 * curr_size - 1, n - 1);
      merge(arr, left_start, mid, right_end);
    }
  }
}



function shellSort(arr, changeCallback = () => {}) {
  let gap = Math.trunc(arr.length / 2);
  while (gap > 0) {
    for (let i = 0, j = gap; j < arr.length; i++, j++) {
      let k = i;
      while (k >= 0 && (arr[k] > arr[k + gap])) {
        const temp = arr[k];
        arr[k] = arr[k + gap];
        arr[k + gap] = temp;

        changeCallback(CHANGE_SWAP, k, k + gap);

        k -= gap;
      }

    }
    gap = Math.trunc(gap / 2);
  }
}

function insertionSort(arr, changeCallback = () => {}) {
  for (let i = 1; i < arr.length; i++) {
    for (let j = i; j > 0 && arr[j] < arr[j - 1]; j--) {
      const temp = arr[j];
      arr[j] = arr[j - 1];
      arr[j - 1] = temp;

      changeCallback(CHANGE_SWAP, j, j - 1);
    }
  }
}

function selectionSort(arr, changeCallback = () => {}) {
  let smallestInd = null;
  let smallest = null;

  for (let i = 0; i < arr.length; i++) {
    smallestInd = i;
    smallest = arr[smallestInd];
    for (let j = i; j < arr.length; j++) {
      if (arr[j] < smallest) {
        smallestInd = j;
        smallest = arr[smallestInd];
      }
    }

    if (smallestInd !== i) {
      arr[smallestInd] = arr[i];
      arr[i] = smallest;

      changeCallback(CHANGE_SWAP, smallestInd, i);
    }
  }

}

function gnomeSort(arr, changeCallback = () => {}) {
  let index = 0;

  while (index < arr.length) {
    if (index === 0) {
      index++;
    }
    if (arr[index] >= arr[index - 1]) {
      index++;
    }
    else {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
      changeCallback(CHANGE_SWAP, index, index - 1);
      index--;
    }
  }
}

function bubbleSort(arr, changeCallback = () => {}) {
  let swapped;

  do {
    swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
        changeCallback(CHANGE_SWAP, i, i + 1);
      }
    }
  } while (swapped);

}


function cocktailSort(arr, changeCallback = () => {}) {
  let swapped = true;
  let start = 0;
  let end = arr.length;

  do {

    swapped = false;

    for (let i = start; i < end - 1; ++i) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        changeCallback(CHANGE_SWAP, i, i + 1);
      }
    }

    if (swapped === false)
      break;

    swapped = false;

    end = end - 1;

    for (let i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        changeCallback(CHANGE_SWAP, i, i + 1);
      }
    }

    start = start + 1;
  }
  while (swapped === true);
}




// https://www.geeksforgeeks.org/iterative-quick-sort/

function quickSort(arr, changeCallback = () => {}) {
  function partition(low, high) {
    let temp;
    const pivot = arr[high];

    let i = (low - 1);
    for (let j = low; j <= high - 1; j++) {
      if (arr[j] <= pivot) {
        i++;

        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        changeCallback(CHANGE_SWAP, i, j);
      }
    }

    temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    changeCallback(CHANGE_SWAP, i + 1, high);

    return i + 1;
  }

  function qs(l, h) {
    const stack = Array(h - l + 1);
    stack.fill(0);

    let top = -1;

    stack[++top] = l;
    stack[++top] = h;

    while (top >= 0) {
      h = stack[top--];
      l = stack[top--];

      const p = partition(l, h);

      if (p - 1 > l) {
        stack[++top] = l;
        stack[++top] = p - 1;
      }

      if (p + 1 < h) {
        stack[++top] = p + 1;
        stack[++top] = h;
      }
    }
  }

  qs(0, arr.length - 1);
}

const sorts = [
  bubbleSort, cocktailSort, insertionSort, gnomeSort, selectionSort,
  shellSort, mergeSort, quickSort, heapSort,
  countingSort, countingSortWithMap, radixSort, radixSortWithBuckets
];


export {
  CHANGE_SWAP, CHANGE_SETAT,
  sorts,
  bubbleSort, cocktailSort, insertionSort, gnomeSort, selectionSort,
  shellSort, mergeSort, quickSort, heapSort,
  countingSort, countingSortWithMap, radixSort, radixSortWithBuckets
};
