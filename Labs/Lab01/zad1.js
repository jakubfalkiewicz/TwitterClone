const tab1 = [
  {
    id: "abc",
    name: "Ala",
  },
  {
    id: "def",
    name: "Tomek",
  },
  {
    id: "ghi",
    name: "Jan",
  },
];

const res = tab1.reduce((prev, curr) => {
  return { ...prev, [curr.id]: curr };
}, {});

console.log(res);
