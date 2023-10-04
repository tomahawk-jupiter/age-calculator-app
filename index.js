console.log("Script loaded!");

/*
I found this "dateDiff" function here: https://stackoverflow.com/a/49201872
I just changed the output to an object instead of a string.
It takes in two dates and returns the difference between them in
years, months and days.
*/
function dateDiff(startingDate, endingDate) {
  let startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
  if (!endingDate) {
    endingDate = new Date().toISOString().substr(0, 10); // need date in YYYY-MM-DD format
  }
  let endDate = new Date(endingDate);
  if (startDate > endDate) {
    const swap = startDate;
    startDate = endDate;
    endDate = swap;
  }
  const startYear = startDate.getFullYear();
  const february =
    (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
      ? 29
      : 28;
  const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let yearDiff = endDate.getFullYear() - startYear;
  let monthDiff = endDate.getMonth() - startDate.getMonth();
  if (monthDiff < 0) {
    yearDiff--;
    monthDiff += 12;
  }
  let dayDiff = endDate.getDate() - startDate.getDate();
  if (dayDiff < 0) {
    if (monthDiff > 0) {
      monthDiff--;
    } else {
      yearDiff--;
      monthDiff = 11;
    }
    dayDiff += daysInMonth[startDate.getMonth()];
  }

  return { yearDiff, monthDiff, dayDiff };
}

const yearsOut = document.getElementById("years-out");
const monthsOut = document.getElementById("months-out");
const daysOut = document.getElementById("days-out");

const daysErrorElement = document.getElementById("day-in-error-message");
const monthsErrorElement = document.getElementById("month-in-error-message");
const yearsErrorElement = document.getElementById("year-in-error-message");

const dayFormField = document.getElementById("day-form-field");
const monthFormField = document.getElementById("month-form-field");
const yearFormField = document.getElementById("year-form-field");

const form = document.getElementById("date-of-birth-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let noErrors = true;

  // clear error style and message
  dayFormField.classList.remove("error");
  monthFormField.classList.remove("error");
  yearFormField.classList.remove("error");
  daysErrorElement.innerText = "";
  monthsErrorElement.innerText = "";
  yearsErrorElement.innerText = "";

  let day = document.getElementById("day-in").value;
  let month = document.getElementById("month-in").value;
  let year = document.getElementById("year-in").value;

  if (day < 1 || day > 31) {
    daysErrorElement.innerText = "Must be a valid day";
    dayFormField.classList.add("error");
    noErrors = false;
  }

  if (month < 1 || month > 12) {
    monthsErrorElement.innerText = "Must be a valid month";
    monthFormField.classList.add("error");
    noErrors = false;
  }

  // handle empty inputs
  if (year.length < 1) {
    yearsErrorElement.innerText = "This field is required";
    yearFormField.classList.add("error");
    noErrors = false;
  }
  if (month.length < 1) {
    monthsErrorElement.innerText = "This field is required";
    monthFormField.classList.add("error");
    noErrors = false;
  }
  if (day.length < 1) {
    daysErrorElement.innerText = "This field is required";
    dayFormField.classList.add("error");
    noErrors = false;
  }

  if (Date.parse(`${year}-${month}-${day}`) > Date.now()) {
    yearsErrorElement.innerText = "Must be in the past";
    yearFormField.classList.add("error");
    noErrors = false;
  }

  if (!Date.parse(`${year}-${month}-${day}`)) {
    daysErrorElement.innerText = "Must be a valid date";
    dayFormField.classList.add("error");
    noErrors = false;
  }

  if (noErrors) {
    const answer = dateDiff(Date.now(), Date.parse(`${year}-${month}-${day}`));

    // display output without animation:
    // yearsOut.textContent = answer.yearDiff;
    // monthsOut.textContent = answer.monthDiff;
    // daysOut.textContent = answer.dayDiff;

    // display output with animation:
    countAnimation(answer.yearDiff, yearsOut, 100);
    countAnimation(answer.monthDiff, monthsOut, 300);
    countAnimation(answer.dayDiff, daysOut, 200);
  }
  return;
});

function countAnimation(count, element, speed) {
  function updateDisplay(i) {
    element.textContent = i;
  }

  function incrementCount(i) {
    updateDisplay(i);
    if (i < count)
      setTimeout(function () {
        incrementCount(i + 1);
      }, speed);
  }
  incrementCount(0);
}
