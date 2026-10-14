import test from "node:test";
import assert from "node:assert/strict";
import {
  standardDays,
  shiftWorkdays,
  workdaysBetween,
} from "../src/calendar.ts";
test("MM brackets include the lower bound and exclude the upper bound", () => {
  for (const [mm, n] of [
    [0, 8],
    [0.299, 8],
    [0.3, 11],
    [0.6, 15],
    [1, 22],
    [1.5, 26],
    [2.5, 40],
    [3.5, 50],
    [5, null],
    [-1, null],
  ])
    assert.equal(standardDays(mm), n);
});
test("deadline excludes registration day, weekends and Korean holidays", () => {
  assert.equal(shiftWorkdays("2026-10-02", 1), "2026-10-06");
  assert.equal(shiftWorkdays("2026-10-08", 1), "2026-10-12");
  assert.equal(shiftWorkdays("2026-09-23", 1), "2026-09-28");
});
test("reverse suggestion gives the required working duration for a working-day due date", () => {
  const start = "2026-08-20",
    due = shiftWorkdays(start, 11);
  assert.equal(workdaysBetween(start, due), 11);
  assert.equal(shiftWorkdays(due, -11), start);
  assert.ok(
    "2026-09-10" > due,
    "requested completion beyond standard deadline triggers review",
  );
});
