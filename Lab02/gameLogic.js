const gameLogic = (s, d, m) => {
  const size = s || 5;
  const dimension = d || 9;
  const maximum = m || 0;

  const generateList = (s, d) => {
    const resList = Array.from({ length: s }, () =>
      Math.floor(Math.random() * d)
    );
    return resList;
  };
  console.log(generateList(size, dimension));

  console.log(size);
  console.log(dimension);
  console.log(maximum);
};
const generateList = (s, d) => {
  const resList = Array.from({ length: s }, () =>
    Math.floor(Math.random() * d)
  );
  return resList;
};

const evaluate = (goal, input) => {
  let result = "";
  const inputArray = input
    .toString(10)
    .replace(/\D/g, "0")
    .split("")
    .map(Number);
  let stringi = inputArray.reduce((prev, curr, index) => {
    if (curr == goal[index]) {
      return [...prev, "•"];
    } else if (goal.includes(curr)) {
      return [...prev, "○"];
    } else {
      return [...prev, ""];
    }
  }, []);
  return stringi;
};

console.log(evaluate([3, 6, 5, 1], 1234));
console.log(evaluate([1, 4, 3, 5], 1234));

// gameLogic(1, "", 3);
