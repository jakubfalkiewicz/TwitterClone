const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      enemyHealth: 100,
      singleAttack: 15,
      round: 1,
    };
  },
  watch: {
    enemyHealth(newHealth, oldHealth) {
      const logList = document.querySelector("ul");
      const log = document.createElement("li");
      if (oldHealth > newHealth) {
        log.innerHTML = `<div class="log--player">Gracz</div> zadał <div class="log--damage">${Math.abs(
          newHealth - oldHealth
        )}</div>pkt. obrażeń`;
        logList.appendChild(log);
      }
    },
    playerHealth(newHealth, oldHealth) {
      const logList = document.querySelector("ul");
      const log = document.createElement("li");
      console.log(this.round);
      if (oldHealth > newHealth && this.round % 5 != 1) {
        log.innerHTML = `<div class="log--opponent">Przeciwnik</div> zadał <div class="log--damage">${Math.abs(
          newHealth - oldHealth
        )}</div>pkt. obrażeń`;
        logList.appendChild(log);
      }
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
        this.enemyHealth - Math.floor(Math.random() * this.singleAttack);
      this.playerHealth =
        this.playerHealth - Math.floor(Math.random() * this.singleAttack);
      const enemyHealthBar = (document.querySelector(
        ".enemyHealth"
      ).style.width = `${this.enemyHealth > 0 ? this.enemyHealth : 0}% `);
      const playerHealthBar = (document.querySelector(
        ".playerHealth"
      ).style.width = `${this.playerHealth > 0 ? this.playerHealth : 0}%`);
      this.round++;
      this.round % 3 == 0
        ? document.querySelector(".starcie").classList.remove("inactive")
        : document.querySelector(".starcie").classList.add("inactive");
      this.round % 5 == 0
        ? document.querySelector(".restore").classList.remove("inactive")
        : document.querySelector(".restore").classList.add("inactive");
      this.checkWin();
    },
    playerSuperAttack() {
      if (this.round % 3 == 0) {
        this.enemyHealth =
          this.enemyHealth - Math.floor(Math.random() * this.singleAttack * 2);
        this.playerHealth =
          this.playerHealth - Math.floor(Math.random() * this.singleAttack * 2);
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
        const healing = Math.floor(Math.random() * this.singleAttack);
        const damage = Math.floor(Math.random() * this.singleAttack);
        const logList = document.querySelector("ul");
        const log1 = document.createElement("li");
        log1.innerHTML = `<div class="log--player">Gracz</div> uleczył się o <div class="log--heal">${healing}</div>pkt. zdrowia`;
        logList.appendChild(log1);
        const log2 = document.createElement("li");
        log2.innerHTML = `<div class="log--opponent">Przeciwnik</div> zadał <div class="log--damage">${damage}</div>pkt. obrażeń`;
        logList.appendChild(log2);
        this.playerHealth = this.playerHealth + healing;
        this.playerHealth = this.playerHealth - damage;
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
