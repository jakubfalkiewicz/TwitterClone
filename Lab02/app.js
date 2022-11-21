// moduł TCP – jako „podstawa serwera aplikacji”
const net = require("net");

// parametr – ewentualnie przekazywany poprzez zmienną środowiskową
const port = process.env.PORT || 3000;

// tworzymy i konfigurujemy obiekt aplikacji
const app = net.createServer((socket) => {
  let gameStart = false;
  let inputParams = [];
  let dataHistory = [];
  let gameSolution = [];
  let gameInput = [];
  let gameStop = [];
  let maxTries = 0;
  let defaultMaxTries = 0;
  socket.write(`Witaj, podaj parametry S,D,M:\r\n`);
  socket.on("data", (data) => {
    if (gameStart == true) {
      if (typeof (parseInt(data) == "int")) {
        console.log(data.toString());
        const dane = data
          .toString()
          .split("")
          .map((el) => parseInt(el));
        gameInput = dane;
        if (gameInput.length == gameSolution.length) {
          const evaluate = (goal, input) => {
            let stringi = input.reduce((prev, curr, index) => {
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
          if (
            gameInput.length === gameSolution.length &&
            gameSolution.every(function (value, index) {
              return value === gameInput[index];
            })
          ) {
            socket.write("ODGADLES CIAG ZNAKOW, BRAWO!");
            socket.end();
          } else if (defaultMaxTries != 0 && maxTries == 1) {
            socket.write(
              `NIESTETY NIE UDALO CI SIE, SZUKANY CIAG: ${gameSolution}`
            );
            socket.end();
          }

          console.log(evaluate(gameSolution, gameInput));
          console.log(gameInput);
          gameInput = [];
          if (defaultMaxTries != 0) {
            maxTries -= 1;
          }
        } else {
          gameInput = [];
        }
      }
    } else if (inputParams.length != 3) {
      socket.write("\r\n");
      data != "\r\n" ? inputParams.push(parseInt(data)) : inputParams.push("");
      if (inputParams.length == 3) {
        socket.write(`Aby wystartowac wpisz START\r\n`);
      }
    } else {
      dataHistory.push(data.toString());
      if (dataHistory.join("").includes("START")) {
        const S = inputParams[0] || 5;
        const D = inputParams[1] || 9;
        maxTries = inputParams[2];
        defaultMaxTries = inputParams[2];
        console.log(`Data from user: ${S}, ${D}, ${maxTries}`);
        const resList = Array.from({ length: S }, () =>
          Math.floor(Math.random() * D)
        );
        socket.write("\r\n");
        socket.write("WYGENEROWALEM CIAG LICZB\r\n");
        gameStart = true;
        gameSolution = resList;
        console.log("ZACZYNAMY!");
      }
    }
  });
});

// uruchamiamy serwer gry
app.listen(port, () => {
  console.log(`Serwer gry dostępny na porcie ${port}`);
});
