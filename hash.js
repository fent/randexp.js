// Thank you CD Sanchez from StackOerflow for this HashSearch function.
window.HashSearch = (() => {
  const parseParams = () => {
    const hash = window.location.hash.slice(1);
    const params = new Map();
    if (!hash) return params;

    for (const part of hash.split('&')) {
      if (!part) continue;
      const [rawKey, rawVal] = part.split('=');
      const key = decodeURIComponent(rawKey);
      const val = rawVal !== undefined ? decodeURIComponent(rawVal) : true;
      params.set(key, val);
    }
    return params;
  };

  const params = parseParams();
  let timer = null;

  const updateHash = () => {
    timer = null;
    const parts = [];
    for (const [key, val] of params) {
      if (val === true) {
        parts.push(encodeURIComponent(key));
      } else {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
      }
    }
    window.location.hash = parts.join('&');
  };

  const push = () => {
    if (timer) return;
    timer = setTimeout(updateHash);
  };

  return {
    set(key, value) {
      params.set(key, value);
      push();
    },

    remove(key) {
      params.delete(key);
      push();
    },

    get(key) {
      return params.get(key);
    },

    keyExists(key) {
      return params.has(key);
    },

    push,
  };
})();

