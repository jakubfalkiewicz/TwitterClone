const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const app = Vue.createApp({
  data() {
    return {
        playerHealth: 100,
        enemyHealth: 100,
        singleAttack: 15,
        round: 1
    }
  },
  methods: {
      checkWin(){
        if (this.playerHealth <= 0){
          alert("PRZEGRAES!")
        }
        if (this.enemyHealth <= 0){
          alert("Wygrales!")
        }
      },
      playerAttack() {
        this.enemyHealth = this.enemyHealth - (Math.floor(Math.random() * this.singleAttack))
        this.playerHealth = this.playerHealth - (Math.floor(Math.random() * this.singleAttack))
        const enemyHealthBar = document.querySelector(".enemyHealth").style.width = `${this.enemyHealth > 0 ? this.enemyHealth : 0}% `
        const playerHealthBar = document.querySelector(".playerHealth").style.width = `${this.playerHealth > 0 ? this.playerHealth : 0}%`
        this.round++
        (this.round % 3 == 0) ?
          document.querySelector(".starcie").classList.remove("inactive") :
          document.querySelector(".starcie").classList.add("inactive");
        (this.round % 5 == 0) ?
          document.querySelector(".restore").classList.remove("inactive") :
          document.querySelector(".restore").classList.add("inactive");
        this.checkWin()
        
      },
      playerSuperAttack() {
        if (this.round % 3 == 0){
          this.enemyHealth = this.enemyHealth - (Math.floor(Math.random() * this.singleAttack * 2))
          this.playerHealth = this.playerHealth - (Math.floor(Math.random() * this.singleAttack * 2))
          const enemyHealthBar = document.querySelector(".enemyHealth").style.width = `${this.enemyHealth > 0 ? this.enemyHealth : 0}%`
          const playerHealthBar = document.querySelector(".playerHealth").style.width = `${this.playerHealth > 0 ? this.playerHealth : 0}%`
          this.round++
          document.querySelector(".starcie").classList.add("inactive");
          this.checkWin()
        }
      },
      playerRestore(){
        if (this.round % 5 == 0){
          this.playerHealth = this.playerHealth + (Math.floor(Math.random() * this.singleAttack))
          this.playerHealth = this.playerHealth - (Math.floor(Math.random() * this.singleAttack))
          const playerHealthBar = document.querySelector(".playerHealth").style.width = `${this.playerHealth > 0 ? this.playerHealth : 0}%`
          this.round++
          document.querySelector(".restore").classList.add("inactive")
        }
      },
      surrender(){
        this.playerHealth = 100,
        this.enemyHealth = 100,
        this.round = 1
        const enemyHealthBar = document.querySelector(".enemyHealth").style.width = `${this.enemyHealth > 0 ? this.enemyHealth : 0}%`
        const playerHealthBar = document.querySelector(".playerHealth").style.width = `${this.playerHealth > 0 ? this.playerHealth : 0}%`
      }
  },
});

app.mount("#game");
