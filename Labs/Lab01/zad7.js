const groupMap = (tab, key, fun) => {
  const tab1 = [];
  const tab2 = [];
  tab.reduce((prev, curr) => {
    if (key(curr)) {
      tab1.push(curr);
    } else tab2.push(curr);
  }, []);
  tab1.reduce((prev, curr) => {
    return [...prev, fun(curr)];
  }, []);
  const res1 = tab1.map((el) => fun(el));
  const res2 = tab2.map((el) => fun(el));
  return `{ true => [${res1}], false => [${res2}]}`;
};
console.log(
  groupMap(
    [3, 2, 4, 4, 3],
    (n) => n % 2 === 0,
    (n) => n + 1
  )
);
