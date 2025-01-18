const normal: ColorMatrix = [
  [1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
];

const redOnly: ColorMatrix = [
  [3.0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
];
const redAlt: ColorMatrix = [
  [1, 1.0, 1.0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
];
// const greenOnly: ColorMatrix = [
//     [1, 0, 0, 0, 0],
//     [0, 3.0, 0, 0, 0],
//     [0, 0, 1, 0, 0],
//     [0, 0, 0, 1, 0],
// ]
// const blueOnly: ColorMatrix = [
//     [1, 0, 0, 0, 0],
//     [0, 1, 0, 0, 0],
//     [0, 0, 3.0, 0, 0],
//     [0, 0, 0, 1, 0],
// ]

const trueColor: ColorMatrix = [
  [3.0, -1.0, -0.0, 0, 0],
  [-1.0, 2.5, 0.0, 0, 0],
  [-0.0, -0.0, 1.0, 0, 0],
  [0, 0, 0, 1, 0],
];

const trueColorN: ColorMatrix = [
  [2.67, -1.12, -0.0, 0, 0],
  [-1.09, 2.43, 0.0, 0, 0],
  [-0.0, -0.0, 1.0, 0, 0],
  [0, 0, 0, 1, 0],
];

export const matrices: {
  [key: string]: ColorMatrix;
} = {
  normal: normal,
  RedOnly: redOnly,
  Red: redAlt,
  TrueColor: trueColor,
  TrueColorG: trueColor,
  TrueColorD: trueColor,
  TrueColorN: trueColorN,
};

export const vision: {
  [key: string]: {
    name: string;
    value: string;
  };
} = {
  NoFilter: {
    name: "No Filter",
    value: "",
  },
  HueRotate: {
    name: "Hue Rotate",
    value: "6%",
  },
  RedOnly: {
    name: "Red Channel",
    value: "6%",
  },
  Red: {
    name: "Red (All Channels)",
    value: "6%",
  },
  TrueColor: {
    name: "True Color",
    value: "6%",
  },
  TrueColorG: {
    name: "True Color (Gamma)",
    value: "6%",
  },
  TrueColorD: {
    name: "True Color (Desaturate)",
    value: "6%",
  },
  TrueColorN: {
    name: "True Color (Neutral)",
    value: "6%",
  },
};

export const initFilterValues: {
  [x: string]: string | number;
} = {
  Red: 100,
  RedAlt: 100,
  Green: 100,
  Blue: 100,
  TrueColor: 100,
  TrueColorG: 100,
  TrueColorD: 100,
  TrueColorN: 100,
};

export function constructMatrixFromValue(matrix: ColorMatrix, value: number) {
  const newMatrix: number[][] = [[], [], [], []];
  const valArr: number[] = [];

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const currMat = matrix[i][j];
      const signMult = currMat > 0 ? 1 : -1;
      const currNorm = normal[i][j];
      if (i < 3 && j < 3) {
        newMatrix[i][j] =
          normal[i][j] +
          signMult * ((Math.abs(currMat) - currNorm) / 100) * value;
      } else {
        newMatrix[i][j] = matrix[i][j];
      }

      valArr.push(newMatrix[i][j]);
    }
  }

  return valArr;
}
