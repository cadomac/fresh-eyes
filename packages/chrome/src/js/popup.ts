function $(selector: string, context?: Document) {
  return (context || document).querySelector(selector)
}
 
$.all = function (selector: string, context?: Document) {
  return Array.prototype.slice.call(
    (context || document).querySelectorAll(selector)
  )
}

let current: string;
let filterValues:{
  [x:string]: string | number
} = {
  "TrueColor": 100,
  "TrueColorG": 100,
  "TrueColorD": 100,
  "TrueColorN": 100,
}

if (!localStorage.getItem("filterValues")) {
  localStorage.setItem("filterValues", JSON.stringify(filterValues));
} else {
  filterValues = JSON.parse(localStorage.getItem("filterValues")!);
  Object.keys(filterValues).forEach(async (key) => {
    let val = filterValues[key];
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id ?? -1, {filter: key, value: val});
    if (response.msg !== "success") {
      console.error("Matrix error");
    }
  })
}

if (!localStorage.getItem("currentFilter")) {
  localStorage.setItem("currentFilter", "NoFilter");
  current = "NoFilter";
} else {
  current = localStorage.getItem("currentFilter")!;
}

let ul = document.createElement('ul'),
    vision = {
      "NoFilter": '',
      'HueRotate': '6%',
      'TrueColor': '6%',
      'TrueColorG': '6%',
      'TrueColorD': '6%',
      'TrueColorN': '6%',
    }

Object.keys(vision).forEach(function (el) {
  let li = document.createElement('li')
  li.dataset['type'] = el
  li.textContent = el
  li.addEventListener('click', handler, false)
  el == localStorage.getItem("currentFilter") && li.classList.add('current')
  ul.appendChild(li)
})

const slider = document.createElement('input');
slider.type = "range";
if (current.includes("TrueColor")) {
  slider.value = filterValues[current].toString();
}
slider.addEventListener('input', async (e) => {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  if (e.target && e.target instanceof HTMLInputElement) {
    const response = await chrome.tabs.sendMessage(tab.id ?? -1, {filter: current, value: e.target.value});
    if (response.msg === "success") {
      filterValues = {...filterValues, [current]: e.target.value}
      localStorage.setItem("filterValues", JSON.stringify(filterValues))
    }
  }
});

document.body.appendChild(slider);
document.body.appendChild(ul);

function handler(e: Event) {
  if (e.target && e.target instanceof HTMLElement) {
    current = e.target.dataset['type'] ?? "";
    $.all('li').forEach(function(li) {
      li.classList.remove('current')
    })
    e.target.classList.add('current');
  }
  localStorage.setItem("currentFilter", current);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let currTab = tabs[0];
    if (currTab) {
      chrome.scripting.removeCSS({
        css: localStorage.getItem("css") || "",
        target: {
          tabId: currTab.id ?? -1,
        }
      })
      if (current !== "NoFilter") {
        chrome.scripting.insertCSS(
          { 
            css: 'html { -webkit-filter: url(#' + current + '); }',
            target: {
              tabId: currTab.id ?? -1
            }
          }
        )
        localStorage.setItem("css", `html { -webkit-filter: url(#${current}); }`)

      }
      console.log(current)
      if (current.includes("TrueColor")) {
        slider.disabled = false;
        slider.value = JSON.parse(localStorage.getItem("filterValues")!)[current];
      } else {
        slider.disabled = true;
      }
    }
  })
}
