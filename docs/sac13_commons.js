"use strict";

let sac13Loaded = false;

/**
 *
 * @returns {string} ISO formatted local date, like `2025-10-31`
 */
function getLocalISODate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = intLead0(now.getMonth() + 1, 2);
  const day = intLead0(now.getDate(), 2);

  return `${year}-${month}-${day}`;
}

/**
 * Used internally as a month lookup table for SAC13 and the Gregorian Calendar.
 * Use `greg_month_name` or `sac13_month_name` instead.
 *
 * @param {number} month_index
 * @returns The english name of the month.
 */
function month_name_common(month_index) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "Addenduary",
  ];
  return months[month_index];
}

/**
 *
 * @param {number} month - Gregorian month, 1=Jan., 2=Feb., ..., 12=Dec.
 * @returns {string} The english name of the month.
 */
function greg_month_name(month) {
  return month_name_common(month - 1);
}

/**
 *
 * @param {number} month - SAC13 month, 1=Mar., 2=Apr., ..., 13=Feb.
 * @returns {string} The english name of the month.
 */
function sac13_month_name(month) {
  return month_name_common(month + 1);
}

/**
 *
 * @param {number} day - Weekday number. 0=Mon., 1=Tue., ..., 6=Sun.
 * @returns The english name of the weekday.
 */
function greg_weekday(day) {
  if (day < 0 || day > 6) {
    return `ErrWd-${day}`;
  }

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[day];
}

/**
 * Formats a SAC13 year with a millennium indicator char.
 *
 * `12025 --> M025`
 *
 * @param {number} year a SAC13 year. Must be between 0 and 25999 (both incl.) will return undefined otherwise.
 * @returns {string} a formatted SAC13 year.
 */
function sac13_year(year) {
  if (year < 0 || year > 25999) {
    return undefined;
  }

  const millennium = Math.floor(year / 1000);
  const rest = year % 1000;

  return String.fromCharCode(millennium + 65) + intLead0(rest, 3);
}

/**
 * Formats the SAC13 date in an "ISO-like" manner, like `M024-04-16`.
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {string}
 */
function isoLikeSac13(year, month, day) {
  return `${sac13_year(year)}-${intLead0(month, 2)}-${intLead0(day, 2)}`;
}

/**
 *
 * @param {number} year - Gregorian Calendar year
 * @param {number} month - Gregorian Calendar month (1=Jan, 2=Feb, etc.)
 * @returns {number} Length of a given month in days (28, 29, 30, 31).
 */
function greg_month_length(year, month) {
  if (month === 2 && is_greg_leap_year(year)) {
    return 29;
  }

  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

/**
 *
 * @param {number} year - Gregorian Calendar year
 * @returns {boolean} `true` if leap year and `false` if not
 */
function is_greg_leap_year(year) {
  if (year % 400 === 0) {
    return true;
  }

  if (year % 100 === 0) {
    return false;
  }

  if (year % 4 === 0) {
    return true;
  }

  return false;
}

/**
 *
 * @param {number} year - SAC13 year as a number (without millennium character).
 * @param {number} month - SAC13 month
 * @returns the length of the month. Typically 28, but Addenduary has 29 days, and so has August on leap years.
 */
function sac13_month_length(year, month) {
  if (month === 13 || (month === 6 && is_sac13_leap_year(year))) {
    return 29;
  }

  return 28;
}

/**
 *
 * @param {number} year - SAC13 year as a number (without millennium character).
 * @returns {boolean} Returns true if the given year is a leap year (366 days) or false otherwise (365 days).
 */
function is_sac13_leap_year(year) {
  return (((year + 199) % 293) % 33) % 4 === 1;
}

/**
 * Removes an element with a matching id. If the element is not found it doesn't do anything.
 * @param {string} id - The element's id.
 */
function removeElement(id) {
  document.getElementById(id)?.remove();
}

/**
 * Creates an empty element with a given tagName and appends it to a given parent.
 * @param {string} id - ID for the new element
 * @param {string} tagName - Tag name for the new element.
 * @param {string} parentId - ID that determines the parent the new element is attached to.
 * @returns {HTMLElement|null} Returns the element (or null if the parent wasn't found)
 */
function createElement(id, tagName, parentId) {
  const existingElement = document.getElementById(id);

  if (existingElement) {
    return existingElement;
  }

  const parent = document.getElementById(parentId);

  if (!parent) {
    return null;
  }

  const newElement = document.createElement(tagName);
  newElement.id = id;

  parent.appendChild(newElement);

  return newElement;
}

/**
 * Returns the ordinal suffix for a given number.
 *
 * ## Examples
 *
 * |     n | return | concat |
 * |------:|--------|--------|
 * |     1 |     st |    1st |
 * |     2 |     nd |    2nd |
 * |     3 |     rd |    3rd |
 * |   111 |     th |  111th |
 * |  4521 |     st | 4521st |
 *
 * Also handles cases ending with eleven, twelve, thirteen.
 *  *
 * @param {number} n - the number to get the ordinal suffix for
 * @returns the suffix "st", "nd", "rd" or "th"
 */
function nr_ord(n) {
  const tens = n % 100;

  if (tens === 11 || tens === 12 || tens === 13) {
    return "th";
  }

  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/**
 * Formats a given Gregorian Calendar date either plain or for KaTeX.
 *
 * Example: `Weekday, 2nd October 2025`
 *
 * @param {"katex" | "plain"} format
 * @param {number} [year]
 * @param {number} [month] - Month. 1=Jan.,2=Feb.,...,12=Dec.
 * @param {number} [day] - Day of the month. Optional, but only will be rendered if `month` is provided too.
 * @param {number} [weekday] - The weekday number (0=Mon,1=Tue,...,6=Sun). Optional. Only rendered if at least day and month are provided.
 * @returns {string} Returns the formatted Gregorian Calendar date
 */
function greg_format(format, year, month, day, weekday) {
  let result = "";
  const isKatex = format === "katex";
  const hasWeekday = weekday !== undefined;
  const hasYear = year !== undefined;

  function textIfKatex(text) {
    if (isKatex) {
      return `\\text{${text}}`;
    }

    return text;
  }

  // render weekday
  if (day && month && hasWeekday) {
    result += textIfKatex(`${greg_weekday(weekday)}, `);
  }

  // render day
  if (day && month) {
    result += `${nr_ord_format(format, day)}\\ `;
  }

  // render month
  if (month) {
    let month_formatted = greg_month_name(month);

    if (hasYear) {
      month_formatted += " ";
    }

    result += textIfKatex(month_formatted);
  }

  // render year
  if (hasYear) {
    result += textIfKatex(intLead0(year, 4));
  }

  return result;
}

/**
 * Formats a given SAC13 date either plain for KaTeX.
 *
 * Example: `2nd October M025`
 *
 * @param {"katex" | "plain"} format
 * @param {number} [year] - year as a number (without millennium character).
 * @param {number} [month] - Month. 1=Mar., 2=Apr., ..., 13=Feb.
 * @param {number} [day] - Day of the month. Optional, but only will be rendered if `month` is provided too.
 * @returns {string} Returns the formatted SAC13 date
 */
function sac13_format(format, year, month, day) {
  let result = "";
  const isKatex = format === "katex";
  const hasYear = year !== undefined;

  function textIfKatex(text) {
    if (isKatex) {
      return `\\text{${text}}`;
    }

    return text;
  }

  // render day
  if (day && month) {
    result += `${nr_ord_format(format, day)}\\ `;
  }

  // render month
  if (month) {
    let month_formatted = sac13_month_name(month);

    if (hasYear) {
      month_formatted += " ";
    }

    result += textIfKatex(month_formatted);
  }

  // render year
  if (hasYear) {
    result += textIfKatex(sac13_year(year, 4));
  }

  return result;
}

/**
 * Formats a given number as an ordinal with its suffix.
 *
 * @param {"katex" | "plain"} format
 * @param {number} n
 */
function nr_ord_format(format, n) {
  const suffix = nr_ord(n);

  switch (format) {
    case "katex":
      return `${n}^{\\text{${suffix}}}`;
    case "plain":
      return `${n}${suffix}`;
    default:
      return undefined;
  }
}

/**
 * Leading zeros for integer numbers.
 *
 * @param {number} number
 * @param {number} places
 * @returns {string} formatted string with at least `places` leading zeros
 */
function intLead0(number, places) {
  if (!Number.isInteger(number) || !Number.isFinite(number)) {
    return "";
  }

  if (number >= 0) {
    return String(number).padStart(places, "0");
  } else {
    return `-${String(-number).padStart(places, "0")}`;
  }
}

/**
 * Begins to initialize the SAC13 web assembly module and also waits for KaTeX to load.
 */
async function init_sac13_wasm() {
  let m = await import("/sac13-calc/sac13_web_calc.js");
  await m.default();
  await waitForKaTeX();

  window.parse_date = (date) => {
    const x = m.parse_date(date);

    return {
      success: x.code !== 0,
      code: x.code,
      format: x.format,
      tomorrow: x.tomorrow,
      yesterday: x.yesterday,
      greg_day: x.greg_day,
      greg_month: x.greg_month,
      greg_year: x.greg_year,
      greg_weekday: x.greg_weekday,
      sac13_day: x.sac13_day,
      sac13_month: x.sac13_month,
      sac13_year: x.sac13_year,
      sac13_weekday: x.sac13_weekday,
    };
  };

  sac13Loaded = true;
}

/**
 *
 * @param {ConditionFunction} fnCondition - Condition function which return a boolean but has no parameters.
 * @param {number} [waitMs] - The wait time between polls
 * @param {number} [max] - The maximum number of polls before the function throws an exception.
 * @returns
 */
async function waitFor(fnCondition, waitMs = 10, max = 321) {
  if (fnCondition()) {
    return;
  }

  do {
    await wait(waitMs);
    max--;

    if (max <= 0) {
      throw new Error(`waitFor poll timeout. Condition not met.`);
    }
  } while (!fnCondition());
}

/**
 * Waits for a given amount of time (when awaited).
 *
 * @param {number} timeMs - The time to wait in milliseconds.
 * @returns {Promise} Promise which is resolved once the time passed.
 */
function wait(timeMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
}

/**
 * Waits for KaTeX to finish loading.
 */
async function waitForKaTeX() {
  return waitFor(() => typeof window.katex !== "undefined");
}

/**
 * Waits for SAC13 commons (+KaTeX) to finish loading.
 */
async function waitForSac13module() {
  return waitFor(isSac13loaded);
}

/**
 *
 * @returns {boolean} Returns a flag indicating if the SAC13 module is loaded. `true`=loaded, `false`=not yet loaded.
 */
function isSac13loaded() {
  return sac13Loaded;
}

function render_katex(id, content) {
  if (typeof katex === "undefined") {
    console.warn("Failed to render. KaTeX not loaded yet.", id, content);

    return;
  }

  katex.render(content, document.getElementById(`ktexjs-${id}`), {
    throwOnError: false,
  });
}

// begins (because the function is async) to initialize the SAC13 module
init_sac13_wasm();
