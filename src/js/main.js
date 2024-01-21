let numFloors = 3;
let numLifts = 2;
let widthMain = 0;
let lifts = []

const generateBtn = document.getElementById("generate-btn");
const building = document.getElementById("building");

generateBtn.onclick = () => {
  numFloors = document.getElementById("floors-input").value || 3;
  numLifts = document.getElementById("lifts-input").value || 2;
  generateFloorsAndLifts(numFloors, numLifts);
}

function executeLiftRequest(liftIndex) {
  let floor = lifts[liftIndex].requestQ.shift();
  lifts[liftIndex].floor = floor;
  const lift = document.getElementById(`lift-${liftIndex}`);
  lift.parentElement.removeChild(lift);
  const newFloor = document.getElementById(`floor-${floor}-main`);
  newFloor.appendChild(lift);
  lifts[liftIndex].inUse = false;
  if (lifts[liftIndex].requestQ.length > 0) {
    lifts[liftIndex].inUse = true;
    executeLiftRequest(liftIndex);
  }
}

function addLiftRequest(dir, liftIndex, floor) {
  lifts[liftIndex].requestQ.push(floor);
  if (lifts[liftIndex].inUse === false) {
    lifts[liftIndex].direction = dir;
    lifts[liftIndex].inUse = true;
    executeLiftRequest(liftIndex);
  }
}

function handleLiftEvent(dir, floor) {
  // find the closest lift going in same direction.
  // if no lift going in same direction, then find the closest lift going in opposite direction.
  let minDist = Infinity;
  let minDistLiftIdx = -1;
  // find same direction list.
  for (let i = 0; i < numLifts; i++) {
    if (lifts[i].direction == "") {
      minDistLiftIdx = i;
      break;
    }
    if (lifts[i].direction == dir) {
      let dist = Math.abs(lifts[i].floor - floor);
      if (dist < minDist) {
        minDist = dist;
        minDistLiftIdx = i;
      }
    }
  }

  if (minDistLiftIdx === -1) {
    // find list with lowest number of requests.
    let dist = Infinity;
    for (let i = 0; i < numLifts; i++) {
        if (dist > lifts[i].requestQ.length) {
          dist = lifts[i].requestQ.length;
          minDistLiftIdx = i;
        }
    }
  }

  // add the location to elevator queue
  addLiftRequest(dir, minDistLiftIdx, floor);
}

function createFloorButtons(i) {
  // floor button container
  floorBtnContainer = document.createElement("div");
  floorBtnContainer.classList.add("floor-btn-container");

  // floor buttons
  const upBtn = document.createElement("button");
  upBtn.classList.add("up-btn");
  upBtn.innerText = "Up";
  upBtn.onclick = () => {
    handleLiftEvent("up", i);
  }
  const downBtn = document.createElement("button");
  downBtn.classList.add("down-btn");
  downBtn.innerText = "Down";
  downBtn.onclick = () => {
    handleLiftEvent("down", i);
  }

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
  const floorMainWrapper = document.createElement("div")
  floorMainWrapper.classList.add("floor-main-wrapper")
  floorMainWrapper.appendChild(createFloorMain(i))
  floor.appendChild(floorMainWrapper);

  // floor label
  floor.appendChild(createFloorLabel(i));

  // add floor to building
  building.appendChild(floor);
}

const generateFloorsAndLifts = (numFloors, numLifts) => {
  // store lift current state
  let id = 0
  lifts = Array.from({ length: numLifts }, () =>  {
    return {
      id: id++,
      inUse: false,
      floor: 0,
      direction: "",
      requestQ: [],
    }
  });

  // generate floors
  building.innerHTML = ''
  for (let i = numFloors - 1; i >= 0; i--) {
    createFloor(i);
  }

  // add lifts to floor 0.
  const floor0Main = document.getElementById(`floor-0-main`);
  lifts.map((lifDetails, i) => {
    const lift = document.createElement("div");
    lift.classList.add("lift");
    lift.id = `lift-${lifDetails.id}`;
    lift.style.left = i * 100 + "px";
    widthMain = i * 100 + "px";
    floor0Main.appendChild(lift);
  });

  // change width of floors manually.
  for (let i = 0; i < numFloors; i++) {
    const floorMain = document.getElementById(`floor-${i}-main`);
    floorMain.style.minWidth = widthMain;
    floorMain.style.height = 100 + "px";
  }
}