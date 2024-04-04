const ATTACK_VALUE = 15;
const STRONG_ATTACK_VALUE = 25;
const MONSTER_ATTACK_VALUE = 15;
const HEAL_VALUE = 25;
const NORMAL_ATTACK = "NORMAL_ATTACK";
const STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let battleLog = [];

const monsterHealthBar = document.getElementById("monster-health");
const playerHealthBar = document.getElementById("player-health");

const attackBtn = document.getElementById("attack-btn");
const strongAttackBtn = document.getElementById("strong-attack-btn");
const healBtn = document.getElementById("heal-btn");
const logBtn = document.getElementById("log-btn");

function adjustHealthBars(maxLife) {
  monsterHealthBar.max = maxLife;
  monsterHealthBar.value = maxLife;
  playerHealthBar.max = maxLife;
  playerHealthBar.value = maxLife;
}

function dealMonsterDamage(damage) {
  const dealtDamage = Math.random() * damage;
  monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
  return dealtDamage;
}

function dealPlayerDamage(damage) {
  const dealtDamage = Math.random() * damage;
  playerHealthBar.value = +playerHealthBar.value - dealtDamage;
  return dealtDamage;
}

function increasePlayerHealth(healValue) {
  playerHealthBar.value = +playerHealthBar.value + healValue;
}

function resetGame(value) {
  playerHealthBar.value = value;
  monsterHealthBar.value = value;
}

function setPlayerHealth(health) {
  playerHealthBar.value = health;
}

function attackMonster(attackMode) {
  let maxDamage;
  let logEventMode;
  if (attackMode === NORMAL_ATTACK) {
    maxDamage = ATTACK_VALUE;
    logEventMode = LOG_EVENT_PLAYER_ATTACK;
  } else if (attackMode === STRONG_ATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
    logEventMode = LOG_EVENT_PLAYER_STRONG_ATTACK;
  } else {
    console.error("Attack Mode must be = ['NORMAL_ATTACK', 'STRONG_ATTACK']");
  }

  let initialPlayerHealth = currentPlayerHealth;
  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= monsterDamage;

  writeToLog(
    logEventMode,
    monsterDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "YOU WON ",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("you lose");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("You have a draw");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
    reset();
  }
}

function attackHandler() {
  attackMonster(NORMAL_ATTACK);
}

function strongAttackHandler() {
  attackMonster(STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    healValue = 0;
    alert("You can't heal to more than your max initial life!");
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;

  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
}

function writeToLog(event, value, monsterHealth, playerHealth) {
  let logEntry;
  switch (event) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry = {
        event: event,
        value: value,
        target: "MONSTER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;

    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: event,
        value: value,
        target: "MONSTER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;

    case LOG_EVENT_MONSTER_ATTACK:
      logEntry = {
        event: event,
        value: value,
        target: "PLAYER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;

    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        event: event,
        value: value,
        target: "PLAYER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;

    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    default:
      logEntry = {};
  }
  battleLog.push(logEntry);
}

function printLogHandler() {
  alert("Open console to see Battle log");
  console.log("/*--- Battle Log ---*/");
  for (let i = 0; i < battleLog.length; i++) {
    console.log(battleLog[i]);
  }
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
