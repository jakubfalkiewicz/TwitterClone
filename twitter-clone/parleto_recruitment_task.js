const expenses = {
  "2023-01": {
    "01": {
      food: [22.11, 43, 11.72, 2.2, 36.29, 2.5, 19],
      fuel: [210.22],
    },
    "09": {
      food: [11.9],
      fuel: [190.22],
    },
  },
  "2023-03": {
    "07": {
      food: [20, 11.9, 30.2, 11.9],
    },
    "04": {
      food: [10.2, 11.5, 2.5],
      fuel: [],
    },
  },
  "2023-04": {},
};

function median(values) {
  if (values.length === 0) {
    return 0;
  }

  values = [...values].sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);

  return values.length % 2
    ? values[half]
    : (values[half - 1] + values[half]) / 2;
}

function get_median_of_first_week_expenses(expenses) {
  let result = null;
  let monthExpenses = [];

  for (const yearMonth in expenses) {
    const firstDayOfMonth = new Date(`${yearMonth}-01`).getDay();
    const dates = Object.entries(expenses[yearMonth]).filter(
      ([day]) =>
        parseInt(day) <= 7 && parseInt(day) <= 7 - (6 - firstDayOfMonth)
    );
    for (const [_, expense] of dates) {
      for (const category in expense) {
        expense[category].reduce((_, curr) => monthExpenses.push(curr), 0);
      }
    }
  }

  result = median(monthExpenses);

  return result;
}

console.log(get_median_of_first_week_expenses(expenses));
