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

  const title = parsed.sac13_day === 29 ? "Happy Sync Day!" : "Today in SAC13";
  const formatted = `\\underline{\\text{${title}}}\\newline \\ \\newline \\Large{${sac13_katex}}`;

  render_katex("sac13-today", formatted);
}

render_date_after_initialization();
