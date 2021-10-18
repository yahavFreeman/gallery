function printMat(mat, selector) {
  var strHTML = "<table><tbody>";
  for (var i = 0; i < mat.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = "cell cell-" + i + "-" + j;
      strHTML +=
        '<td class="' +
        className +
        ' " onclick="cellClicked(this,event)" style="opacity: 1;"></td>';
    }
    strHTML += "</tr>";
  }
  strHTML += "</tbody></table>";
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}
function createMat(ROWS, COLS) {
  var mat = [];
  var v=0;
  for (var i = 0; i < ROWS; i++) {
    mat[i] = [];
    for (var j = 0; j < COLS; j++) {
      mat[i][j] = {
        isShown: false,
        isMine: false,
        isMarked: false,
        location: { i: i, j: j },
      };
    }
  }
  return mat;
}

function shuffle(items) {
  var randIdx, keep, i;
  for (i = items.length - 1; i > 0; i--) {
    randIdx = getRandomInt(0, items.length - 1);
    keep = items[i];
    items[i] = items[randIdx];
    items[randIdx] = keep;
  }
  return items;
}

function renderCell(location, value) {
  if(value===0 ||value===false){
    value=''
  }
  var elCell = document.querySelector(".cell-" + location.i + "-" + location.j);
  elCell.innerHTML = value;
  
  if (value === MINE) {
    elCell.innerHTML = value;
    elCell.classList.add("armed");
    if (gBoard[location.i][location.j].isShown) {
      elCell.classList.remove("armed");
    elCell.classList.remove("cell");
    }
  }

  elCell.addEventListener(
    "contextmenu",
    function (ev) {
      if (gLives === 0) {
        return true
      }
      ev.preventDefault();
      if (elCell.innerHTML !== FLAG &&!gBoard[location.i][location.j].isShown) {
        if (gBoard[location.i][location.j].isMine) {
          elCell.classList.remove("armed");
        }
        elCell.innerHTML = FLAG;
        gBoard[location.i][location.j].isMarked = true;
      } else {
        gBoard[location.i][location.j].isMarked = false;
        elCell.innerHTML = value;
        if (gBoard[location.i][location.j].isMine) {
          elCell.classList.add("armed");
        }
      }
      if (!gIsStart) {
        gTimeInterval = setInterval(function () {
          timer();
        }, 100);
        gIsStart = true;
      }

      checkGameWon(); 
      return false   
    },
    false
  )
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is exclusive
}

function getRandomColor() {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  return "rgb(" + r + "," + g + "," + b + ")";
}

function getEmptyCells(board) {
  var emptyCells = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (!board[i][j].isMine && !board[i][j].isShown) {
        emptyCells.push({ i: i, j: j });
      }
    }
  }
  return emptyCells;
}

function countNeighbors(mat, rowIdx, colIdx) {
  var count = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) {
      continue;
    }
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) {
        continue;
      }
      if (i === rowIdx && j === colIdx) continue;
      if (mat[i][j].isMine) count++;
    }
  }
  return count;
}


function timer() {
  var eltime = document.querySelector(".timer");

  milisec += 1;
  if (milisec === 10) {
    milisec = 0;
    sec += 1;
  }

  if (sec === 60) {
    sec = 0;
    min += 1;
  }
  if (sec < 10) {
    eltime.innerText = min + ":0" + sec + "." + milisec;
  } else eltime.innerText = min + ":" + sec + "." + milisec;
}

function markCell(location, howManyMines) {
  if (howManyMines > 4) {
    howManyMines = 4;
  }
  if(howManyMines===-1){
  var elCell = document.querySelector(".cell-" + location.i + "-" + location.j);
  elCell.classList.remove("armed")
  return
  }
  var elCell = document.querySelector(".cell-" + location.i + "-" + location.j);
  elCell.classList.add("mark" + howManyMines);
  elCell.classList.add("mark");
  
}


function removeCellMark(location,howManyMines){
if (howManyMines > 4) {
  howManyMines = 4;
}
if(howManyMines===-1){
  var elCell = document.querySelector(".cell-" + location.i + "-" + location.j);
  elCell.classList.add("armed")
  return
  }
var elCell = document.querySelector(".cell-" + location.i + "-" + location.j);
elCell.classList.remove("mark" + howManyMines);
elCell.classList.remove("mark");
}

//setting the life bar
function life() {
  var elLife = document.querySelector(".lives");
  if (gLives === 3) {
    elLife.innerText ="🖤 🖤 🖤";
  } else if (gLives === 2) {
    elLife.innerText = "🖤 🖤💥";
  } else if (gLives === 1) {
    elLife.innerText = "🖤 💥💥";
  } else {
    elLife.innerText = "💥💥💥";
  }
}

function hintsLeft() {
  var elHint = document.querySelector(".hint");
  if (gHint === 3) {
    elHint.innerText = "💡 💡 💡";
  } else if (gHint === 2) {
    elHint.innerText = "💡 💡❌";
  } else if (gHint === 1) {
    elHint.innerText = "💡❌❌";
  } else {
    elHint.innerText = "❌❌❌";
  }
}

//making the board less safe
function lessSafe(){
  clearInterval(gSafeInterval)
  var elSafe = document.querySelector(".howSafe");
  if (gSafeCount === 3) {
    elSafe.innerText = "3 Clicks Left";
  } else if (gSafeCount === 2) {
    elSafe.innerText = "2 Clicks Left";
  } else if (gSafeCount === 1) {
    elSafe.innerText = "1 Click Left";
  } else {
    elSafe.innerText = "0 Clicks Left";
  }
}
//localStorage record scores
function getScore(){
  if (localStorage.sec||localStorage.mili){
    var elRecord=document.querySelector(".highestScore"+4)
  elRecord.innerHTML="record time on Easy level: "+localStorage.min+":"+localStorage.sec+"."+localStorage.mili
}
if (localStorage.sec8||localStorage.mili8){
  var elRecord=document.querySelector(".highestScore"+8)
elRecord.innerHTML="record time on Hard level:  "+localStorage.min8+":"+localStorage.sec8+"."+localStorage.mili8
}
if (localStorage.sec12||localStorage.mili12){
  var elRecord=document.querySelector(".highestScore"+12)
elRecord.innerHTML="record time on Expert level: "+localStorage.min12+":"+localStorage.sec12+"."+localStorage.mili12
}
}

function score() {
  gScore += 1;
  var elScore = document.querySelector(".keepScore");
  elScore.innerText = gScore;
  checkGameWon()
}

//returning the smiley to original emoji
function changeSmiley() {
  gSmileyTime = setTimeout(function () {
    var elSmiley = document.querySelector(".smiley");
    elSmiley.innerText = "😃";
  }, 400);
}