const fun1 = function (value) {
  return Promise.resolve(value * 2);
};

const fun2 = function (value) {
  return Promise.resolve(value * 3);
};

const fun3 = function (value) {
  return Promise.resolve(value * 4);
};

const wywolanieFunckji = (funcList) => {
  let chain = Promise.resolve(1); // initial value
  for (let i = 0; i < funcList.length; i++) {
    chain = chain.then(funcList[i]); // keep chaining
  }
  return chain; // last promise
};

const poKolei = (tab, cb) => {
  // we need to wait for the last promise in order to print the result
  wywolanieFunckji(tab).then((x) => cb(x));
};

poKolei([fun1, fun2, fun3], (y) => console.log(y)); // prints: "solution is: 16"
