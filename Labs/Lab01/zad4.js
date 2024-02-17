function defFun(fun, types) {
  fun.typeConstr = types;
  return fun;
}

const myfun = defFun((a, b) => a + b, ["number", "number"]);

function appFun(f, ...args) {
  for (let i = 0; i < args.length; i++) {
    if (f.typeConstr[i] != typeof args[i]) {
      throw { typerr: "Type mismatch" };
    }
  }
  return f(...args);
}

// appFun(myfun, 12, 15);

try {
  console.log(appFun(myfun, 12, "15"));
} catch (e) {
  console.log(e.typerr);
}
