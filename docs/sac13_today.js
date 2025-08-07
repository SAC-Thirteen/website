"use strict";

async function render_date_after_initialization() {
  await waitForSac13module();

  const today = getLocalISODate();
  const parsed = parse_date(today);

  const sac13_katex = sac13_format(
    "katex",
    parsed.sac13_year,
    parsed.sac13_month,
    parsed.sac13_day,
  );

  const formatted = `\\underline{\\text{Today in SAC13}}\\newline \\ \\newline \\Large{${sac13_katex}}`;

  render_katex("sac13-today", formatted);
}

render_date_after_initialization();
