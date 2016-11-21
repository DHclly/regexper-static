import util from './util.js';

export default class MatchTesting {
  constructor(root) {
    this.root = root;
    this.regField = root.querySelector('#regexp-input');
    this.form = root.querySelector('#testing-form');
    this.testStringElm = root.querySelector('#test-input');
    this.globalElm = root.querySelector('#chkGlobalMatch');
    this.ignoreCaseElm = root.querySelector('#chkIgnoreCase');
    this.multilineElm = root.querySelector('#chkMultiline');

    this.testResult = root.querySelector('#test-result');
    this.errorElm = root.querySelector('#test-error');
  }

  // Shift-Enter test matches
  keypressListener(event) {
    if (event.shiftKey && event.keyCode === 13) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }

      this.form.dispatchEvent(util.customEvent('submit'));
    }
  }

  // Event handler for submission of the testing.
  submitListener(event) {
    event.returnValue = false;
    if (event.preventDefault) {
      event.preventDefault();
    }

    try {
      this.errorElm.style.display = 'none';
      let regString = this.regField.value;
      const testString = this.testStringElm.value;

      const options = [];
      this.globalElm.checked ? options.push('g') : void 0;
      this.ignoreCaseElm.checked ? options.push('i') : void 0;
      this.multilineElm.checked ? options.push('m') : void 0;

      if (regString.charAt(0) === '/' && regString.charAt(regString.length - 1) === '/') {
        regString = regString.substring(1, regString.length - 1);
      }
      const reg = new RegExp(regString, options.join(''));
      const result = testString.match(reg);
      console.log('matches...');
      console.log(result);

      if (!result) {
        this.errorElm.textContent = 'No matches.';
        this.errorElm.style.display = 'block';
        this.testResult.style.display = 'none';
        return;
      }

      this.testResult.style.display = 'block';

      const frag = document.createDocumentFragment();
      const lis = result.forEach((mt, idx) => {
        let li = document.createElement("li");
        li.textContent = `${idx}: ${mt}`;
        frag.appendChild(li);
      });

      while(this.testResult.firstChild) {
        this.testResult.removeChild(this.testResult.firstChild);
      }

      this.testResult.appendChild(frag);
    }
    catch(e) {
      this.testResult.style.display = 'none';
      this.errorElm.textContent = e;
      this.errorElm.style.display = 'block';
    }
  }

  // Binds all event listeners.
  bindListeners() {
    this.testStringElm.addEventListener('keypress', this.keypressListener.bind(this));
    this.form.addEventListener('submit', this.submitListener.bind(this));
  }
}
