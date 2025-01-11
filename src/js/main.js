let numFloors = 3;
let numLifts = 2;
let widthMain = 0;
let lifts = [];

const generateBtn = document.getElementById("generate-btn");
const building = document.getElementById("building");

generateBtn.onclick = () => {
  numFloors = document.getElementById("floors-input").value;
  numLifts = document.getElementById("lifts-input").value;
  let regex = /^\d+$/;

  if (!regex.test(numFloors) || !regex.test(numLifts)) {
    alert("Make sure you enter valid numbers > 0");
    return;
  }

  generateFloorsAndLifts(numFloors, numLifts);
};

function getLiftRequestServeTime(liftIndex) {
  ans = new Date(lifts[liftIndex].curRequestEndTime);
  for (let i = 0; i < lifts[liftIndex].requestQ.length; i++) {
    ans.setSeconds(
      ans.getSeconds() +
        2 * Math.abs(lifts[liftIndex].floor - lifts[liftIndex].requestQ[i]) +
        4
    );
  }

  return ans;
}

function animateLift(liftIndex, floor) {
  const prevFloor = lifts[liftIndex].floor;
  const lift = document.getElementById(`lift-${liftIndex}`);
  const doorLeft = lift.querySelector(".door-left");
  const doorRight = lift.querySelector(".door-right");
  lift.style.bottom = floor * 100 + "px";
  curTime = new Date(Date.now());
  lifts[liftIndex].curRequestEndTime = curTime.setSeconds(
    curTime.getSeconds() + 2 * Math.abs(prevFloor - floor) + 4
  );
  lifts[liftIndex].floor = floor;
  lift
    .animate(
      [{ bottom: prevFloor * 100 + "px" }, { bottom: floor * 100 + "px" }],
      {
        easing: "ease-in-out",
        duration: 2000 * Math.abs(prevFloor - floor),
        iterations: 1,
      }
    )
    .finished.then(() =>
      Promise.all([
        doorLeft.animate(
          [
            { transform: "translateX(0%)" },
            { transform: "translateX(-100%)" },
            { transform: "translateX(-100%)" },
            { transform: "translateX(-100%)" },
            { transform: "translateX(-100%)" },
            { transform: "translateX(0%)" },
          ],
          {
            easing: "ease-in-out",
            duration: 4000,
          }
        ).finished,
        doorRight.animate(
          [
            { transform: "translateX(0%)" },
            { transform: "translateX(100%)" },
            { transform: "translateX(100%)" },
            { transform: "translateX(100%)" },
            { transform: "translateX(100%)" },
            { transform: "translateX(0%)" },
          ],
          {
            easing: "ease-in-out",
            duration: 4000,
          }
        ).finished,
      ])
    )
    .then(() => {
      lift.parentElement.removeChild(lift);
      const newFloor = document.getElementById(`floor-${floor}-main`);
      newFloor.appendChild(lift);

      if (lifts[liftIndex].requestQ.length > 0) {
        executeLiftRequest(liftIndex);
      } else {
        lifts[liftIndex].inUse = false;
      }
    })
    .catch(() => {});
}

function executeLiftRequest(liftIndex) {
  let floor = lifts[liftIndex].requestQ.shift();
  animateLift(liftIndex, floor);
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
  let minDist = Infinity;
  let minDistLiftIdx = -1;
  for (let i = 0; i < numLifts; i++) {
    // find free lift
    if (lifts[i].inUse === false) {
      let dist = Math.abs(lifts[i].floor - floor);
      if (dist < minDist) {
        minDist = dist;
        minDistLiftIdx = i;
      }
    }
  }

  if (minDistLiftIdx === -1) {
    curMin = getLiftRequestServeTime(0);
    minDistLiftIdx = 0;
    for (let i = 1; i < numLifts; i++) {
      if (curMin > getLiftRequestServeTime(i)) {
        curMin = lifts[i].curRequestEndTime;
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
  };
  const downBtn = document.createElement("button");
  downBtn.classList.add("down-btn");
  downBtn.innerText = "Down";
  downBtn.onclick = () => {
    handleLiftEvent("down", i);
  };

  if (i != numFloors - 1) floorBtnContainer.appendChild(upBtn);
  if (i != 0) floorBtnContainer.appendChild(downBtn);

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

const generateFloorsAndLifts = (numFloors, numLifts) => {
  // store lift current state
  let id = 0;
  lifts = Array.from({ length: numLifts }, () => {
    return {
      id: id++,
      inUse: false,
      floor: 0,
      direction: "",
      requestQ: [],
      curRequestEndTime: 0,
    };
  });

  // remove previous animations.
  const anims = document.getAnimations({
    subtree: true,
  });
  anims.forEach((anim) => anim.cancel());

  // generate buttons, floor arena and labels
  building.innerHTML = "";
  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btn-wrapper");
  const floorContainer = document.createElement("div");
  floorContainer.classList.add("floor-wrapper");
  const floorLabelContainer = document.createElement("div");
  floorLabelContainer.classList.add("floor-label-wrapper");
  for (let i = numFloors - 1; i >= 0; i--) {
    btnContainer.appendChild(createFloorButtons(i));
    floorContainer.appendChild(createFloorMain(i));
    floorLabelContainer.appendChild(createFloorLabel(i));
  }
  building.appendChild(btnContainer);
  building.appendChild(floorContainer);
  building.appendChild(floorLabelContainer);

  // add lifts to floor 0.
  const floor0Main = document.getElementById(`floor-0-main`);
  lifts.map((lifDetails, i) => {
    const lift = document.createElement("div");
    lift.classList.add("lift");
    lift.id = `lift-${lifDetails.id}`;
    lift.style.left = i * 100 + "px";
    widthMain = i * 100 + 50 + "px";

    // give lift number.
    const liftBeforeText = document.createElement("div");
    liftBeforeText.innerText = i + 1;
    liftBeforeText.classList.add("lift-text");
    lift.appendChild(liftBeforeText);

    // lift doors
    const doorContainer = document.createElement("div");
    doorContainer.classList.add("door-container");
    const doorleft = document.createElement("div");
    const doorRight = document.createElement("div");
    doorleft.classList.add("door-left");
    doorRight.classList.add("door-right");
    // doorleft.id = `door-left-${lifDetails.id}`;
    // doorRight.id = `door-right-${lifDetails.id}`;
    doorContainer.appendChild(doorleft);
    doorContainer.appendChild(doorRight);

    lift.appendChild(doorContainer);

    floor0Main.appendChild(lift);
  });

  // change width of floors manually.
  for (let i = 0; i < numFloors; i++) {
    const floorMain = document.getElementById(`floor-${i}-main`);
    floorMain.style.minWidth = widthMain;
    floorMain.style.height = 100 + "px";
  }
};
