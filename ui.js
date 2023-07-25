class SaveUi {
  #div;
  #img;
  #buttonsDiv;
  #restoreButton;
  #deleteButton;

  #restoreCallback;
  #deleteCallback;

  constructor(dataUrl, restoreCallback, deleteCallback) {
    this.#restoreCallback = restoreCallback;
    this.#deleteCallback = deleteCallback;
    this.#div = document.createElement('div');
    this.#div.style.display = 'inline-block';

    this.#img = document.createElement('img');
    this.#img.width = 100;
    this.#div.appendChild(this.#img);
    this.#img.src = dataUrl;

    this.#buttonsDiv = document.createElement('div');
    this.#div.appendChild(this.#buttonsDiv);

    this.#restoreButton = document.createElement('button');
    this.#buttonsDiv.appendChild(this.#restoreButton);
    this.#restoreButton.appendChild(document.createTextNode('restore'));
    this.#restoreButton.addEventListener('click', restoreCallback);

    this.#deleteButton = document.createElement('button');
    this.#buttonsDiv.appendChild(this.#deleteButton);
    this.#deleteButton.appendChild(document.createTextNode('del'));
    this.#deleteButton.addEventListener('click', deleteCallback);
  }

  get restoreButton(){return this.#restoreButton}
  get img(){return this.#img;}
  get div(){return this.#div;}
}

class SavesUi {
  #arr;
  #renderArr;
  #saveUiIdGen;
  #saveUisMap;
  #div;

  constructor(arr, renderArr) {
    this.#arr = arr;
    this.#renderArr = renderArr;
    this.#saveUiIdGen = 0;
    this.#saveUisMap = new Map();
    this.#div = document.createElement('div');
    this.#div.style.display = 'inline-block';
  }

  addSave(dataUrl, restoreDisabled = false) {
    const saveArr = [...this.#arr];
    const saveUiId = this.#saveUiIdGen++;
    const restoreCallback = () => {
      for (let i = 0; i < saveArr.length; i++) {
        this.#arr[i] = saveArr[i];
      }
      this.#renderArr();
    };
    const deleteCallback = () => {
      saveUi.div.remove();
      this.#saveUisMap.delete(saveUiId);
    };
    const saveUi = new SaveUi(dataUrl, restoreCallback, deleteCallback);
    saveUi.restoreButton.disabled = restoreDisabled;
    this.#saveUisMap.set(saveUiId, saveUi);

    this.#div.appendChild(saveUi.div);
  }

  disableRestores() {
    this.#saveUisMap.forEach((saveUi) => saveUi.restoreButton.disabled = true);
  }

  enableRestores() {
    this.#saveUisMap.forEach((saveUi) => saveUi.restoreButton.disabled = false);
  }

  get div(){return this.#div;}
}


export {
  SaveUi, SavesUi
};
