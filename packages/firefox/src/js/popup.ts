import { initFilterValues, vision } from "./filter-defs";

let current: string;
let filterValues = JSON.parse(JSON.stringify(initFilterValues));

if (!localStorage.getItem("filterValues")) {
  localStorage.setItem("filterValues", JSON.stringify(filterValues));
} else {
  filterValues = JSON.parse(localStorage.getItem("filterValues")!);
  Object.keys(filterValues).forEach(async (key) => {
    const val = filterValues[key];
    const [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await browser.tabs.sendMessage(tab.id ?? -1, {
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

const dd = document.createElement("select");
dd.id = "dd_filter";
const placeholder = document.createElement("option");
placeholder.textContent = "Select...";
placeholder.value = "";
dd.appendChild(placeholder);
dd.addEventListener("change", handler, false);

Object.keys(vision).forEach(function (key) {
  const visionOpts = vision[key];
  const opt = document.createElement("option");
  opt.dataset["type"] = key;
  opt.value = key;
  opt.textContent = visionOpts.name;
  if (key === current) {
    opt.selected = true;
  }
  dd.appendChild(opt);
});

const slider = document.createElement("input");
slider.type = "range";
slider.id = "filter_slider";
if (!current.includes("NoFilter") && !current.includes("HueRotate")) {
  slider.value = filterValues[current]!.toString();
}
slider.addEventListener("input", async (e) => {
  const [tab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (e.target && e.target instanceof HTMLInputElement) {
    const response = await browser.tabs.sendMessage(tab.id ?? -1, {
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
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const currTab = tabs[0];
    if (currTab) {
      browser.scripting
        .removeCSS({
          css: localStorage.getItem("css") || "",
          target: {
            tabId: currTab.id ?? -1,
          },
        })
        .catch((err) => {
          console.error(err);
        });
      if (current !== "NoFilter") {
        const targetCSS = `body { 
            -webkit-filter: url(#${current}); 
            filter: url(#${current}); 
          }`;
        browser.scripting
          .insertCSS({
            css: targetCSS,
            target: {
              tabId: currTab.id ?? -1,
            },
          })
          .catch((err) => {
            console.error(err);
          });
        localStorage.setItem("css", targetCSS);
      }
      if (!current.includes("NoFilter") && !current.includes("HueRotate")) {
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
