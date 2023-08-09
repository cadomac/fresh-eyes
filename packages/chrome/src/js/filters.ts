const normal:ColorMatrix = [
  [1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
];

const trueColor:ColorMatrix = [
  [3.00, -1.00, -0.00, 0, 0],
  [-1.00, 2.50, 0.00, 0, 0],
  [-0.00, -0.00, 1.00, 0, 0],
  [0, 0, 0, 1, 0],
];

const trueColorN:ColorMatrix = [
  [2.67, -1.12, -0.00, 0, 0],
  [-1.09, 2.43, 0.00, 0, 0],
  [-0.00, -0.00, 1.00, 0, 0],
  [0, 0, 0, 1, 0],
];

const matrices:{
  [key:string]: ColorMatrix
} = {
  "normal": normal,
  "TrueColor": trueColor,
  "TrueColorG": trueColor,
  "TrueColorD": trueColor,
  "TrueColorN": trueColorN,
}

function constructMatrixFromValue(matrix:ColorMatrix, value:number) {
  let newMatrix:number[][] = [[],[],[],[]];
  let valArr:number[] = [];

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      let currMat = matrix[i][j];
      let signMult = currMat > 0 ? 1 : -1;
      let currNorm = normal[i][j];
      if (i < 3 && j < 3) {
        newMatrix[i][j] = normal[i][j] + (signMult * ((Math.abs(currMat) - currNorm) / 100) * value);
      } else {
        newMatrix[i][j] = matrix[i][j];
      }
      valArr.push(newMatrix[i][j]);
    }
  }

  return valArr
}

fetch(chrome.runtime.getURL('img/filters.svg'), {
  method: "GET"
})
.then(res => res.text())
.then(str => {
  const filter = new window.DOMParser().parseFromString(str, "text/xml").documentElement;
  filter.style.display = "none";
  filter.style.width = "0";
  filter.style.height = "0";
  document.body.appendChild(filter);
})
.catch((err) => {
  console.error(err);
})

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.value && req.filter) {
    let targetFilter = document.querySelector(`#${req.filter}`);
    let valArr = constructMatrixFromValue(matrices[req.filter], req.value);
    let targetFilterVals = targetFilter!.querySelector(`feColorMatrix[type="matrix"]`);
    targetFilterVals!.setAttribute("values", valArr.join(" "))
    sendResponse({msg: "success"});
  } else {
    sendResponse({msg: "malformed request"})
  }
})
