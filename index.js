import {
  CHANGE_SWAP, CHANGE_SETAT,
  bubbleSort, insertionSort, selectionSort,
  shellSort, mergeSort, quickSort, heapSort,
  countingSort, countingSortWithMap, radixSort, radixSortWithBuckets
} from "./sorts.js";

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  const canvasContext = canvas.getContext('2d');

  let barWidth = null;
  let max = null;
  let arr = null;

  document.body.appendChild(document.createElement('br'));

  const newArrayButton = document.createElement('button');
  newArrayButton.appendChild(document.createTextNode('new array'));
  document.body.appendChild(newArrayButton);
  newArrayButton.addEventListener('click', () => {
    randomizeButton.disabled = false;
    sortButtons.forEach((sortButton) => sortButton.disabled = false);
    const size = 1000;
    const range = size;
    arr = Array.from(Array(size)).map(() => Math.trunc((Math.random() * range)));

    barWidth = 

    barWidth = canvas.width / arr.length;

    arr.forEach((num) => {
      if (max < num) {
        max = num;
      }
    });


    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillStyle = 'white';
    arr.forEach((num, i) => {
      const barHeight = num / max * canvas.height;
      canvasContext.fillRect((i * barWidth), canvas.height - barHeight, barWidth, barHeight);
    });

  });

  const randomizeButton = document.createElement('button');
  randomizeButton.disabled = true;
  randomizeButton.appendChild(document.createTextNode('randomize'));
  document.body.appendChild(randomizeButton);
  randomizeButton.addEventListener('click', () => {

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    shuffleArray(arr);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillStyle = 'white';
    arr.forEach((num, i) => {
      const barHeight = num / max * canvas.height;
      canvasContext.fillRect((i * barWidth), canvas.height - barHeight, barWidth, barHeight);
    });

  });

  document.body.appendChild(document.createElement('br'));

  let stop = false;

  const sorts = [
    bubbleSort, insertionSort, selectionSort,
    shellSort, mergeSort, quickSort, heapSort,
    countingSort, countingSortWithMap, radixSort, radixSortWithBuckets
  ];
  const sortButtons = sorts.map((sort) => {
    const sortButton = document.createElement('button');
    sortButton.disabled = true;
    sortButton.appendChild(document.createTextNode(sort.name));
    document.body.appendChild(sortButton);
    sortButton.addEventListener('click', () => {

      allButtons.forEach((button) => {
        button.disabled = true;
      });
      stopButton.disabled = false;



      const [, changes, startTime, endTime] = (() => {
        const startTime = performance.now();
        const sorting = [...arr];

        const changing = [];
        sort(sorting, (...args) => changing.push(args));
        return [sorting, changing, startTime, performance.now()];
      })();

      const timeTakenMs = endTime - startTime;

      if (changes.length === 0) {
        console.log(`${sort.name} changes len=${changes.length} - no changes, nothing to render`);
        allButtons.forEach((button) => {
          button.disabled = false;
        });
        stopButton.disabled = true;
      }
      else {
        const msPerChange = timeTakenMs / changes.length;

        const msPerRender = msPerChange * 1000;
        const expectedTotalRenderMs = timeTakenMs * 1000;

        console.log(`${sort.name} timeTakenMs=${timeTakenMs}, msPerChange=${msPerChange} changes len=${changes.length}`);
        console.log(`${sort.name} msPerRender=${msPerRender}, expectedTotalRenderMs=${expectedTotalRenderMs}`);

        const FULL_RENDER_INTERVAL = 100;

        let changeI = 0;
        const renderStartTime = performance.now();
        let lastRenderAt = renderStartTime;

        const renderSwap = () => {
          const change = changes[changeI];
          const last = changeI === changes.length - 1;

          if (last) {
            allButtons.forEach((button) => {
              button.disabled = false;
            });
            stopButton.disabled = true;

            const renderEndTime = performance.now();
            const renderTimeTakenMs = renderEndTime - renderStartTime;
            console.log(`${sort.name} timeTakenMs ${timeTakenMs.toFixed(2)} ms yieldCount=${changes.length}`);
            console.log(`${sort.name} rendering took ${renderTimeTakenMs.toFixed(2)} ms expectedTotalRenderMs=${expectedTotalRenderMs}`);
          }


          const changeType = change[0];

          switch (changeType) {
            case CHANGE_SWAP: {
              canvasContext.clearRect((change[1] * barWidth), 0, barWidth, canvas.height);
              canvasContext.clearRect((change[2] * barWidth), 0, barWidth, canvas.height);
              [arr[change[1]], arr[change[2]]] = [arr[change[2]], arr[change[1]]];

              const num1 = arr[change[1]];
              const bar1Height = num1 / max * canvas.height;
              canvasContext.fillRect((change[1] * barWidth), canvas.height - bar1Height, barWidth, bar1Height);

              const num2 = arr[change[2]];
              const bar2Height = num2 / max * canvas.height;
              canvasContext.fillRect((change[2] * barWidth), canvas.height - bar2Height, barWidth, bar2Height);

              break;
            }
            case CHANGE_SETAT: {
              canvasContext.clearRect((change[1] * barWidth), 0, barWidth, canvas.height);
              arr[change[1]] = change[2];

              const num = change[2];
              const barHeight = num / max * canvas.height;
              canvasContext.fillRect((change[1] * barWidth), canvas.height - barHeight, barWidth, barHeight);

              break;
            }
          }


          if (changeI % FULL_RENDER_INTERVAL === 0 || last) {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.fillStyle = 'white';
            arr.forEach((num, i) => {
              const barHeight = num / max * canvas.height;
              canvasContext.fillRect((i * barWidth), canvas.height - barHeight, barWidth, barHeight);
            });
          }

          lastRenderAt += msPerRender;
          changeI++;
        };

        const renderLoop = () => {
          while (((performance.now() + msPerRender) > lastRenderAt) && (changeI < changes.length) && !stop) {
            renderSwap();
          }
          if (changeI < changes.length && !stop) {
            requestAnimationFrame(renderLoop);
          }
          else if (stop) {
            stopButton.disabled = true;
            stop = false;
          }
        };

        setTimeout(renderLoop);
      }

    });
    return sortButton;
  });

  document.body.appendChild(document.createElement('br'));
  const stopButton = document.createElement('button');
  stopButton.disabled = true;
  stopButton.appendChild(document.createTextNode('stop'));
  document.body.appendChild(stopButton);
  stopButton.addEventListener('click', () => {
    newArrayButton.disabled = false;
    randomizeButton.disabled = false;
    sortButtons.forEach((sortButton) => sortButton.disabled = false);
    stop = true;
  });

  const allButtons = [newArrayButton, randomizeButton, ...sortButtons, stopButton];
});
