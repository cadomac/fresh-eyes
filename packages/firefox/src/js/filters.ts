import { matrices, constructMatrixFromValue } from "./filter-defs";
import { generateSVGFilters } from "./svg-generator";

const filterSvg = document.querySelector("#fresh-eyes-filters");

if (filterSvg === null) {
  const svg = generateSVGFilters(matrices);
  document.body.appendChild(svg);
}

browser.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.value && req.filter) {
    const targetFilter = document.querySelector(`#${req.filter}`);
    const valArr = constructMatrixFromValue(matrices[req.filter], req.value);
    const targetFilterVals = targetFilter!.querySelector(
      `feColorMatrix[type="matrix"]`,
    );
    targetFilterVals!.setAttribute("values", valArr.join(" "));
    sendResponse({ msg: "success" });
  } else {
    sendResponse({ msg: "malformed request" });
  }
});
