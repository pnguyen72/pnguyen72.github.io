function generateModuleSelection() {
  modulesSelectBoxes = [];

  let indexOffset;
  let modulesData;
  if (midtermChoice.checked) {
    indexOffset = 1;
    modulesData = modulesName.midterm;
  } else {
    indexOffset = 1 + modulesName.midterm.length;
    modulesData = modulesName.final;
  }

  const modulesList = document.createElement("ul");
  modulesList.id = "modules-list";
  document.getElementById("modules-list").replaceWith(modulesList);

  modulesData.forEach((name, index) => {
    const module = document.createElement("li");
    const moduleLabel = document.createElement("label");
    const moduleSelectBox = document.createElement("input");
    const moduleTitle = document.createElement("span");
    const moduleCoverage = document.createElement("span");
    const moduleCoverageValue = document.createElement("span");
    const moduleCoverageText = document.createElement("span");
    modulesSelectBoxes.push(moduleSelectBox);

    moduleTitle.innerHTML = `Module ${index + indexOffset}: ${name}`;
    moduleCoverage.className = "coverage";
    moduleCoverage.style.display = "none";
    moduleCoverageValue.className = "coverage-value";
    moduleCoverageText.className = "coverage-text";
    moduleCoverageText.innerHTML = ` coverage <span class="tada">🎉</span>`;

    moduleSelectBox.id = `${String(index + indexOffset).padStart(2, "0")}`;
    moduleSelectBox.type = "checkbox";
    moduleSelectBox.addEventListener(
      "input",
      () => (document.getElementById("module-all").checked = false)
    );

    moduleLabel.appendChild(moduleSelectBox);
    moduleLabel.appendChild(moduleTitle);
    moduleCoverage.appendChild(moduleCoverageValue);
    moduleCoverage.appendChild(moduleCoverageText);
    module.appendChild(moduleLabel);
    module.appendChild(moduleCoverage);
    modulesList.appendChild(module);
  });

  if (modulesData.length < 2) {
    modulesSelectBoxes[0].checked = true;
  } else {
    const module = document.createElement("li");
    const moduleLabel = document.createElement("label");
    const moduleSelectBox = document.createElement("input");
    const moduleTitle = document.createElement("span");
    const moduleCoverage = document.createElement("span");
    const moduleCoverageValue = document.createElement("span");
    const moduleCoverageText = document.createElement("span");

    moduleTitle.innerText = "All of them!";
    moduleTitle.style.fontWeight = "bold";
    moduleCoverage.className = "coverage";
    moduleCoverage.style.display = "none";
    moduleCoverageValue.className = "coverage-value";
    moduleCoverageText.className = "coverage-text";
    moduleCoverageText.innerHTML = ` coverage <span class="tada">🎉</span>`;
    moduleSelectBox.type = "checkbox";
    moduleSelectBox.id = "module-all";
    moduleSelectBox.addEventListener("click", () =>
      modulesSelectBoxes.forEach(
        (box) => (box.checked = moduleSelectBox.checked)
      )
    );

    moduleLabel.appendChild(moduleSelectBox);
    moduleLabel.appendChild(moduleTitle);
    moduleCoverage.appendChild(moduleCoverageValue);
    moduleCoverage.appendChild(moduleCoverageText);
    module.appendChild(moduleLabel);
    module.appendChild(moduleCoverage);
    modulesList.appendChild(module);
  }

  generateCoverage();
}

function generateQuiz(quizData) {
  const quiz = document.createElement("div");
  quiz.id = "quiz";
  quiz.setAttribute("submitted", false);
  quizData.forEach(([id, data], index) =>
    quiz.appendChild(generateQuestion(id, data, index))
  );
  return setupQuiz(quiz);
}

function generateQuestion(questionId, questionData, questionIndex) {
  const questionText = questionData.question;
  const hasImage = questionData.hasImage;
  const isMultiSelect = questionData.multiSelect;
  const choicesData = Object.entries(questionData.choices);
  arrange(choicesData);

  const tags = [];
  const [bank, module, _] = questionId.split(".");
  if (modulesData[bank][module].isKnown(questionId)) {
    tags.push(`<span class="known-tag">already learned</span>`);
  }
  if (bank == "AI") {
    tags.push(`<span class="AI-tag">AI-generated</span>`);
  }

  const question = document.createElement("div");
  question.id = questionId;
  question.className = "question";

  // header
  const questionHeader = document.createElement("div");
  const questionTitleContainter = document.createElement("span");
  const questionTitle = document.createElement("b");
  const questionTags = document.createElement("span");
  const unsureLabel = document.createElement("label");
  const unsureCheck = document.createElement("input");
  const imNotSure = document.createElement("span");
  const showExplanation = document.createElement("span");

  questionHeader.className = "question-header";
  questionTitle.className = "question-title";
  questionTitle.innerText = `Question ${questionIndex + 1}.`;
  questionTags.className = "question-tags";
  questionTags.innerHTML = tags.join(`<span class="tags-delimiter"> | </span>`);
  unsureLabel.className = "unsure-label";
  unsureCheck.className = "unsure-check";
  imNotSure.className = "im-not-sure";
  imNotSure.innerText = "I'm not sure";
  showExplanation.className = "show-explanation";
  showExplanation.innerText = "Show explanation";
  unsureCheck.type = "checkbox";

  unsureLabel.appendChild(unsureCheck);
  unsureLabel.appendChild(imNotSure);
  unsureLabel.appendChild(showExplanation);
  questionTitleContainter.appendChild(questionTitle);
  questionTitleContainter.appendChild(questionTags);
  questionHeader.appendChild(questionTitleContainter);
  questionHeader.appendChild(unsureLabel);
  question.appendChild(questionHeader);

  // body
  const questionBody = document.createElement("p");
  questionBody.className = "question-body";
  questionBody.innerHTML = questionText;
  question.appendChild(questionBody);

  // figure
  if (hasImage) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.setAttribute("src", `./data/images/${questionId}.png`);
    figure.appendChild(image);
    question.appendChild(figure);
  }

  // choices
  const questionChoices = document.createElement("ul");
  questionChoices.className = "question-choices";
  choicesData.forEach((choiceData) => {
    const [text, isCorrect] = choiceData;

    const choice = document.createElement("li");
    const choiceLabel = document.createElement("label");
    const choiceInput = document.createElement("input");
    const choiceText = document.createElement("span");

    choice.className = isCorrect ? "correct" : "incorrect";
    choiceInput.className = "choice-input";
    choiceInput.type = isMultiSelect ? "checkbox" : "radio";
    choiceInput.name = `Q${questionIndex + 1}`;
    choiceText.innerHTML = text;

    choiceLabel.appendChild(choiceInput);
    choiceLabel.appendChild(choiceText);
    choice.appendChild(choiceLabel);
    questionChoices.appendChild(choice);
  });
  question.appendChild(questionChoices);

  // explanation
  const explanationContainer = document.createElement("div");
  const explanation = document.createElement("div");
  const editBtn = document.createElement("i");
  const editingIndicator = document.createElement("i");

  explanationContainer.className = "explanation-container";
  explanation.className = "explanation empty";
  editBtn.className = "bx bx-edit";
  editBtn.title = "edit";
  editingIndicator.className = "bx bx-loader bx-spin";
  editingIndicator.title = "someone is typing";

  explanationContainer.appendChild(explanation);
  explanationContainer.appendChild(editBtn);
  explanationContainer.appendChild(editingIndicator);
  question.appendChild(explanationContainer);

  return question;
}

function setupQuiz(quiz) {
  quiz.setAttribute("explain", explainChoice.checked);
  for (const question of quiz.getElementsByClassName("question")) {
    question.addEventListener(
      "animationend",
      () => (question.style.animation = "")
    );
    question.scrollTo = () => {
      question.scrollIntoView(true);
      scrollBy(0, -0.55 * navbar.offsetHeight);
      if (resultPanel.style.display != "none") {
        scrollBy(0, -navbar.offsetHeight);
      }
      return question;
    };
    question.blink = () => (question.style.animation = "blink 1s");

    const unsureCheck = question.querySelector(".unsure-check");
    unsureCheck.addEventListener("input", () => toggleUnsure(question));

    const explanation = question.querySelector(".explanation");
    explanation.write = (value) => {
      if (value) {
        explanation.classList.remove("empty");
        explanation.innerHTML = value;
      } else {
        explanation.classList.add("empty");
        explanation.innerHTML = placeholderExplanation;
      }
    };
    const editBtn = question.querySelector(".bx-edit");
    if (matchMedia("not all and (hover: none)").matches) {
      editBtn.classList.add("bx-tada-hover");
    }
    editBtn.addEventListener("click", () => editExplanation(explanation));
  }
  return quiz;
}

function generateAttemptsTable() {
  const table = document.createElement("table");
  const header = document.createElement("tr");
  const attemptNum = document.createElement("th");
  const banks = document.createElement("th");
  const modules = document.createElement("th");
  const result = document.createElement("th");

  attemptNum.className = "attempt";
  attemptNum.innerText = "Attempt";

  banks.className = "banks";
  banks.innerText = "Question banks";

  modules.className = "modules";
  modules.innerText = "Modules";

  result.className = "result";
  result.innerText = "Result";

  header.className = "header";
  header.appendChild(attemptNum);
  header.appendChild(banks);
  header.appendChild(modules);
  header.appendChild(result);

  table.id = "attempts-table";
  table.appendChild(header);

  pastAttempts.forEach((attempt, index) => {
    const score = attempt.score;
    const outOf = attempt.outOf;
    const accuracy = score / (outOf + Number.EPSILON);
    const roundedAccuracy = Math.round((accuracy + Number.EPSILON) * 100);
    const [H, S, L] = getColor(accuracy);

    const row = document.createElement("tr");
    const attemptNum = document.createElement("td");
    const banks = document.createElement("td");
    const modules = document.createElement("td");
    const result = document.createElement("td");

    attemptNum.className = "attempt";
    attemptNum.innerText = index + 1;
    attemptNum.addEventListener("click", () => {
      toQuizPage();
      document
        .getElementById("quiz")
        .replaceWith(setupQuiz(attempt.quiz.cloneNode(true)));
      showResult(score, outOf);
      navText.innerText = `Attempt ${index + 1}`;
      for (question of quizPage.querySelectorAll(".wrong-answer,.unsure")) {
        explain(question);
      }
    });

    banks.className = "banks";
    banks.innerText = attempt.banks;

    modules.className = "modules";
    modules.innerText = attempt.modules;

    result.className = "result";
    result.innerText = `${score}/${outOf} (${roundedAccuracy}%)`;
    result.style.backgroundColor = `hsla(${H}, ${S}%, ${L}%, ${0.75})`;

    row.className = "row";
    row.appendChild(attemptNum);
    row.appendChild(banks);
    row.appendChild(modules);
    row.appendChild(result);
    table.appendChild(row);
  });

  return table;
}

function generateCoverage() {
  const modules = homePage.querySelector("#modules-list");
  if (!modules.querySelector("li")) return; // if module list hasn't been generated

  let coveredTotal = 0;
  let sizeTotal = 0;

  for (const module of modules.querySelectorAll("li:not(:last-child)")) {
    const moduleNum = module.querySelector("input").id;
    const moduleCoverage = module.querySelector(".coverage");
    const moduleCoverageValue = moduleCoverage.querySelector(".coverage-value");
    const moduleCoverageTada = moduleCoverage.querySelector(".tada");

    let covered = 0;
    let size = 0;
    if (LHChoice.checked) {
      const questions = modulesData.LH[moduleNum];
      covered += questions.covered.size;
      size += questions.size;
    }
    if (AIChoice.checked) {
      const questions = modulesData.AI[moduleNum];
      covered += questions.covered.size;
      size += questions.size;
    }
    coveredTotal += covered;
    sizeTotal += size;

    if (size == 0) {
      hide(moduleCoverage);
      continue;
    }
    if (covered == 0 && moduleCoverage.style.display == "none") {
      continue;
    }
    const coverage = covered / (size + Number.EPSILON);
    const roundedCoverage = Math.round((coverage + Number.EPSILON) * 100);
    const [H, S, L] = getColor(coverage);
    moduleCoverage.style.backgroundColor = `hsla(${H}, ${S}%, ${L}%, ${0.75})`;
    moduleCoverageValue.innerText = `${roundedCoverage}%`;
    if (roundedCoverage < 100) {
      console.log(roundedCoverage);
      hide(moduleCoverageTada);
    } else {
      unhide(moduleCoverageTada);
    }
    unhide(moduleCoverage);
  }

  if (modules.querySelector("li:not(:last-child) .coverage:not([visible])")) {
    return;
  }

  const module = modules.querySelector("li:last-child");
  const moduleCoverage = module.querySelector(".coverage");
  const moduleCoverageValue = moduleCoverage.querySelector(".coverage-value");
  const moduleCoverageTada = moduleCoverage.querySelector(".tada");

  const coverage = coveredTotal / (sizeTotal + Number.EPSILON);
  const roundedCoverage = Math.round((coverage + Number.EPSILON) * 100);
  const [H, S, L] = getColor(coverage);
  moduleCoverage.style.backgroundColor = `hsla(${H}, ${S}%, ${L}%, ${0.75})`;
  moduleCoverageValue.innerText = `${roundedCoverage}%`;
  if (roundedCoverage < 100) {
    hide(moduleCoverageTada);
  } else {
    unhide(moduleCoverageTada);
  }
  unhide(moduleCoverage);
}
