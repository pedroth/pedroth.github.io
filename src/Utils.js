export function useState(defaultState) {
    let state = defaultState;
    let onChangeLambda = [];
    const onChange = lambda => {
        onChangeLambda.push(lambda);
    }
    const setState = lambda => {
        state = lambda(state);
        onChangeLambda.forEach(func => {
            func(state)
        });
    }

    const getState = () => state;

    return [getState, setState, onChange];
}

export function memo(lambda) {
    const cache = new Map();
    return async (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.debug('found in memo cache', key);
            return cache.get(key)
        }
        const value = await lambda(...args);
        cache.set(key, value);
        return value;
    }
}

export function date2int(date) {
    const dateStrings = date.split("/");
    let acc = 0;
    let accM = 1;
    for (let j = 0; j < dateStrings.length; j++) {
        acc += parseFloat(dateStrings[j]) * accM;
        accM *= 100;
    }
    return acc;
}

export function formatDate(date) {
    const int2strMonths = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    const dateStrings = date.split("/");
    return `${dateStrings[0]} ${int2strMonths[parseInt(dateStrings[1]) - 1]}, ${dateStrings[2]}`
}

export function shuffle(array) {
    const ans = [...array];
    for (let i = array.length - 1; i > 0; i--) {
        // random number between 0 and i
        const r = Math.floor(Math.random() * (i + 1));
        //swap in place
        const temp = ans[i];
        ans[i] = ans[r];
        ans[r] = temp;
    }
    return ans;
}

export function debounce(lambda, debounceTimeInMillis = 500) {
    let timerId;
    return function (...vars) {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            lambda(...vars);
        }, debounceTimeInMillis);
        return true;
    };
}

export function str2dom(string) {
    const parsed = new DOMParser().parseFromString(string, 'text/html').body.children[0];
    if (!parsed) {
        // Fallback: return wrapper if no root element
        const wrapper = document.createElement('div');
        wrapper.innerHTML = string;
        return wrapper;
    }
    const dom = parsed;
    // Run scripts sequentially so src scripts finish loading before inline
    // scripts that depend on them run, but don't block str2dom so the DOM
    // is mounted before any script executes.
    Array.from(dom.getElementsByTagName("script")).reduce(
        (promise, scriptEl) => promise.then(() => evalScriptTag(scriptEl)),
        Promise.resolve()
    );
    return dom;
}

export function evalScriptTag(scriptTag) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    const type = scriptTag?.attributes["type"]?.textContent;
    if (type) s.type = type;
    const srcUrl = scriptTag?.attributes["src"]?.textContent;
    if (srcUrl) {
      s.onload = resolve;
      s.onerror = reject;
      s.src = srcUrl;
    } else {
      s.textContent = scriptTag.textContent;
    }
    scriptTag.replaceWith(s);
    if (!srcUrl) resolve();
  });
}