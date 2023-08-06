function $(selector: string, context?: Document) {
  return (context || document).querySelector(selector)
}
 
$.all = function (selector: string, context?: Document) {
  return Array.prototype.slice.call(
    (context || document).querySelectorAll(selector)
  )
}

let current: string;

if (!localStorage.getItem("currentFilter")) {
  localStorage.setItem("currentFilter", "NoFilter");
  current = "NoFilter";
} else {
  current = localStorage.getItem("currentFilter") ?? "";
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
  console.log(el, localStorage.getItem("currentFilter"))
  el == localStorage.getItem("currentFilter") && li.classList.add('current')
  ul.appendChild(li)
})

const slider = document.createElement('input');
slider.type = "range";
slider.addEventListener('change', (e) => {
  console.log(e.target.value)
});

document.body.appendChild(slider);

document.body.appendChild(ul)

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
          tabId: currTab.id,
        }
      })
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
  })
}
