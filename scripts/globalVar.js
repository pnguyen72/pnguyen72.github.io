let disagreeNum = localStorage.getItem("disagree") ?? 0;
const disagreeTarget = 16; // how many times user must click "no" for to be granted the exception
let modulesSelectBoxes = [];
var quizTimer;
let modulesName;
let modulesData = {};
const pastAttempts = localStorage.getItem("attempts")
  ? JSON.parse(localStorage.getItem("attempts"))
  : [];
const knowledge = localStorage.getItem("knowledge")
  ? JSON.parse(localStorage.getItem("knowledge"))
  : {};
const unfinishedAttempts = localStorage.getItem("unfinished")
  ? JSON.parse(localStorage.getItem("unfinished"))
  : [];
const placeholderExplanation = `No explanation available.
<span id="placeholder-expansion">Why don't you add one?</span>`;
