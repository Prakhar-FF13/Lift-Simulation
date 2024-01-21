let numFloors = 3;
let numLifts = 3;
let lifts = []

const generateBtn = document.getElementById("generate-btn");
const building = document.getElementById("building");

generateBtn.onclick = () => {
  numFloors = document.getElementById("floors-input").value || 3;
  numLifts = document.getElementById("lifts-input").value || 3;
  generateFloorsAndLifts(numFloors, numLifts);
}

function createFloorButtons(i) {
  // floor button container
  floorBtnContainer = document.createElement("div");
  floorBtnContainer.classList.add("floor-btn-container");

  // floor buttons
  const upBtn = document.createElement("button");
  upBtn.classList.add("up-btn");
  upBtn.innerText = "Up";
  const downBtn = document.createElement("button");
  downBtn.classList.add("down-btn");
  downBtn.innerText = "Down";

  if (i != numFloors - 1)
    floorBtnContainer.appendChild(upBtn);
  if (i != 0)
    floorBtnContainer.appendChild(downBtn);

  return floorBtnContainer;
}

function createFloorMain(i) {
  const floorMain = document.createElement("div");
  floorMain.classList.add("floor-main");
  floorMain.id = `floor-${i}-main`;
  return floorMain;
}

function createFloorLabel(i) {
  const floorLabelCont = document.createElement("div");
  floorLabelCont.classList.add("floor-label-cont");
  const floorLabel = document.createElement("div");
  floorLabel.classList.add("floor-label");
  floorLabel.innerText = `Floor ${i + 1}`;
  floorLabelCont.appendChild(floorLabel);
  return floorLabelCont;
}

function createFloor(i) {
  // floor container
  const floor = document.createElement("div");
  floor.classList.add("floor");
  floor.id = `floor-${i}`

  // add floor buttons
  floor.appendChild(createFloorButtons(i, numFloors));

  // floor main
  floor.appendChild(createFloorMain(i));

  // floor label
  floor.appendChild(createFloorLabel(i));

  // add floor to building
  building.appendChild(floor);
}

const generateFloorsAndLifts = (numFloors, numLifts) => {
  // store lift current state
  lifts = Array.from({ length: numLifts }, () => {
    floor: 0;
    isUse: true;
    requestQ = [];
  });

  // generate floors
  building.innerHTML = ''
  for (let i = numFloors - 1; i >= 0; i--) {
    createFloor(i);
  }

  const floor0Main = document.getElementById(`floor-0-main`);

  // add lifts to floor 0.
  lifts.map(() => {
    const lift = document.createElement("div");
    lift.classList.add("lift");
    floor0Main.appendChild(lift);
  })
}