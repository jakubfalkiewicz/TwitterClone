const f1 = (x, cb) =>
  setTimeout(() => {
    x++;
    cb(x);
  }, 2000);

const f2 = (x, cb) =>
  setTimeout(() => {
    x++;
    cb(x);
  }, 2000);

const myCb = (val) => console.log(val);

const poKolei = (fun1, fun2, cb) => {
  fun1(3, (y) => fun2(y, cb));
};

poKolei(f1, f2, myCb);
