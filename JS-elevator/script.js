document.addEventListener("DOMContentLoaded", () => {
  const noOfStagesInput = document.getElementById('no-of-stages-input');
  const noOfStages = parseInt(noOfStagesInput.value);

  const capacityInput = document.getElementById('elevator-capacity-input');
  const capacity = parseInt(capacityInput.value);

// let noOfStages = 7;
let canvas;
let ctx;
let stage = {y: 0};
let pawns = [];
let timerId;
let moveTimeout = 100;
let id = 0;
let chanceToAddNewPawn = 10; // ez a szám az 1-hez az esélye z új pawn-nak
let speed = 10; // minél nagyobb, annál gyorsabb  !!! 500%speed = 0 !!!
let pointCounter = 0;
let loosePointCounter = 0;
const elevator = {actualStage: 0, coordY: 700, noOfPawnInElevator: 0, capacity};
 let outSound = new sound("out.mp3");
 let elevatorSound = new sound("elevator.mp3");

function Pawn(id, color, isEntrySideLeft, entryStage, destinationStage, coordX, actualStage, coordY, isInElevator, mood) {
  this.id = id;
  this.color = color;
  this.isEntrySideLeft = isEntrySideLeft;
  this.entryStage = entryStage;
  this.destinationStage = destinationStage;
  this.coordX = coordX;
  this.actualStage = entryStage;
  this.coordY = 800 - ((entryStage + 1) * 100);
  this.isInElevator = false;
  this.mood = 0;
}

  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }
// document.addEventListener("DOMContentLoaded", () => {

  // canvas = document.getElementById("canvas");
  // ctx = canvas.getContext("2d");
  // timerId = setInterval(gameFlow, moveTimeout);

// });


const gameFlow = () => {
  checkValidState();
  generatePawn();
  draw();
  movePawns();
  displayData();
  updateMoveTimeout();
  listenEvents();

}

const checkValidState = () => {
  if (elevator.actualStage <= 0) {
    elevator.actualStage = 0
  } else if (elevator.actualStage >= noOfStages) {
    elevator.actualStage = noOfStages
  }

  pawns.sort(function (a, b) {
    return b.mood - a.mood
  })

}

const generatePawn = () => {
  if (Math.floor(Math.random() * (chanceToAddNewPawn)) == 1) {
    let isEntrySideLeft;
    let coordX;
    if (Math.floor(Math.random() * (2)) == 1) {
      isEntrySideLeft = true;
    } else {
      isEntrySideLeft = false;
    }

    if (isEntrySideLeft) {
      coordX = 0;
    } else {
      coordX = 1200;
    }
    let entryStage = Math.floor(Math.random() * (noOfStages + 1));
    let destinationStage = Math.floor(Math.random() * (noOfStages + 1));
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const newPawn = new Pawn(id, color, isEntrySideLeft, entryStage, destinationStage, coordX);
    id++;
    pawns.push(newPawn);
  }
}

const draw = () => {
  // canvas letörlése
  ctx.clearRect(0, 0, 1200, 800);
// draw stages
  for (let i = noOfStages; i > 0; i--) {
    ctx.moveTo(0, 800 - i * 100);
    ctx.lineTo(500, 800 - i * 100);
    ctx.moveTo(700, 800 - i * 100);
    ctx.lineTo(1200, 800 - i * 100);
  }
  ctx.stroke();
  // draw number of stages
  ctx.font = "30px Arial";
  for (let i = noOfStages; i >= 0; i--) {
    ctx.strokeText(i, 590, 750 - i * 100);
  }
// draw elevator
  ctx.fillStyle = "white";
  // while (elevator.coordY != (700 - elevator.actualStage * 100)) {
  ctx.fillRect(500, 700 - elevator.actualStage * 100, 200, 100);
  ctx.strokeStyle = "rgba(0,0,0,1)";
  ctx.strokeRect(500, 700 - elevator.actualStage * 100, 200, 100);

  // console.log(elevator.coordY);
// }
  // draw pawns
  for (const pawn of pawns) {
    ctx.fillStyle = pawn.color;
    ctx.fillRect(pawn.coordX - 5, pawn.coordY + 60 + pawn.mood, 10, 40 - pawn.mood);
    ctx.font = "30px Arial";
    ctx.fillText(pawn.destinationStage, pawn.coordX - 7, pawn.coordY + 50);
  }

  // Game Over
  if (loosePointCounter >= 1000) {

    // ctx.clearRect(0, 0, 1200, 800);

    ctx.font = `bold 6rem Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', 600, 400);
    moveTimeout = 60000;
  }

}

const movePawns = () => {
  for (let i = 0; i < pawns.length; i++) {
    pawn = pawns[i];

    if (pawn.isInElevator) {
      pawn.actualStage = elevator.actualStage;
      pawn.coordY = 700 - elevator.actualStage * 100
    }
    if (pawn.isEntrySideLeft) {
      if (pawn.coordX !== 500 && pawn.coordX !== 700) {
        pawn.coordX += speed;
      } else if (pawn.coordX === 500 && pawn.actualStage === elevator.actualStage && elevator.noOfPawnInElevator < elevator.capacity) {
        pawn.coordX += speed;
        pawn.isInElevator = true;
        elevator.noOfPawnInElevator++;
        pawn.mood--;
      } else if (pawn.coordX === 700 && pawn.isInElevator && pawn.actualStage === pawn.destinationStage) {
        pawn.coordX += speed;
        pawn.isInElevator = false;
        elevator.noOfPawnInElevator--;
      } else pawn.mood += 0.2;


    } else {
      if (pawn.coordX !== 500 && pawn.coordX !== 700) {
        pawn.coordX -= speed;
      } else if (pawn.coordX === 700 && pawn.actualStage === elevator.actualStage && elevator.noOfPawnInElevator < elevator.capacity) {
        pawn.coordX -= speed;
        pawn.isInElevator = true;
        elevator.noOfPawnInElevator++;
        pawn.mood--;
      } else if (pawn.coordX === 500 && pawn.isInElevator && pawn.actualStage === pawn.destinationStage) {
        pawn.coordX -= speed;
        pawn.isInElevator = false;
        elevator.noOfPawnInElevator--;
      } else pawn.mood += 0.2;
    }


    // pawn kilépés => pont szerzés
    if (pawn.coordX < 0 || pawn.coordX > 1200) {
      pointCounter++;
      pawns.splice(i, 1);
      outSound.play();
    }

    // pawn halál => vesztes pont szerzés
    if (pawn.mood > 40) {
      loosePointCounter++;
      pawns.splice(i, 1);
      elevatorSound.play();
    }


  }
}

const displayData = () => {
  const displayPoint = document.getElementById('point-counter');
  displayPoint.innerHTML = pointCounter;

  const displayLoosePoint = document.getElementById('loose-point-counter');
  displayLoosePoint.innerHTML = loosePointCounter;

  const displayCapacity = document.getElementById('capacity-counter');
  displayCapacity.innerHTML = elevator.noOfPawnInElevator;
};

const updateMoveTimeout = () => {

  clearInterval(timerId);
  timerId = setInterval(gameFlow, moveTimeout);
};

document.addEventListener("keydown", (event) => {


  if (event.code === "ArrowUp") {
    event.preventDefault();
    elevator.actualStage += 1;
    console.log("The elevator is on stage no:", elevator.actualStage);
  }
  if (event.code === "ArrowDown") {
    event.preventDefault();
    elevator.actualStage += -1;
    console.log("The elevator is on stage no:", elevator.actualStage);
  }
});
const listenEvents = () => {
  const startButtonOn = document.getElementById('restart-button');
  startButtonOn.addEventListener("click", () => {
    const noOfStagesInput = document.getElementById('no-of-stages-input');
    const noOfStages = parseInt(noOfStagesInput.value);
    const capacityInput = document.getElementById('elevator-capacity-input');
    const capacity = parseInt(capacityInput.value);
    pawns = [];
    pointCounter = 0;
    loosePointCounter = 0;
    elevator = {actualStage: 0, coordY: 700, noOfPawnInElevator: 0, capacity};
    updateMoveTimeout();

  })
  const pauseButtonOn = document.getElementById('pause-button');
  pauseButtonOn.addEventListener("click", () => {
    if (moveTimeout === 60000){
      moveTimeout = 100;
    } else {
      moveTimeout = 60000;
    }
    updateMoveTimeout();
  });
}

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  timerId = setInterval(gameFlow, moveTimeout);
});



