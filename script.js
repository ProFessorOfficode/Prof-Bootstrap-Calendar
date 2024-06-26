let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const newEventModal = new bootstrap.Modal(
  document.getElementById("newEventModal")
);
const deleteEventModal = new bootstrap.Modal(
  document.getElementById("deleteEventModal")
);
const eventTitleInput = document.getElementById("eventTitleInput");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function openModal(date) {
  clicked = date;

  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    deleteEventModal.show();
  } else {
    newEventModal.show();
  }
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(dt.getMonth() + nav);
  }

  const year = dt.getFullYear();
  const month = dt.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const lastDayOfWeek = lastDayOfMonth.getDay();

  document.getElementById("monthDisplay").innerText = dt.toLocaleDateString(
    "en-us",
    { month: "long", year: "numeric" }
  );

  calendar.innerHTML = "";

  // Add padding days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");
    daySquare.classList.add("padding");
    calendar.appendChild(daySquare);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");
    daySquare.innerText = i;

    const dayString = `${month + 1}/${i}/${year}`;

    const eventForDay = events.find((e) => e.date === dayString);
    if (eventForDay) {
      const eventDiv = document.createElement("div");
      eventDiv.classList.add("event");
      eventDiv.innerText = eventForDay.title;
      daySquare.appendChild(eventDiv);
    }

    if (dt.getDate() === i && nav === 0) {
      daySquare.id = "currentDay";
    }

    daySquare.addEventListener("click", () => openModal(dayString));
    calendar.appendChild(daySquare);
  }

  // Add padding days after the last day of the month
  const paddingDays = 6 - lastDayOfWeek;
  for (let i = 0; i < paddingDays; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");
    daySquare.classList.add("padding");
    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  eventTitleInput.classList.remove("is-invalid");
  newEventModal.hide();
  deleteEventModal.hide();
  eventTitleInput.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("is-invalid");

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add("is-invalid");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
}

initButtons();
load();
