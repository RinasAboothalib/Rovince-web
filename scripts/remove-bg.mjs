import { removeBackground } from "@imgly/background-removal-node";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = "https://www.rovincetire.com/wp-content/themes/rovincetire/assets/images/";
const FILES = ["tire_1", "tire_3", "tire_5", "tire_6"];
const OUT = path.resolve("public/tires");

await mkdir(OUT, { recursive: true });

for (const name of FILES) {
  const url = `${BASE}${name}.webp`;
  process.stdout.write(`Removing background: ${name} ... `);
  try {
    const blob = await removeBackground(url, { output: { format: "image/png" } });
    const buf = Buffer.from(await blob.arrayBuffer());
    await writeFile(path.join(OUT, `${name}.png`), buf);
    console.log(`ok (${Math.round(buf.length / 1024)} KB)`);
  } catch (e) {
    console.log(`FAILED: ${e.message}`);
  }
}
console.log("done");
