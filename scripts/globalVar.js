let pastAttempts = [];
let disagreeNum = 0;
let modulesSelectBoxes = [];
var quizTimer;
const placeholderExplanation = `No explanation available. <span id="placeholder-expansion">Why don't you add one?</span>`;

const storedAttempts = localStorage.getItem("pastAttempts");
if (storedAttempts) {
  pastAttempts = JSON.parse(storedAttempts);
}

const storedDisagreeNum = localStorage.getItem("disagree");
if (storedDisagreeNum) {
  disagreeNum = parseInt(storedDisagreeNum);
}
