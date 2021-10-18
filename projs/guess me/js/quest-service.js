var gQuestsTree;
var gCurrQuest;
var gPrevQuest = null;
const KEY = "tree";

function createQuestsTree() {
  gQuestsTree = loadFromStorage(KEY);
  if (!gQuestsTree || gQuestsTree.length === 0) {
    gQuestsTree = createQuest("Male?");
    gQuestsTree.yes = createQuest("Gandhi");
    gQuestsTree.no = createQuest("Rita");
  }
  gCurrQuest = gQuestsTree;
  gPrevQuest = null;
}

function createQuest(txt) {
  return {
    txt: txt,
    yes: null,
    no: null,
  };
}

function isChildless(node) {
  return node.yes === null && node.no === null;
}

function moveToNextQuest(res) {
  // update the gPrevQuest, gCurrQuest global vars
  gPrevQuest = gCurrQuest;
  gCurrQuest = gCurrQuest[res];
}

function addGuess(newQuestTxt, newGuessTxt, lastRes) {
  // Create and Connect the 2 Quests to the quetsions tree
  // getCurrQuest()
  var newQuest = createQuest(newQuestTxt);
  newQuest.yes = createQuest(newGuessTxt);
  newQuest.no = gCurrQuest;
  gPrevQuest[lastRes] = newQuest;
  gCurrQuest = gQuestsTree;
  saveToStorage(KEY, gQuestsTree);
}

function getCurrQuest() {
  return gCurrQuest;
}
