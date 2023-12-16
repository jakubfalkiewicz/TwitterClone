<template>
  <div id="game">
    <section id="opponent" class="container">
      <h2>Przeciwnik</h2>
      <div class="healthbar">
        <div class="healthbar__value enemyHealth"></div>
        <div class="health">{{ enemyHealth }}</div>
      </div>
    </section>
    <section id="player" class="container">
      <h2>Gracz</h2>
      <div class="healthbar">
        <div class="healthbar__value playerHealth"></div>
        <div class="health">{{ playerHealth }}</div>
      </div>
    </section>
    <section id="controls">
      <GenericButton
        :buttonText="'STARCIE'"
        :onButtonAction="playerAttack"
        :isActive="true"
      ></GenericButton>
      <GenericButton
        :buttonText="'STARCIE++'"
        :onButtonAction="playerSuperAttack"
        :isActive="gameRound % 3 === 0"
      ></GenericButton>
      <GenericButton
        :buttonText="'ODZYSKANIE SIŁ'"
        :onButtonAction="playerRestore"
        :isActive="gameRound % 5 === 0"
      ></GenericButton>
      <GenericButton
        :buttonText="'KAPITULACJA'"
        :onButtonAction="surrender"
        :isActive="true"
      ></GenericButton>
    </section>
    <section id="log" class="container">
      <h2>Dziennik Pojedynku</h2>
      <ul>
        <li v-for="item in gameLogs" :key="item.person">
          {{ item.person }} has {{ item.action }}, amount: {{ item.amount }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import GenericButton from "../components/GenericButton.vue";
const playerHealth = ref(100);
const enemyHealth = ref(100);
const gameRound = ref(1);

interface Log {
  person: string;
  action: string;
  amount: number;
}

const logs: Log[] = [];
const gameLogs: Ref<Log[]> = ref(logs);

watch(playerHealth, async (newHealth, oldHealth) => {
  if (newHealth < oldHealth) {
    gameLogs.value = [
      ...gameLogs.value,
      {
        person: "player",
        action: "received damage",
        amount: oldHealth - newHealth,
      },
    ];
  }
  if (newHealth > oldHealth && gameRound.value !== 1) {
    gameLogs.value = [
      ...gameLogs.value,
      { person: "player", action: "healed", amount: newHealth - oldHealth },
    ];
  }
});

watch(enemyHealth, async (newHealth, oldHealth) => {
  if (newHealth < oldHealth) {
    gameLogs.value = [
      ...gameLogs.value,
      {
        person: "enemy",
        action: "received damage",
        amount: oldHealth - newHealth,
      },
    ];
  }
});

function checkWinCondition() {
  console.log(gameLogs.value);
  if (playerHealth.value <= 0 && enemyHealth.value <= 0) {
    alert("REMIS");
    newGame();
  } else if (playerHealth.value <= 0) {
    alert("PRZEGRANA");
    newGame();
  } else if (enemyHealth.value <= 0) {
    alert("WYGRANA");
    newGame();
  }
}

function nextRound() {
  gameRound.value++;
}

function playerAttack() {
  playerHealth.value = playerHealth.value - Math.floor(Math.random() * 10) - 1;
  enemyHealth.value = enemyHealth.value - Math.floor(Math.random() * 10) - 1;
  nextRound();
  checkWinCondition();
}

function playerSuperAttack() {
  playerHealth.value = playerHealth.value - Math.floor(Math.random() * 20) - 1;
  enemyHealth.value = enemyHealth.value - Math.floor(Math.random() * 20) - 1;
  nextRound();
  checkWinCondition();
}

function playerRestore() {
  playerHealth.value = playerHealth.value + Math.floor(Math.random() * 10) + 1;
  playerHealth.value = playerHealth.value - Math.floor(Math.random() * 10) - 1;
  nextRound();
  checkWinCondition();
}

function surrender() {
  playerHealth.value = 0;
  checkWinCondition();
}

function newGame() {
  playerHealth.value = 100;
  enemyHealth.value = 100;
  gameRound.value = 1;
  gameLogs.value = [];
}
</script>
