import {CHANGE_SWAP, CHANGE_SETAT, sorts} from "./sorts.js";
import {SavesUi} from "./ui.js";


window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  const canvasContext = canvas.getContext('2d');

  let max = null;
  const size = 1000;
  const arr = Array(size);
  const barWidth = canvas.width / arr.length;

  const renderArr = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillStyle = 'white';
    arr.forEach((num, i) => {
      const barHeight = num / max * canvas.height;
      canvasContext.fillRect((i * barWidth), canvas.height - barHeight, barWidth, barHeight);
    });
  };

  document.body.appendChild(document.createElement('br'));

  const newArrayButton = document.createElement('button');
  newArrayButton.appendChild(document.createTextNode('new array'));
  document.body.appendChild(newArrayButton);
  newArrayButton.addEventListener('click', () => {
    shuffleButton.disabled = false;
    reverseButton.disabled = false;
    saveButton.disabled = false;
    sortButtons.forEach((sortButton) => sortButton.disabled = false);
    const range = size;
    Array.from(Array(size)).forEach((_, i) => {
      arr[i] = Math.trunc((Math.random() * range));
    });

    arr.forEach((num) => {
      if (max < num) {
        max = num;
      }
    });

    renderArr();

  });

  const shuffleButton = document.createElement('button');
  shuffleButton.disabled = true;
  shuffleButton.appendChild(document.createTextNode('shuffle'));
  document.body.appendChild(shuffleButton);
  shuffleButton.addEventListener('click', () => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    renderArr();
  });

  const reverseButton = document.createElement('button');
  reverseButton.disabled = true;
  reverseButton.appendChild(document.createTextNode('reverse'));
  document.body.appendChild(reverseButton);
  reverseButton.addEventListener('click', () => {
    arr.reverse();
    renderArr();
  });


  document.body.appendChild(document.createElement('br'));

  let sorting = false;
  let stop = false;

  const sortButtons = sorts.map((sort) => {
    const sortButton = document.createElement('button');
    sortButton.disabled = true;
    sortButton.appendChild(document.createTextNode(sort.name));
    document.body.appendChild(sortButton);
    sortButton.addEventListener('click', () => {
      sorting = true;

      allButtons.forEach((button) => {
        button.disabled = true;
      });
      savesUi.disableRestores();
      stopButton.disabled = false;

      const [, changes, startTime, endTime] = (() => {
        const startTime = performance.now();
        const sortingArr = [...arr];

        const changingArr = [];
        sort(sortingArr, (...args) => changingArr.push(args));
        return [sortingArr, changingArr, startTime, performance.now()];
      })();

      const timeTakenMs = endTime - startTime;

      if (changes.length === 0) {
        console.log(`${sort.name} changes len=${changes.length} - no changes, nothing to render`);
        allButtons.forEach((button) => {
          button.disabled = false;
        });
        savesUi.enableRestores();
        stopButton.disabled = true;
        sorting = false;
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
            savesUi.enableRestores();
            stopButton.disabled = true;
            sorting = false;

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
            renderArr();
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
            newArrayButton.disabled = false;
            shuffleButton.disabled = false;
            reverseButton.disabled = false;
            saveButton.disabled = false;
            sortButtons.forEach((sortButton) => sortButton.disabled = false);
            savesUi.enableRestores();
            sorting = false;
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
    stop = true;
    stopButton.disabled = true;
  });

  const savesUi = new SavesUi(arr, renderArr);
  const saveButton = document.createElement('button');
  saveButton.disabled = true;
  saveButton.appendChild(document.createTextNode('save'));
  document.body.appendChild(document.createElement('br'));
  document.body.appendChild(saveButton);
  saveButton.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/jpeg', 0.01);
    savesUi.addSave(dataUrl, sorting)
  });

  document.body.appendChild(document.createElement('br'));
  document.body.appendChild(savesUi.div);

  const allButtons = [newArrayButton, shuffleButton, reverseButton, ...sortButtons, stopButton];
});
