const promises = [
  new Promise((resolve) => setTimeout(resolve, 0, 1)),
  new Promise((resolve) => setTimeout(resolve, 0, 2)),
  new Promise((resolve) => setTimeout(resolve, 0, 3)),
];

const razemTab = (funTab, cb) => {
  Promise.all(funTab)
    .then((data) => {
      console.log(data);
      return data.map((entry) => entry * 2 + 1);
    })
    .then((data) => {
      cb(data);
    });
};
razemTab(promises, (e) => console.log(e));
