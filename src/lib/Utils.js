export default {
  isNull(obj) {
    return obj === null;
  },

  isIterable(obj) {
    if (this.isNull(obj)) {
      return false;
    }

    return typeof obj[Symbol.iterator] === 'function';
  },

  isArray(obj) {
    if (this.isNull(obj)) {
      return false;
    }

    return Array.isArray(obj);
  },

  abbreviate(str, max = 3) {
    if (str.length > max) {
      return str.match(/\b([A-Z])/g).join('');
    }

    return str;
  }
}
