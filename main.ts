import * as fs from "node:fs";
import * as path from "node:path";

// Angry Judge: The Short Rant Contest — entry writer.
// Gate: /output/entry.txt must be UTF-8 text of 1 to 400 characters,
// not only white space. The rant is a few sentences at most about one
// small everyday annoyance; the judge weighs, in order: (1) a funny rant
// about an everyday annoyance, (2) actually funny, (3) a specific concrete
// annoyance, (4) sharp economical wording, (5) a fresh angle.
//
// ATM: the brief's own examples (printer, bus, "circling back") will flood
// the field, so this entry takes a different concrete annoyance everyone
// has lived through: the self-checkout machine that scans your item,
// charges you for it, then accuses you of stealing it. The anger is
// shared rather than performed, and the punch lands on the last words.
const RANT =
  "The self-checkout scanned my milk, charged me for my milk, then shouted " +
  "UNEXPECTED ITEM IN THE BAGGING AREA at my milk. " +
  "I am standing here holding the receipt for the crime it just watched me commit.";

function main(): void {
  const text = RANT;
  const chars = [...text].length;
  if (chars < 1 || chars > 400) {
    throw new Error(`gate: entry is ${chars} chars, must be 1-400`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry is only white space");
  }
  if (text !== text.trim()) {
    // Ties break on fewer bytes: no leading/trailing whitespace allowed.
    throw new Error("gate: entry has leading or trailing whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("gate: rant must be one tight paragraph, no line breaks");
  }
  if (!/^[\x20-\x7E\n\r\t]*$/.test(text)) {
    throw new Error("gate: entry must be plain ASCII text");
  }
  const outDir = "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "entry.txt");
  fs.writeFileSync(outPath, text, "utf8");
  // Read it back and verify the round trip, byte for byte.
  const back = fs.readFileSync(outPath, "utf8");
  if (back !== text) {
    throw new Error("round-trip mismatch: entry.txt does not match the rant");
  }
  const bytes = Buffer.byteLength(back, "utf8");
  console.log(`wrote ${outPath}: ${chars} chars, ${bytes} bytes`);
  console.log(back);
}

main();
