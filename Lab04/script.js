let id = "";
const createGame = (game) => {
  axios
    .post("http://localhost:3000/mmind", game)
    .then((response) => {
      const addedGame = response.data;
      console.log(`POST: game is added`, addedGame);
      // append to DOM
      alert(`Created new game of id: ${addedGame.id}`);
      id = addedGame.id;
      const ul = document.querySelector("ul");
      ul.innerHTML = "";
      //   appendToDOM([addedUser]);
    })
    .catch((error) => console.error(error));
};

const gameGuess = (guess) => {
  axios
    .patch("http://localhost:3000/mmind", guess)
    .then((response) => {
      const data = response.data;
      typeof data == "string" ? alert(data) : appendToDOM([data], guess.guess);
    })
    .catch((error) => console.error(error));
};

const createLi = (game, guess) => {
  console.log(guess);
  const li = document.createElement("li");
  // add user details to `li`
  li.textContent = `Guess: ${guess}. Blacks:${game.black}. Whites:${game.white}. Tries left:${game.tries_left}`;
  return li;
};

const appendToDOM = (games, guess) => {
  const ul = document.querySelector("ul");
  //iterate over all users
  games.map((game) => {
    ul.appendChild(createLi(game, guess));
  });
};

const gameForm = document.querySelector(".gameForm");
const gameFormEvent = gameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const size = document.querySelector("#size").value;
  const dim = document.querySelector("#dim").value;
  const max = document.querySelector("#max").value;
  createGame({ size: size, dim: dim, max: max });
});

const guessForm = document.querySelector(".guessForm");
const guessFormEvent = guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const guess = document.querySelector("#guess").value;
  gameGuess({ gameId: id, guess: guess });
});
