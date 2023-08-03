function $(selector, context) {
  return (context || document).querySelector(selector)
}
 
$.all = function (selector, context) {
  return Array.prototype.slice.call(
    (context || document).querySelectorAll(selector)
  )
}

let current;

if (!localStorage.getItem("currentFilter")) {
  localStorage.setItem("currentFilter", "NoFilter");
  current = "NoFilter";
} else {
  current = localStorage.getItem("currentFilter");
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

document.body.appendChild(ul)

function handler(e) {
  current = this.dataset['type']
  $.all('li').forEach(function(li) {
    li.classList.remove('current')
  })
  this.classList.add('current');
  localStorage.setItem("currentFilter", current);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let currTab = tabs[0];
    if (currTab) {
      chrome.scripting.insertCSS(
        { 
          css: 'html { -webkit-filter: url(#' + current + '); }',
          target: {
            tabId: currTab.id
          }
        }
      )
    }
  })
}
