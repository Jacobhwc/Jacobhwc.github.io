const fs = require("fs");
const path = require("path");

const inputDir = "/Users/jacob/Desktop/cloudflare/gigienergy-worker/png128px";
const outputFile = path.join(process.cwd(), "import-flags.sql");

const files = fs
  .readdirSync(inputDir)
  .filter((file) => /\.(png|jpg|jpeg|svg|webp)$/i.test(file));

if (files.length === 0) {
  console.error("No image files found in:", inputDir);
  process.exit(1);
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

function getCountryCode(filename) {
  return path.basename(filename, path.extname(filename)).toLowerCase();
}

const statements = [];

for (const file of files) {
  const filePath = path.join(inputDir, file);
  const contentType = getContentType(file);
  const countryCode = getCountryCode(file);
  const hexData = fs.readFileSync(filePath).toString("hex");

  statements.push(
    `INSERT OR REPLACE INTO flags (country_code, content_type, image_data) VALUES ('${countryCode}', '${contentType}', X'${hexData}');`
  );
}

fs.writeFileSync(outputFile, statements.join("\n"), "utf8");

console.log(`Generated ${outputFile} with ${files.length} flag inserts.`);