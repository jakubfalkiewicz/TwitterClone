const express = require("express");
const uuid = require("uuid");

const app = express();

app.use(express.json());

app.use("/", express.static(__dirname, +"/style.css"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let gamesList = [];
const generateList = (s, d) => {
  const resList = Array.from({ length: s }, () =>
    Math.floor(Math.random() * d)
  );
  return resList;
};
const evaluate = (goal, input) => {
  let stringi = input.reduce((prev, curr, index) => {
    if (curr == goal[index]) return [...prev, "b"];
    else if (goal.includes(curr)) return [...prev, "w"];
    else return [...prev, ""];
  }, []);
  return stringi.join("").split("");
};

app.post("/mmind", (req, res) => {
  const size = req.body.size || 5;
  const dim = req.body.dim || 9;
  const max = req.body.max || 0;
  const id = uuid.v4();
  const list = generateList(size, dim);
  // console.log(list);
  gamesList.push({ id: id, list: list, max: max });
  res.send({ size: size, dim: dim, max: max, id: id });
});

app.patch("/mmind", (req, res) => {
  // console.log(gamesList);
  const index = gamesList.findIndex((object) => {
    return object.id === req.body.gameId;
  });
  const game = gamesList.filter((el) => el.id == req.body.gameId)[0];
  // console.log(game.list.join(""));
  const data = req.body.guess.split("").map((el) => parseInt(el));
  //WRONG INPUT DATA
  if (!game) return res.send("Wrong game ID");
  if (data.length != game.list.length) return res.send("Wrong guess length");

  const result = evaluate(game.list, data);
  const blacks = result.reduce((prev, curr) => {
    if (curr === "b") return prev + 1;
    else return prev;
  }, 0);
  //WIN CONDITION
  if (blacks == 4) {
    gamesList = gamesList.splice(index, 1) || [];
    return res.send("Congratz, you guessed right!");
  }
  const whites = result.reduce((prev, curr) => {
    if (curr === "w") return prev + 1;
    else return prev;
  }, 0);
  gamesList[index].max--;
  //LOSE CONDITION
  if (gamesList[index].max == 0) {
    gamesList = gamesList.filter((el) => el.id != req.body.gameId);
    return res.send(
      `Unfortunatelly, you failed! The result was: ${game.list.join("")}`
    );
  }
  // console.log(gamesList);
  return res.send({
    white: whites,
    black: blacks,
    gameId: game.id,
    tries_left: gamesList[index].max < 0 ? "infinite" : gamesList[index].max,
  });
});

app.listen(3000, () =>
  console.log("Server listening on http://localhost:3000/")
);
