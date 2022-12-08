const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      enemyHealth: 100,
      singleAttack: 14,
      round: 1,
    };
  },
  watch: {
    enemyHealth(newHealth, oldHealth) {
      const logList = document.querySelector("ul");
      const log = document.createElement("li");
      const dmg = Math.abs(newHealth - oldHealth);
      if (oldHealth >= newHealth) {
        log.innerHTML = `<div class="log--player">Gracz</div> zadał <div class="log--damage">${dmg}</div>pkt. obrażeń`;
        logList.appendChild(log);
      }
    },
    playerHealth(newHealth, oldHealth) {
      const logList = document.querySelector("ul");
      const log = document.createElement("li");
      const dmg = Math.abs(newHealth - oldHealth);
      if (oldHealth >= newHealth && logList.childElementCount % 10 != 0) {
        log.innerHTML = `<div class="log--opponent">Przeciwnik</div> zadał <div class="log--damage">${dmg}</div>pkt. obrażeń`;
        logList.appendChild(log);
      }
    },
    round(newRound, oldRound) {
      newRound % 3 == 0
        ? document.querySelector(".starcie").classList.remove("inactive")
        : document.querySelector(".starcie").classList.add("inactive");
      newRound % 5 == 0
        ? document.querySelector(".restore").classList.remove("inactive")
        : document.querySelector(".restore").classList.add("inactive");
    },
  },
  methods: {
    checkWin() {
      if (this.playerHealth <= 0 && this.enemyHealth <= 0) {
        this.playerHealth = 0;
        this.enemyHealth = 0;
        alert("REMIS!");
        document.querySelector(".surrender").innerHTML = "NOWA GRA";
      } else if (this.playerHealth <= 0) {
        this.playerHealth = 0;
        alert("PRZEGRAŁEŚ!");
        document.querySelector(".surrender").innerHTML = "NOWA GRA";
      } else if (this.enemyHealth <= 0) {
        this.enemyHealth = 0;
        alert("WYGRAŁEŚ!");
        document.querySelector(".surrender").innerHTML = "NOWA GRA";
      }
    },
    playerAttack() {
      this.enemyHealth =
        this.enemyHealth - Math.floor(Math.random() * this.singleAttack) - 1;
      this.playerHealth =
        this.playerHealth - Math.floor(Math.random() * this.singleAttack) - 1;
      const enemyHealthBar = (document.querySelector(
        ".enemyHealth"
      ).style.width = `${this.enemyHealth > 0 ? this.enemyHealth : 0}% `);
      const playerHealthBar = (document.querySelector(
        ".playerHealth"
      ).style.width = `${this.playerHealth > 0 ? this.playerHealth : 0}%`);
      this.round++;
      this.checkWin();
    },
    playerSuperAttack() {
      if (this.round % 3 == 0) {
        this.enemyHealth =
          this.enemyHealth -
          Math.floor(Math.random() * this.singleAttack * 2) +
          1;
        this.playerHealth =
          this.playerHealth -
          Math.floor(Math.random() * this.singleAttack * 2) +
          1;
        const enemyHealthBar = (document.querySelector(
          ".enemyHealth"
        ).style.width = `${this.enemyHealth > 0 ? this.enemyHealth : 0}%`);
        const playerHealthBar = (document.querySelector(
          ".playerHealth"
        ).style.width = `${this.playerHealth > 0 ? this.playerHealth : 0}%`);
        this.round++;
        document.querySelector(".starcie").classList.add("inactive");
        this.checkWin();
      }
    },
    playerRestore() {
      if (this.round % 5 == 0) {
        const healing = Math.floor(Math.random() * this.singleAttack) + 1;
        const damage = Math.floor(Math.random() * this.singleAttack) + 1;
        const logList = document.querySelector("ul");
        const log1 = document.createElement("li");
        log1.innerHTML = `<div class="log--player">Gracz</div> uleczył się o <div class="log--heal">${healing}</div>pkt. zdrowia`;
        logList.appendChild(log1);
        const log2 = document.createElement("li");
        log2.innerHTML = `<div class="log--opponent">Przeciwnik</div> zadał <div class="log--damage">${damage}</div>pkt. obrażeń`;
        logList.appendChild(log2);
        this.playerHealth = this.playerHealth + healing - damage;
        const playerHealthBar = (document.querySelector(
          ".playerHealth"
        ).style.width = `${this.playerHealth > 0 ? this.playerHealth : 0}%`);
        this.round++;
        document.querySelector(".restore").classList.add("inactive");
        this.checkWin();
      }
    },
    surrender() {
      document.querySelector(".surrender").innerHTML = "KAPITULACJA";
      if (this.playerHealth > 0 && this.enemyHealth > 0) {
        alert("PRZEGRAŁEŚ!");
      } else {
        alert("NOWA GRA!");
      }
      const logList = document.querySelector("ul");
      logList.innerHTML = "";
      this.playerHealth = 100;
      this.enemyHealth = 100;
      this.round = 1;
      const enemyHealthBar = (document.querySelector(
        ".enemyHealth"
      ).style.width = `${this.enemyHealth > 0 ? this.enemyHealth : 0}%`);
      const playerHealthBar = (document.querySelector(
        ".playerHealth"
      ).style.width = `${this.playerHealth > 0 ? this.playerHealth : 0}%`);
    },
  },
});

app.mount("#game");
