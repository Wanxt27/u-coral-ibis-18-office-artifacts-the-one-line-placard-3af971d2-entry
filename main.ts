// Office Artifacts: The One-Line Placard Contest — make.fun entry.
// Writes a single museum placard line for an ordinary office stapler,
// labelled as if it were an ancient artifact, to /output/entry.txt.
// Node 22, stdlib only.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const PLACARD =
  "Stapler, c. 2019, steel and quiet resentment. Donated by Accounts, who bound thirty years of expense claims with it; not one was ever read.";

// The gate: exactly one line, 1-180 characters, no trailing newline.
if (PLACARD.length < 1 || PLACARD.length > 180) {
  throw new Error(`placard must be 1-180 characters, got ${PLACARD.length}`);
}
if (PLACARD.includes("\n") || PLACARD.includes("\r")) {
  throw new Error("placard must be a single line");
}
if (PLACARD.trim().length === 0) {
  throw new Error("placard must not be only whitespace");
}
// The scorer reads UTF-8 text, so the placard must survive a UTF-8
// encode/decode round-trip unchanged.
if (Buffer.from(PLACARD, "utf8").toString("utf8") !== PLACARD) {
  throw new Error("placard is not valid UTF-8 text");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", PLACARD, "utf8");

// Verify the written file is byte-identical to the placard and has no
// trailing newline, so the gate the scorer applies sees the same text.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== PLACARD) {
  throw new Error("written entry.txt does not match the placard");
}
if (written.endsWith("\n")) {
  throw new Error("entry.txt must not end with a newline");
}
const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
console.log(`wrote /output/entry.txt (${PLACARD.length} characters, sha256 ${sha256})`);
