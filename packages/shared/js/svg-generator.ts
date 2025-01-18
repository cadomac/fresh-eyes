export function generateSVGFilters(matrices: { [key: string]: ColorMatrix }) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", "fresh-eyes-filters");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("position", "absolute");
  svg.setAttribute("height", "0");
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  svg.appendChild(defs);

  const hueRotate = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "filter",
  );

  hueRotate.setAttribute("id", "HueRotate");

  const rotation = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feColorMatrix",
  );

  const saturation = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feColorMatrix",
  );

  rotation.setAttribute("type", "hueRotate");
  rotation.setAttribute("values", "180deg");

  saturation.setAttribute("type", "saturate");
  saturation.setAttribute("values", "4");

  hueRotate.appendChild(rotation);
  hueRotate.appendChild(saturation);

  defs.appendChild(hueRotate);

  for (const key in matrices) {
    const filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter",
    );
    filter.setAttribute("id", key);

    const feColorMatrix = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feColorMatrix",
    );

    const valArr = matrices[key].map((row) => row.join(" ")).join("\n");
    feColorMatrix.setAttribute("type", "matrix");
    feColorMatrix.setAttribute("values", valArr);
    filter.appendChild(feColorMatrix);
    defs.appendChild(filter);
  }
  return svg;
}
