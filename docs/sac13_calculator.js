"use strict";

const date_inp = document.getElementById("date-input");

document
  .getElementById("arrowleft")
  .addEventListener("pointerdown", handle_left_arrow);

document
  .getElementById("arrowright")
  .addEventListener("pointerdown", handle_right_arrow);

document.getElementById("today-button").addEventListener("click", set_today);

let last_set = "";
let date_yesterday = "";
let date_tomorrow = "";

let last_sac13_header = 0;
let last_sac13_day = 0;
let last_greg_header = 0;
let last_greg_day_Id = 0;

date_inp.addEventListener("input", (event) => {
  const v = event.target.value;
  set_date(v);
});

async function set_today() {
  // Theoretically we could just set the input field to the Gregorian date
  // because the calculator could handle both calendars as input, but we
  // want to show the SAC13 date in the input field, so we have to run through
  // the parser to get the SAC13 date.

  const greg_iso = getLocalISODate();
  await waitForSac13module();
  const parsed = parse_date(greg_iso);
  const formatted = isoLikeSac13(
    parsed.sac13_year,
    parsed.sac13_month,
    parsed.sac13_day,
  );
  set_date_input_field(formatted);
}

function handle_left_arrow() {
  if (!date_yesterday) {
    return;
  }

  set_date_input_field(date_yesterday);
}

function handle_right_arrow() {
  if (!date_tomorrow) {
    return;
  }

  set_date_input_field(date_tomorrow);
}

function set_date_input_field(date) {
  set_input_and_date(date);
}

function create_table(
  prefix,
  column_headers,
  column_titles,
  row_count,
  data_function,
) {
  const table = document.createElement("table");
  table.id = `${prefix}-t`;
  table.classList.add("cal-tab");

  const table_head = table.createTHead();
  table_head.id = `${prefix}-thead`;

  const head_row = table_head.insertRow();
  head_row.id = `${prefix}-thr`;

  for (let i = 0; i < column_titles.length; i++) {
    const th_cell = document.createElement("th");
    th_cell.id = `${prefix}-th-${i}`;

    if (column_headers[i] === "") {
      th_cell.innerText = "";
    } else {
      th_cell.innerText = column_headers[i];
    }

    th_cell.title = column_titles[i];
    head_row.appendChild(th_cell);
  }

  const table_body = table.createTBody();
  table_body.id = `${prefix}-tb`;

  for (let i = 0; i < row_count; i++) {
    const row = create_week_table_row(
      prefix,
      column_titles.length,
      i,
      data_function,
    );
    table_body.appendChild(row);
  }

  return table;
}

function set_sac13_td(element, x, y) {
  const day = y * 7 + x + 1;

  if (x < 7 || day === 29) {
    element.innerText = `${day}`;
    element.id = `sac13-td-${day}`;
    return;
  }

  element.id = `sac13-empty-${x}-${y}`;
  element.innerHTML = "&nbsp;";
}

function init_sac13_table() {
  const t = create_table(
    "sac13",
    ["", "", "", "", "", "", ""],
    [
      "1st Weekday",
      "2nd Weekday",
      "3rd Weekday",
      "4th Weekday",
      "5th Weekday",
      "6th Weekday",
      "7th Weekday",
    ],
    4,
    set_sac13_td,
  );

  const target_div = document.getElementById("cal-sac13");
  target_div.appendChild(t);

  const table_head = document.getElementById("sac13-thead");
}

function init_greg_table() {
  const t = create_table(
    "greg",
    ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    6,
    (x, id) => (x.innerHTML = `&nbsp;`),
  );

  const target_div = document.getElementById("cal-greg");
  target_div.appendChild(t);
}

init_sac13_table();
init_greg_table();

function updateClassElement(prefix, oldId, newId, className) {
  const oldElement = document.getElementById(`${prefix}${oldId}`);

  if (oldElement) {
    oldElement.classList.remove(className);
  }

  const newElement = document.getElementById(`${prefix}${newId}`);

  if (newElement) {
    newElement.classList.add(className);
  }
}

function mark_sac13_header(weekday) {
  const number = weekday - 1;
  updateClassElement("sac13-th-", last_sac13_header, number, "selected-header");
  last_sac13_header = number;
}

function mark_sac13_day(day) {
  updateClassElement("sac13-td-", last_sac13_day, day, "selected-day");
  last_sac13_day = day;
}

function mark_greg_header(weekday) {
  const number = weekday;
  updateClassElement("greg-th-", last_greg_header, number, "selected-header");
  last_greg_header = number;
}

function greg_day_offset(day, weekday) {
  const firstMonday = ((day + 7 - weekday - 1) % 7) + 1;
  const offset = (8 - firstMonday) % 7;

  return offset;
}

function mark_greg_day(day, weekday) {
  const offset = greg_day_offset(day, weekday);
  const markId = day + offset;

  updateClassElement("greg-td-", last_greg_day_Id, markId, "selected-day");
  last_greg_day_Id = markId;
}

function prep_sac13_table(year, month) {
  // TODO: only prep if year or month changes
  prep_sac13_uncached(year, month);
}

function prep_sac13_uncached(year, month) {
  const length = sac13_month_length(year, month);

  if (length === 28) {
    removeElement("sac13-th-7");
    removeElement("sac13-td-blank-w1");
    removeElement("sac13-td-blank-w2");
    removeElement("sac13-td-blank-w3");
    removeElement("sac13-td-29");
  } else if (length === 29) {
    const header = createElement("sac13-th-7", "th", "sac13-thr");
    header.title = "8th Weekday";
    header.innerHTML = "&nbsp";

    createElement("sac13-td-blank-w1", "td", "sac13-tr-0");
    createElement("sac13-td-blank-w2", "td", "sac13-tr-1");
    createElement("sac13-td-blank-w3", "td", "sac13-tr-2");
    const day29 = createElement("sac13-td-29", "td", "sac13-tr-3");

    day29.innerText = "29";
  }
}

function prep_greg_table(day, weekday, year, month) {
  // TODO: only prep if year, month or weekday changes

  const offset = greg_day_offset(day, weekday);
  return prep_greg_table_uncached(offset, year, month);
}

function prep_greg_table_uncached(offset, year, month) {
  const monthLength = greg_month_length(year, month);
  const requiredWeeks = Math.floor((offset + monthLength - 1) / 7) + 1;
  const lastId = requiredWeeks * 7;

  const table_body = document.getElementById("greg-tb");

  for (let i = 0; i <= 6; i++) {
    const rowElement = document.getElementById(`greg-tr-${i}`);

    if (!rowElement && i < requiredWeeks) {
      const row = create_week_table_row(
        "greg",
        7,
        i,
        (x) => (x.innerHTML = "&nbsp;"),
      );
      table_body.appendChild(row);
    } else if (rowElement && i >= requiredWeeks) {
      rowElement.remove();
    }
  }

  for (let i = 1; i <= lastId; i++) {
    const xx = document.getElementById(`greg-td-${i}`);
    const dayNum = i - offset;

    if (dayNum <= 0 || dayNum > monthLength) {
      xx.innerHTML = "&nbsp;";
    } else {
      xx.innerText = String(dayNum);
    }
  }
}

function create_week_table_row(prefix, width, rowNum, fill) {
  const rowId = `${prefix}-tr-${rowNum}`;
  const cellStart = rowNum * width;

  const rowElement = document.createElement("tr");
  rowElement.id = rowId;

  for (let i = 1; i <= width; i++) {
    const cellElement = rowElement.insertCell();
    const id = cellStart + i;
    cellElement.id = `${prefix}-td-${id}`;
    fill(cellElement, i - 1, rowNum);
  }

  return rowElement;
}

function remove_sync() {
  for (const x of [0, 1, 2, 3, 4]) {
    document.getElementById(`cal-r${x}-sync`)?.remove();
  }
}

function set_input_and_date(date) {
  date_inp.value = date;
  set_date(date);
}

function set_date(date) {
  last_set = date;

  if (!isSac13loaded()) {
    return;
  }

  date = date.trim().toUpperCase();
  const parsed = parse_date(date);
  const space = "\\ ";

  function ord(n) {
    return `${n}^{${nr_ord(n)}}`;
  }

  function t(x) {
    return `\\text{${x}}`;
  }

  if (!parsed.success) {
    document.getElementById("date_sub").innerText = "Unknown date format";
    return;
  }

  date_yesterday = parsed.yesterday;
  date_tomorrow = parsed.tomorrow;

  let calendar = "???";

  if (parsed.code === 1) {
    calendar = "Greg.";
  } else if (parsed.code === 2) {
    calendar = "SAC13";
  }

  document.getElementById("date_sub").innerText =
    `${parsed.format} (${calendar})`;

  const greg_katex = greg_format(
    "katex",
    parsed.greg_year,
    parsed.greg_month,
    parsed.greg_day,
    parsed.greg_weekday,
  );

  const sac13_katex = sac13_format(
    "katex",
    parsed.sac13_year,
    parsed.sac13_month,
    parsed.sac13_day,
  );

  render_katex("sac13", sac13_katex);
  render_katex("greg", greg_katex);

  // Mark SAC13
  prep_sac13_table(parsed.sac13_year, parsed.sac13_month);
  mark_sac13_header(parsed.sac13_weekday);
  mark_sac13_day(parsed.sac13_day);

  // Mark Gregorian Calendar
  prep_greg_table(
    parsed.greg_day,
    parsed.greg_weekday,
    parsed.greg_year,
    parsed.greg_month,
  );

  mark_greg_header(parsed.greg_weekday);
  mark_greg_day(parsed.greg_day, parsed.greg_weekday);
}

async function render_date_after_initialization() {
  await waitForSac13module();

  if (!date_inp.value) {
    set_today();
  } else {
    set_date(date_inp.value);
  }
}

render_date_after_initialization();
