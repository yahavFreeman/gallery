"use strict";
const MINE = '<img src="img/red-mine.jpg" class = "hide">';
const FLAG = '<img src="img/Flag-red-icon.png">';
const SHOW_MINES = '<img src="img/mines.png" class = "hide">'

var gBoard = [];
var gIsStart = false;
var gTimeInterval;
var gSafeInterval;
var safe;
var milisec;
var sec;
var min;
var mines;
var gLives;
var gSmileyTime;
var gScore;
var gIsHint;
var gHint;
var isGame;
var canHint;
var empties = [];
var gSafeCount;
var isSafe = {};
var is7Boom = false;
var isManual = false;
var manualMines;
var gotTheMines;
var expandCounter;
var expandEnter;
var winSound= new Audio("sound/win.mp3")
var mineSound= new Audio("sound/mine.mp3")
var recursionSound=new Audio("sound/rec.mp3")
var gameOverSound=new Audio("sound/over.mp3")

// creating and setting the board
function initGame(row = 4, col = 4) {
  gScore = 0;
  clearInterval(gTimeInterval);
  gIsStart = false;
  gLives = gHint = gSafeCount = 3;
  isGame = true;
  safe = false;
  gotTheMines = false;
  changeSmiley();
  lessSafe();
  life();
  hintsLeft();
  getScore();
  milisec = 0;
  sec = 0;
  min = 0;
  buildBoard(row, col);
}

function buildBoard(row, col) {
  gBoard = createMat(row, col);
  printMat(gBoard, ".board");
}


//7BOOM feature starting function
function sevenBoom() {
  is7Boom = true;
  initGame();
  alert("select your level");
}
//manual minning feature starting function
function manual() {
  isManual = true;
  initGame();
  alert("select your level");
}

// placing the mines for the various game features
function placeMines(level) {
  switch (level) {
    case 4:
      mines = 2;
      break;
    case 8:
      mines = 12;
      break;
    case 12:
      mines = 30;
      break;
  }
  empties = getEmptyCells(gBoard);
  if (!is7Boom && !isManual && !gotTheMines) {
    empties = shuffle(empties);
    for (var count = 0; count < mines; count++) {
      renderCell(empties[count], MINE);
      gBoard[empties[count].i][empties[count].j].isMine = true;
    }
    for (var count = 0; count < mines; count++) {
      empties.splice(0, 1);
    }
  } else if (is7Boom) {
    var iCounter = 1;
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard.length; j++) {
        var count = i + j + iCounter;
        if (count % 7 === 0) {
          if (!gBoard[i][j].isShown) {
            renderCell(gBoard[i][j].location, MINE);
            gBoard[i][j].isMine = true;
          }
        }
      }

      if (gBoard.length === 4) {
        iCounter += 3;
      } else if (gBoard.length === 8) {
        iCounter += 7;
      } else if (gBoard.length === 12) {
        iCounter += 11;
      }
    }
    for (var count = 0; count < mines; count++) {
      empties.splice(0, 1);
    }
    if(is7Boom&&gBoard.length===8){
      mines=9
    }else if(is7Boom&&gBoard.length===12){
      mines=20
    }
    is7Boom = false;
  } else if (isManual) {
    gotTheMines = true;
    return mines;
  }
  countMinesAround();
}

//creating the game board with mines and neighboring cells with mines
function countMinesAround() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      gBoard[i][j].minesCount = countNeighbors(gBoard, i, j);
      if (gBoard[i][j].isMine) {
        gBoard[i][j].minesCount = -1;
      }
      if (!gBoard[i][j].isMine) {
        renderCell(gBoard[i][j].location, gBoard[i][j].minesCount);
      }
    }
  }
}

//manual mining feature
function manualyClick(cell) {
  var locationArr = cell.classList[1].split("-");
  var location = {
    i: Number(locationArr[1]),
    j: Number(locationArr[2]),
  };
  if (gBoard[location.i][location.j].isMine) return;
  renderCell(location, MINE);
  gBoard[location.i][location.j].isMine = true;
}

// checking the game events with correlation with the game features
function cellClicked(whichCell, leftOrRight) {
  if (!isManual) {
    if (safe && !gIsHint) {
      safe = false;
      gSafeCount--;
      lessSafe();
      var elSafeCell = document.querySelector(
        ".cell-" + isSafe.i + "-" + isSafe.j
      );
      elSafeCell.style.opacity = 1;
    }
    if (gLives === 0 || !isGame) return;
    var locationArr = whichCell.classList[1].split("-");
    var location = {
      i: Number(locationArr[1]),
      j: Number(locationArr[2]),
    };
    if (gIsHint && gIsStart) {
      showNeighbors(location.i, location.j, true);
      setTimeout(function () {
        showNeighbors(location.i, location.j, false);
      }, 1000);
      gIsHint = false;
      gHint--;
      hintsLeft();
      return;
    } else {
      gIsHint = false;
    }
    if (!gIsStart) {
      gBoard[location.i][location.j].isShown = true;
      placeMines(gBoard.length);
      markCell(location, gBoard[location.i][location.j].minesCount);
      gTimeInterval = setInterval(function () {
        timer();
      }, 100);
      gIsStart = true;
      canHint = true;
      if (gBoard[location.i][location.j].minesCount !== 0) {
        score();
      } else if (gBoard[location.i][location.j].minesCount === 0) {
        expandCounter = 0;
        expandEnter = true;
        expand(location.i, location.j);
      }
    }
    if (
      !gBoard[location.i][location.j].isShown &&
      leftOrRight.button === 0 &&
      !gBoard[location.i][location.j].isMarked &&
      gBoard[location.i][location.j].minesCount !== 0
    ) {
      gBoard[location.i][location.j].isShown = true;
      markCell(location, gBoard[location.i][location.j].minesCount);
      checkMine(location);
    } else if (!gIsHint&&
      !gBoard[location.i][location.j].isShown &&
      leftOrRight.button === 0 &&
      !gBoard[location.i][location.j].isMarked &&
      !gBoard[location.i][location.j].isMine &&
      gBoard[location.i][location.j].minesCount === 0
    ) {
      expandCounter = 0;
      expand(location.i, location.j);
    }
  } else {
    if (!gotTheMines) {
      manualMines = placeMines(gBoard.length);
      gotTheMines = true;
    }
    var locationArr = whichCell.classList[1].split("-");

    var location = {
      i: Number(locationArr[1]),
      j: Number(locationArr[2]),
    };
    if(gBoard[location.i][location.j].isMine){
      return
    }
    manualMines -= 1;
    renderCell(location, MINE);
    gBoard[location.i][location.j].isMine = true;
    if (manualMines === 0) {
      isManual = false;
    }
  }
}

// bonus hint task starting function
function hint() {
  if (gHint &&isGame) {
    gIsHint = true;
  }
}
//creating the expand recursion feature
function expand(rowIdx, colIdx) {
  var loc = [];
  if(gIsHint){
    return
  }
  if (expandEnter) {
    score();
    expandEnter = false;
  }
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) {
      continue;
    }
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > gBoard.length - 1) {
        continue;
      }
      if(gBoard[i][j].isMarked){
        continue
      }
      loc[expandCounter] = {
        i: i,
        j: j,
      };
      if (
        gBoard[loc[expandCounter].i][loc[expandCounter].j].minesCount === 0 &&
        !gBoard[i][j].isShown &&
        !gBoard[i][j].isMine
      ) {
        score();
        gBoard[i][j].isShown = true;
        expandCounter++;
        expand(i, j);
      } else {
        if (
          gBoard[loc[expandCounter].i][loc[expandCounter].j].minesCount !== 0 &&
          !gBoard[i][j].isShown &&
          !gBoard[i][j].isMine &&
          !gBoard[i][j].isShown
        ) {
          score();
        }
        gBoard[i][j].isShown = true;
        markCell(loc[expandCounter], gBoard[i][j].minesCount);
      }
    }
  }
  recursionSound.play()
}

//showing neighboring cells for the hint feature
function showNeighbors(rowIdx, colIdx, isShow) {
  var loc = {};
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) {
      continue;
    }
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > gBoard.length - 1) {
        continue;
      }
      loc = {
        i: i,
        j: j,
      };
      if (isShow && !gBoard[i][j].isMarked) {
        markCell(loc, gBoard[i][j].minesCount);
      } else if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
        removeCellMark(loc, gBoard[i][j].minesCount);
      }
    }
  }
}

//checking if a mine was hit
function checkMine(location) {
  var elSmiley = document.querySelector(".smiley");
  if (gBoard[location.i][location.j].isMine === true) {
    mineSound.play()
    gLives--;
    renderCell(location, MINE);
    life();
    elSmiley.innerText = "🤕";
    changeSmiley();
    checkGameWon()
    if (gLives === 0) {
      clearTimeout(gSmileyTime);
      elSmiley.innerText = "😫";
      gameOver();
    }
  } else {
    score();
    elSmiley.innerText = "😮";
    changeSmiley();
  }
}

function gameOver() {
  gameOverSound.play()
  clearInterval(gTimeInterval);
  showMines()
  isGame = false;
}
function showMines(){
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isMine&& gBoard[i][j].isMarked){
        gBoard[i][j].isMarked=false
        var elCell = document.querySelector(".cell-" +gBoard[i][j].location.i + "-" +gBoard[i][j].location.j);
  elCell.innerHTML = SHOW_MINES;
      }
      if(gBoard[i][j].isMine&& !gBoard[i][j].isShown){
        var elCell = document.querySelector(".cell-" +gBoard[i][j].location.i + "-" +gBoard[i][j].location.j);
  elCell.innerHTML = SHOW_MINES;
        markCell(gBoard[i][j].location,gBoard[i][j].minesCount)
      }
    }
  }
}
//checking game status
function checkGameWon() {
  if (gScore === gBoard.length ** 2 - mines) {
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard.length; j++) {
        if (
          gBoard[i][j].isMine &&
          (gBoard[i][j].isMarked || gBoard[i][j].isShown)
        ) {
          continue;
        } else if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
          return;
        }
      }
    }
    winSound.play()
    clearInterval(gTimeInterval);
    checkRecord();
    isGame=false
    alert("YOU WON!!");
  } else {
    return;
  }
}

//making the game record times show
function checkRecord() {
  if (gBoard.length === 4) {
    if (localStorage.sec || localStorage.mili) {
      if (
        (localStorage.min >= min && localStorage.sec > sec) ||
        (Number(localStorage.sec) === sec && localStorage.mili > milisec)
      ) {
        localStorage.min = min;
        localStorage.sec = sec;
        localStorage.mili = milisec;
      }
    } else {
      localStorage.min = min;
      localStorage.sec = sec;
      localStorage.mili = milisec;
    }
  } else if (gBoard.length === 8) {
    if (localStorage.sec8 || localStorage.mili8) {
      if (
        (localStorage.min8 >= min && localStorage.sec8 > sec) ||
        (Number(localStorage.sec8) === sec && localStorage.mili8 > milisec)
      ) {
        localStorage.min8 = min;
        localStorage.sec8 = sec;
        localStorage.mili8 = milisec;
      }
    } else {
      localStorage.min8 = min;
      localStorage.sec8 = sec;
      localStorage.mili8 = milisec;
    }
  } else if (gBoard.length === 12) {
    if (localStorage.sec12 || localStorage.mili12) {
      if (
        (localStorage.min12 >= min && localStorage.sec12 > sec) ||
        (Number(localStorage.sec12) === sec && localStorage.mili12 > milisec)
      ) {
        localStorage.min12 = min;
        localStorage.sec12 = sec;
        localStorage.mili12 = milisec;
      }
    } else {
      localStorage.min12 = min;
      localStorage.sec12 = sec;
      localStorage.mili12 = milisec;
    }
  }
  var elRecord = document.querySelector(".highestScore" + gBoard.length);
  if (gBoard.length === 4) {
    elRecord.innerHTML =
      "record time on Easy level: " +
      localStorage.min +
      ":" +
      localStorage.sec +
      "." +
      localStorage.mili;
  } else if (gBoard.length === 8) {
    elRecord.innerHTML =
      "record time on Hard level: " +
      Number(localStorage.min8) +
      ":" +
      Number(localStorage.sec8) +
      "." +
      Number(localStorage.mili8);
  } else if (gBoard.length === 12) {
    elRecord.innerHTML =
      "record time on Expert level: " +
      Number(localStorage.min12) +
      ":" +
      Number(localStorage.sec12) +
      "." +
      Number(localStorage.mili12);
  }
}

//creating the fafe click feature
function safeClick() {
  if (gIsStart && isGame && !safe) {
    empties = getEmptyCells(gBoard);
    if (empties.length === 0) return;
    for (var i = 0; i < empties.length; i++) {
      if (!gBoard[empties[i].i][empties[i].j].isShown) {
        safe = true;
        break;
      }
    }
    isSafe = empties[i];
    gSafeInterval = setInterval(function () {
      var elCell = document.querySelector(
        ".cell-" + empties[i].i + "-" + empties[i].j
      );
      if (Number(elCell.style.opacity) === 0.5) {
        elCell.style.opacity = 1;
      } else {
        elCell.style.opacity = 0.5;
      }
    }, 700);
  }
}
