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
        const dom = new DOMParser().parseFromString(string, 'text/html').body.children[0];
        Array(...dom.getElementsByTagName("script")).forEach(async scriptEl => {
            await evalScriptTag(scriptEl);
        })
        return dom;
}

export function evalScriptTag(scriptTag) {
    const globalEval = eval;
    const srcUrl = scriptTag?.attributes["src"]?.textContent;
    if (srcUrl) {
      return fetch(srcUrl)
        .then(code => code.text())
        .then(code => {
          globalEval(code);
        });
    } else {
      return new Promise((re) => {
        globalEval(scriptTag.innerText);
        re(true);
      });
    }
  }