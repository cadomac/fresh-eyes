function $(selector: string, context?: Document) {
  return (context || document).querySelector(selector);
}

$.all = function (selector: string, context?: Document) {
  return Array.prototype.slice.call(
    (context || document).querySelectorAll(selector),
  );
};

let current: string;
let filterValues: {
  [x: string]: string | number;
} = {
  TrueColor: 100,
  TrueColorG: 100,
  TrueColorD: 100,
  TrueColorN: 100,
};

if (!localStorage.getItem("filterValues")) {
  localStorage.setItem("filterValues", JSON.stringify(filterValues));
} else {
  filterValues = JSON.parse(localStorage.getItem("filterValues")!);
  Object.keys(filterValues).forEach(async (key) => {
    const val = filterValues[key];
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id ?? -1, {
      filter: key,
      value: val,
    });
    if (response.msg !== "success") {
      console.error("Matrix error");
    }
  });
}

if (!localStorage.getItem("currentFilter")) {
  localStorage.setItem("currentFilter", "NoFilter");
  current = "NoFilter";
} else {
  current = localStorage.getItem("currentFilter")!;
}

const vision = {
  NoFilter: "",
  HueRotate: "6%",
  TrueColor: "6%",
  TrueColorG: "6%",
  TrueColorD: "6%",
  TrueColorN: "6%",
};

const dd = document.createElement("select");
dd.id = "dd_filter";
const placeholder = document.createElement("option");
placeholder.textContent = "Select...";
placeholder.value = "";
dd.appendChild(placeholder);
dd.addEventListener("change", handler, false);

Object.keys(vision).forEach(function (el) {
  const opt = document.createElement("option");
  opt.dataset["type"] = el;
  opt.value = el;
  opt.textContent = el;
  if (el === current) {
    opt.selected = true;
  }
  dd.appendChild(opt);
});

const slider = document.createElement("input");
slider.type = "range";
slider.id = "filter_slider";
if (current.includes("TrueColor")) {
  slider.value = filterValues[current].toString();
}
slider.addEventListener("input", async (e) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (e.target && e.target instanceof HTMLInputElement) {
    const response = await chrome.tabs.sendMessage(tab.id ?? -1, {
      filter: current,
      value: e.target.value,
    });
    if (response.msg === "success") {
      filterValues = { ...filterValues, [current]: e.target.value };
      localStorage.setItem("filterValues", JSON.stringify(filterValues));
    }
  }
});

document.body.appendChild(slider);
document.body.appendChild(dd);

function handler(e: Event) {
  if (e.target && e.target instanceof HTMLSelectElement) {
    current = e.target.value ?? "";
  }
  localStorage.setItem("currentFilter", current);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currTab = tabs[0];
    if (currTab) {
      chrome.scripting.removeCSS({
        css: localStorage.getItem("css") || "",
        target: {
          tabId: currTab.id ?? -1,
        },
      });
      if (current !== "NoFilter") {
        chrome.scripting.insertCSS({
          css: "html { -webkit-filter: url(#" + current + "); }",
          target: {
            tabId: currTab.id ?? -1,
          },
        });
        localStorage.setItem(
          "css",
          `html { -webkit-filter: url(#${current}); }`,
        );
      }
      if (current.includes("TrueColor")) {
        slider.disabled = false;
        slider.value = JSON.parse(localStorage.getItem("filterValues")!)[
          current
        ];
      } else {
        slider.disabled = true;
      }
    }
  });
}
