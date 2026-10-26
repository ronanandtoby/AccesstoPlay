// app.js
// ------------------------------------------------------------
// This file makes the page work. It does six jobs:
//   1. Reads what the family picked in the form (age, region, sport, needs, cost)
//   2. Checks every program against those choices
//   3. Draws a card on the page for each program that matches
//   4. Does the same thing for volunteer opportunities
//   5. Lets families save programs to "My list"
//   6. Lets people turn on larger text and high contrast
//
// The lists "programs" and "volunteerJobs" come from data.js,
// which the page loads before this file.
// ------------------------------------------------------------

// Friendly names for the accessibility needs, used on the cards.
const needLabels = {
  mobility: "Mobility / wheelchair",
  intellectual: "Intellectual or developmental",
  autism: "Autism / sensory",
  vision: "Blind or low vision",
  hearing: "Deaf or hard of hearing"
};

const costLabels = {
  free: "Free",
  low: "Low cost",
  paid: "Fees apply",
  ask: "Ask about cost"
};

// ---------- Step 1: read the form ----------

function getChoices() {
  const ageText = document.getElementById("age").value;

  // Collect every needs checkbox that is checked.
  const needs = [];
  const boxes = document.querySelectorAll("input[name='need']:checked");
  for (const box of boxes) {
    needs.push(box.value);
  }

  return {
    // An empty age box means "any age", which we store as null.
    age: ageText === "" ? null : Number(ageText),
    region: document.getElementById("region").value,
    sport: document.getElementById("sport").value,
    needs: needs,
    cost: document.getElementById("cost").value
  };
}

// ---------- Step 2: check one program ----------

// Returns true if the program fits what the family chose.
function programMatches(program, choices) {
  // Age: skip the check if the family left age blank,
  // or if the program didn't list that limit.
  if (choices.age !== null) {
    if (program.minAge !== null && choices.age < program.minAge) return false;
    if (program.maxAge !== null && choices.age > program.maxAge) return false;
  }

  // Region: "any" means show everywhere.
  if (choices.region !== "any" && !program.regions.includes(choices.region)) {
    return false;
  }

  // Sport type: "any" means show every kind of sport.
  if (choices.sport !== "any" && !program.types.includes(choices.sport)) {
    return false;
  }

  // Needs: the program must support EVERY need the family checked.
  for (const need of choices.needs) {
    if (!program.needs.includes(need)) return false;
  }

  // Cost
  if (choices.cost === "free" && program.cost !== "free") return false;
  if (choices.cost === "affordable") {
    // "Affordable" = free, low cost, or offers financial aid.
    // Programs that don't post prices ("ask") only count if they offer aid.
    const affordable = program.cost === "free" || program.cost === "low" || program.aid;
    if (!affordable) return false;
  }

  return true;
}

// ---------- Step 3: draw the cards ----------

function ageText(minAge, maxAge) {
  if (minAge === null && maxAge === null) return "Ask program about ages";
  if (maxAge === null) return "Ages " + minAge + "+";
  if (minAge === null) return "Up to age " + maxAge;
  return "Ages " + minAge + "–" + maxAge;
}

function makeProgramCard(program) {
  const card = document.createElement("article");
  card.className = "card";

  // Build a small tag for each need the program supports.
  let needTags = "";
  for (const need of program.needs) {
    needTags += '<li class="tag">' + needLabels[need] + "</li>";
  }

  const aidNote = program.aid ? '<span class="aid">Financial aid</span>' : "";

  // If our team confirmed the details, say so on the card.
  const verifiedNote = program.verified
    ? '<p class="verified">✓ Confirmed by our team: ' + program.verified + "</p>"
    : "";

  // The Save button remembers which program it belongs to
  // by storing the program's position in the list (its index).
  const index = programs.indexOf(program);
  const isSaved = savedNames.includes(program.name);

  card.innerHTML =
    '<div class="card-top">' +
      '<span class="cost cost-' + program.cost + '">' + costLabels[program.cost] + "</span>" +
      aidNote +
    "</div>" +
    "<h3>" + program.name + "</h3>" +
    '<p class="org">' + program.org + "</p>" +
    '<p class="facts">' + program.city + " · " + ageText(program.minAge, program.maxAge) + "</p>" +
    '<p class="sports">' + program.sports.join(", ") + "</p>" +
    "<p>" + program.about + "</p>" +
    // If we don't know which needs a program supports yet, say so.
    (needTags === ""
      ? '<p class="cost-note">Ask which accessibility needs they support.</p>'
      : '<ul class="tags" aria-label="Set up for">' + needTags + "</ul>") +
    '<p class="cost-note">' + program.costNote + "</p>" +
    verifiedNote +
    '<div class="card-actions">' +
      '<a class="visit" href="' + program.website + '" target="_blank" rel="noopener">Visit website</a>' +
      '<button type="button" class="save" data-index="' + index + '" aria-pressed="' + isSaved + '">' +
        (isSaved ? "Saved ✓" : "Save to my list") +
      "</button>" +
    "</div>";

  return card;
}

function showPrograms() {
  const choices = getChoices();
  const list = document.getElementById("results");
  list.innerHTML = ""; // clear old results

  let count = 0;
  for (const program of programs) {
    if (programMatches(program, choices)) {
      list.appendChild(makeProgramCard(program));
      count++;
    }
  }

  // Tell the family how many matched (screen readers announce this too).
  const summary = document.getElementById("result-count");
  if (count === 0) {
    summary.textContent = "No programs match every choice. Try unchecking a need or choosing \"Anywhere in Colorado\".";
  } else if (count === 1) {
    summary.textContent = "1 program matches.";
  } else {
    summary.textContent = count + " programs match.";
  }
}

// ---------- Step 4: volunteer opportunities ----------

function showVolunteerJobs() {
  const volAge = document.getElementById("vol-age").value;
  const age = volAge === "" ? null : Number(volAge);
  const region = document.getElementById("vol-region").value;
  const list = document.getElementById("vol-results");
  list.innerHTML = "";

  let count = 0;
  for (const job of volunteerJobs) {
    if (age !== null && job.minAge !== null && age < job.minAge) continue;
    if (region !== "any" && !job.regions.includes(region)) continue;

    const ageLine = job.minAge === null ? "Ask about minimum age" : "Ages " + job.minAge + "+";
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      "<h3>" + job.name + "</h3>" +
      '<p class="org">' + job.org + "</p>" +
      '<p class="facts">' + job.city + " · " + ageLine + "</p>" +
      "<p>" + job.what + "</p>" +
      '<a class="visit" href="' + job.website + '" target="_blank" rel="noopener">How to sign up</a>';
    list.appendChild(card);
    count++;
  }

  document.getElementById("vol-count").textContent =
    count === 0 ? "No matches yet. Try \"Anywhere in Colorado\"." :
    count === 1 ? "1 opportunity matches." :
    count + " opportunities match.";
}

// ---------- Step 5: "My list" (saved programs) ----------
// We save the NAMES of programs in the browser's localStorage,
// so the list is still there next time the family opens the app.
// localStorage only stores text, so we turn the list into text
// with JSON.stringify and back into a list with JSON.parse.
// Some browsers (like private windows) block storage, so every
// read and write is wrapped in try/catch. If storage is blocked,
// the list still works until the page is closed.

let savedNames = loadSaved();

function loadSaved() {
  try {
    const text = localStorage.getItem("accessToPlaySaved");
    return text ? JSON.parse(text) : [];
  } catch (error) {
    return [];
  }
}

function storeSaved() {
  try {
    localStorage.setItem("accessToPlaySaved", JSON.stringify(savedNames));
  } catch (error) {
    // Storage is blocked. Nothing to do; the list lasts until the page closes.
  }
}

// Add the program if it isn't saved yet, or remove it if it is.
function toggleSaved(name) {
  if (savedNames.includes(name)) {
    savedNames = savedNames.filter(function (n) { return n !== name; });
  } else {
    savedNames.push(name);
  }
  storeSaved();
}

function showSaved() {
  const list = document.getElementById("saved-results");
  list.innerHTML = "";

  for (const program of programs) {
    if (savedNames.includes(program.name)) {
      list.appendChild(makeProgramCard(program));
    }
  }

  const count = list.children.length;
  document.getElementById("saved-tab-count").textContent = count;
  document.getElementById("saved-count").textContent =
    count === 0 ? "Nothing saved yet. Tap \"Save to my list\" on any program to keep it here." :
    count === 1 ? "1 saved program." :
    count + " saved programs.";
}

// One click listener for every Save button on the page, even ones
// drawn later. "closest" finds the button if you click on its text.
document.addEventListener("click", function (event) {
  const button = event.target.closest(".save");
  if (!button) return;

  const program = programs[Number(button.dataset.index)];
  toggleSaved(program.name);

  // Update every Save button for this program (it can appear in two places).
  const isSaved = savedNames.includes(program.name);
  for (const b of document.querySelectorAll('.save[data-index="' + button.dataset.index + '"]')) {
    b.setAttribute("aria-pressed", isSaved);
    b.textContent = isSaved ? "Saved ✓" : "Save to my list";
  }
  showSaved();
});

// ---------- Step 6: larger text and high contrast ----------
// Each button turns a CSS class on or off on the <html> element.
// style.css does the rest. We remember the choice in localStorage too.

const display = loadDisplay();

function loadDisplay() {
  try {
    const text = localStorage.getItem("accessToPlayDisplay");
    return text ? JSON.parse(text) : { bigText: false, highContrast: false };
  } catch (error) {
    return { bigText: false, highContrast: false };
  }
}

function applyDisplay() {
  document.documentElement.classList.toggle("big-text", display.bigText);
  document.documentElement.classList.toggle("high-contrast", display.highContrast);
  document.getElementById("big-text-btn").setAttribute("aria-pressed", display.bigText);
  document.getElementById("contrast-btn").setAttribute("aria-pressed", display.highContrast);
  try {
    localStorage.setItem("accessToPlayDisplay", JSON.stringify(display));
  } catch (error) {}
}

document.getElementById("big-text-btn").addEventListener("click", function () {
  display.bigText = !display.bigText;
  applyDisplay();
});
document.getElementById("contrast-btn").addEventListener("click", function () {
  display.highContrast = !display.highContrast;
  applyDisplay();
});

// ---------- Tabs: switch between sections ----------

function openTab(name) {
  const tabs = document.querySelectorAll("[role='tab']");
  for (const tab of tabs) {
    const isThisOne = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", isThisOne ? "true" : "false");
    document.getElementById(tab.dataset.tab).hidden = !isThisOne;
  }
}

// ---------- Hook everything up when the page loads ----------

// Re-run the search any time the family changes a choice.
document.getElementById("search-form").addEventListener("input", showPrograms);
document.getElementById("vol-form").addEventListener("input", showVolunteerJobs);

// Pressing Enter in a form shouldn't reload the page.
document.getElementById("search-form").addEventListener("submit", function (e) { e.preventDefault(); });
document.getElementById("vol-form").addEventListener("submit", function (e) { e.preventDefault(); });

for (const tab of document.querySelectorAll("[role='tab']")) {
  tab.addEventListener("click", function () { openTab(tab.dataset.tab); });
}

// Count how many programs our team has confirmed, for the note at the bottom.
let confirmed = 0;
for (const program of programs) {
  if (program.verified) confirmed++;
}
document.getElementById("verified-count").textContent =
  confirmed + " of " + programs.length + " programs confirmed by our team so far.";

// Show results right away so the page isn't empty.
applyDisplay();
showPrograms();
showVolunteerJobs();
showSaved();
