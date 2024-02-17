let szablon =
  '<table border="{border}">' +
  "  <tr><td>{first}</td><td>{last}</td></tr>" +
  "</table>";

let dane = {
  first: "Jan",
  last: "Kowalski",
  pesel: "97042176329",
};

String.prototype.podstaw = function (dane) {
  return this.replace("{first}", dane.first || "{first}")
    .replace("{last}", dane.last || "{last}")
    .replace("{border}", dane.border || "{border}");
};
console.log(szablon.podstaw(dane));
