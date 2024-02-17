const groupBy = (tab, key) => {
  let tab1 = [];
  let tab2 = [];
  const tabs = tab.reduce((prev, curr) => {
    if (key(curr)) {
      tab1.push(curr);
    } else tab2.push(curr);
  }, []);
  return { true: tab1, false: tab2 };
};

console.log(groupBy([3, 2, 4, 4, 3], (n) => n % 2 === 0));
