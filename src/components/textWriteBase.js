import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';
import defaultOptions from '../objects/defaultOptions';

// Component Values
const lowerCaseAlpha = String('abcdefghijklmnopqrstuvwxyz').split(''); // lowercase
const upperCaseAlpha = String('abcdefghijklmnopqrstuvwxyz').toUpperCase().split(''); // uppercase
const nonAlpha = String("~!@#$%^&*()_+{}[];'<>,./?=-").split(''); // symbols
const numeric = String('0123456789').split(''); // numeric
const alphaNumeric = lowerCaseAlpha.concat(upperCaseAlpha, numeric); // alpha numeric
const allTypes = alphaNumeric.concat(nonAlpha); // all caracters

const charSet = {
  alpha: lowerCaseAlpha, // lowercase
  upper: upperCaseAlpha, // uppercase
  symbols: nonAlpha, // symbols
  numeric,
  alphanumeric: alphaNumeric,
  all: allTypes,
};

export { charSet };

// Component Functions
export const onStartWrite = {
  /**
   * onStartWrite.text
   *
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  text(tweenProp) {
    if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
      const chars = this._textChars;
      let charsets = charSet[defaultOptions.textChars];

      if (chars in charSet) {
        charsets = charSet[chars];
      } else if (chars && chars.length) {
        charsets = chars;
      }

      KEC[tweenProp] = (elem, a, b, v) => {
        let initialText = '';
        let endText = '';
        const finalText = b === '' ? ' ' : b;
        const firstLetterA = a.substring(0);
        const firstLetterB = b.substring(0);
        /* eslint-disable */
        const pointer = charsets[(Math.random() * charsets.length) >> 0];

        if (a === ' ') {
          endText = firstLetterB
            .substring(Math.min(v * firstLetterB.length, firstLetterB.length) >> 0, 0);
          elem.innerHTML = v < 1 ? ((endText + pointer)) : finalText;
        } else if (b === ' ') {
          initialText = firstLetterA
            .substring(0, Math.min((1 - v) * firstLetterA.length, firstLetterA.length) >> 0);
          elem.innerHTML = v < 1 ? ((initialText + pointer)) : finalText;
        } else {
          initialText = firstLetterA
            .substring(firstLetterA.length,
              Math.min(v * firstLetterA.length, firstLetterA.length) >> 0);
          endText = firstLetterB
            .substring(0, Math.min(v * firstLetterB.length, firstLetterB.length) >> 0);
          elem.innerHTML = v < 1 ? ((endText + pointer + initialText)) : finalText;
        }
        /* eslint-enable */
      };
    }
  },
  /**
   * onStartWrite.number
   *
   * Sets the property update function.
   * @param {string} tweenProp the property name
   */
  number(tweenProp) {
    if (tweenProp in this.valuesEnd && !KEC[tweenProp]) { // numbers can be 0
      KEC[tweenProp] = (elem, a, b, v) => {
        /* eslint-disable */
        elem.innerHTML = numbers(a, b, v) >> 0;
        /* eslint-enable */
      };
    }
  },
};

// Base Component
export const TextWriteBase = {
  component: 'baseTextWrite',
  category: 'textWrite',
  // properties: ['text','number'],
  // defaultValues: {text: ' ',numbers:'0'},
  defaultOptions: { textChars: 'alpha' },
  Interpolate: { numbers },
  functions: { onStart: onStartWrite },
  // export to global for faster execution
  Util: { charSet },
};

export default TextWriteBase;
