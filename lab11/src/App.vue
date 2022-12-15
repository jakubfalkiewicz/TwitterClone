<script setup>
  import { ref, watch } from 'vue';
  import ButtonVue from './components/Button.vue';
  let playerHealth = ref(100);
  let enemyHealth = ref(100);
  let singleAttack = ref(15);
  let round = ref(1)
  let logs = []
  let superAttack = false
  let healing = false

  watch(enemyHealth, (newHealth, oldHealth) => {
      const dmg = Math.abs(newHealth - oldHealth);
      if (oldHealth >= newHealth) {
        const log = {player: "player", damage: dmg}
        logs.push(log)
      }
    });

  watch(playerHealth, (newHealth, oldHealth) => {
    const dmg = Math.abs(newHealth - oldHealth);
      if (oldHealth >= newHealth && logs.length % 10 != 0) {
        const log = {player: "opponent", damage: dmg}
        logs.push(log)
      }
    });

  watch(round, (newRound, oldRound) => {
    console.log(round.value)
      newRound % 3 == 0
        ? superAttack = true
        : superAttack = false;
      newRound % 5 == 0
        ? healing = true
        : healing = false;
    })

  function checkWin() {
    if (playerHealth.value <= 0 && enemyHealth.value <= 0) {
      playerHealth.value = 0;
      enemyHealth.value = 0;
      alert("REMIS!");
      document.querySelector(".surrender").innerHTML = "NOWA GRA";
    } else if (playerHealth.value <= 0) {
      playerHealth.value = 0;
      alert("PRZEGRAŁEŚ!");
      document.querySelector(".surrender").innerHTML = "NOWA GRA";
    } else if (enemyHealth.value <= 0) {
      enemyHealth.value = 0;
      alert("WYGRAŁEŚ!");
      document.querySelector(".surrender").innerHTML = "NOWA GRA";
    }
  }
  function playerAttack() {
    enemyHealth.value =
      enemyHealth.value - Math.floor(Math.random() * singleAttack.value) - 1;
    playerHealth.value =
      playerHealth.value - Math.floor(Math.random() * singleAttack.value) - 1;
    document.querySelector(
      ".enemyHealth"
    ).style.width = `${enemyHealth.value > 0 ? enemyHealth.value : 0}% `;
    document.querySelector(
      ".playerHealth"
    ).style.width = `${playerHealth.value > 0 ? playerHealth.value : 0}%`;
    round.value = round.value+1;
    setTimeout(() => {
      checkWin();
    },0) 
  }
  function playerSuperAttack() {
    if (round.value % 3 == 0) {
      enemyHealth.value =
        enemyHealth.value -
        Math.floor(Math.random() * singleAttack.value * 2) +
        1;
      playerHealth.value =
        playerHealth.value -
        Math.floor(Math.random() * singleAttack.value * 2) +
        1;
      document.querySelector(
        ".enemyHealth"
      ).style.width = `${enemyHealth.value > 0 ? enemyHealth.value : 0}%`;
      document.querySelector(
        ".playerHealth"
      ).style.width = `${playerHealth.value > 0 ? playerHealth.value : 0}%`;
      round.value = round.value+1;
      setTimeout(() => {
        checkWin();
      },0) 
    }
  }
  function playerRestore() {
      if (round.value % 5 == 0) {
        const healing = Math.floor(Math.random() * singleAttack.value) + 1;
        const damage = Math.floor(Math.random() * singleAttack.value) + 1;
        const log = {player: "player", damage: '', heal: healing}
        logs.push(log)
        const log2 = {player: "opponent", damage: damage}
        logs.push(log2)
        playerHealth.value = playerHealth.value + healing - damage;
        (document.querySelector(
          ".playerHealth"
        ).style.width = `${playerHealth.value > 0 ? playerHealth.value : 0}%`);
        round.value = round.value+1;
        checkWin();
      }
    }
  function surrender() {
      document.querySelector(".surrender").innerHTML = "KAPITULACJA";
      if (playerHealth.value > 0 && enemyHealth.value > 0) {
        alert("PRZEGRAŁEŚ!");
      } else {
        alert("NOWA GRA!");
      }
      logs = []
      playerHealth.value = 100;
      enemyHealth.value = 100;
      round.value = 1;
      document.querySelector(
        ".enemyHealth"
      ).style.width = `${enemyHealth.value > 0 ? enemyHealth.value : 0}%`;
      document.querySelector(
        ".playerHealth"
      ).style.width = `${playerHealth.value > 0 ? playerHealth.value : 0}%`;
    }
</script>

<template>
  <header>
      <h1>„Pojedynek na wietrze”</h1>
    </header>
    <div id="game">
      <section id="opponent" class="container">
        <h2>Przeciwnik</h2>
        <div class="healthbar">
          <div class="healthbar__value enemyHealth"></div>
          <div class="health">{{enemyHealth}}</div>
        </div>
      </section>
      <section id="player" class="container">
        <h2>Gracz</h2>
        <div class="healthbar">
          <div class="healthbar__value playerHealth"></div>
          <div class="health">{{playerHealth}}</div>
        </div>
      </section>
      <section id="controls">
        <ButtonVue @click="playerAttack"> <template v-slot:name>STARCIE</template></ButtonVue>
        <ButtonVue @click="playerSuperAttack" class="starcie" :class="{ inactive: !superAttack}"><template v-slot:name>STARCIE++</template></ButtonVue>
        <ButtonVue @click="playerRestore" class="restore" :class="{ inactive: !healing}"><template v-slot:name>REGENERACJA</template></ButtonVue>
        <ButtonVue @click="surrender" class="surrender"><template v-slot:name>KAPITUALCJA</template></ButtonVue>
      </section>
      <section id="log" class="container">
        <h2>Dziennik Pojedynku</h2>
        <ul>
          <li v-for="log in logs">
            <div v-if="log.player == 'player'" class="log--player">Gracz</div>
            <div v-if="log.player == 'opponent'" class="log--opponent">Przeciwnik</div>
            <div v-if="log.heal > 0">uleczył się o</div>
            <div v-else>zadał</div>
            <div v-if="log.heal > 0" class="log--heal">{{log.heal}}</div>
            <div v-else class="log--damage">{{log.damage}}</div>
            <div v-if="log.heal > 0">pkt. zdrowia</div> 
            <div v-else> pkt. obrażeń</div>
          </li>
        </ul>
      </section>
    </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

html {
  font-family: "Jost", sans-serif;
}

body {
  margin: 0;
  background-color: aliceblue;
}

header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0.5rem;
  background-color: #5588a0;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

section {
  width: 90%;
  max-width: 40rem;
  margin: auto;
}

.healthbar {
  width: 100%;
  height: 40px;
  border: 1px solid #575757;
  margin: 1rem 0;
  background: #d8d8d8;
}

.healthbar__value {
  /* display: flex;
  justify-content: center;
  align-items: center; */
  background-color: #00a876;
  width: 100%;
  height: 100%;
}

.health {
  position: relative;
  top: -80%;
  font-weight: 600;
}

.container {
  text-align: center;
  padding: 0.5rem;
  margin: 1rem auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 12px;
}

#opponent h2,
#player h2 {
  margin: 0.25rem;
}

#controls {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

button {
  font: inherit;
  border: 1px solid #003488;
  background-color: #003488;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin: 1rem;
  width: 12rem;
  cursor: pointer;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.26);
}

button.inactive {
  background-color: #575757;
}
button.inactive:hover {
  cursor: not-allowed;
  background-color: #575757;
}

button:focus {
  outline: none;
}

button:hover,
button:active {
  background-color: #4923f1;
  border-color: #4923f1;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.26);
}

button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  box-shadow: none;
  color: #3f3f3f;
  cursor: not-allowed;
}

#log ul {
  display: flex;
  align-items: center;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

#log li {
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin: 0.5rem 0;
}

.log--player {
  color: #7700ff;
}

.log--opponent {
  color: #da8d00;
}

.log--damage {
  color: red;
}

.log--heal {
  color: green;
}

</style>
