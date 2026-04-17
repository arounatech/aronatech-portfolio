import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const publicHtmlDir = path.join(distDir, "public_html");
const vendorSrc = path.join(root, "vendor");
const vendorDest = path.join(distDir, "vendor");
const envSrc = path.join(root, ".env.mail");
const envExampleSrc = path.join(root, ".env.mail.example");
const envDest = path.join(distDir, ".env.mail");

if (!fs.existsSync(distDir)) {
  console.error("dist directory not found. Run vite build first.");
  process.exit(1);
}

function moveEntry(source, target) {
  try {
    fs.renameSync(source, target);
  } catch {
    fs.cpSync(source, target, { recursive: true, force: true });
    fs.rmSync(source, { recursive: true, force: true });
  }
}

fs.rmSync(publicHtmlDir, { recursive: true, force: true });
fs.mkdirSync(publicHtmlDir, { recursive: true });

const distEntries = fs.readdirSync(distDir, { withFileTypes: true });
for (const entry of distEntries) {
  if (entry.name === "public_html") continue;

  const source = path.join(distDir, entry.name);
  const target = path.join(publicHtmlDir, entry.name);
  moveEntry(source, target);
}

if (fs.existsSync(vendorSrc)) {
  fs.rmSync(vendorDest, { recursive: true, force: true });
  fs.cpSync(vendorSrc, vendorDest, { recursive: true, force: true });
} else {
  const warningPath = path.join(distDir, "VENDOR_MISSING.txt");
  fs.writeFileSync(
    warningPath,
    "Composer vendor directory is missing.\n" +
      "Run `composer install --no-dev --optimize-autoloader` in deployment root.\n",
    "utf8"
  );
}

if (fs.existsSync(envSrc)) {
  fs.copyFileSync(envSrc, envDest);
} else if (fs.existsSync(envExampleSrc)) {
  fs.copyFileSync(envExampleSrc, envDest);
}

const composerJsonSrc = path.join(root, "composer.json");
const composerLockSrc = path.join(root, "composer.lock");

if (fs.existsSync(composerJsonSrc)) {
  fs.copyFileSync(composerJsonSrc, path.join(distDir, "composer.json"));
}
if (fs.existsSync(composerLockSrc)) {
  fs.copyFileSync(composerLockSrc, path.join(distDir, "composer.lock"));
}

const instructions = [
  "Shared hosting package generated.",
  "",
  "Upload these folders/files to hosting root:",
  "- public_html/   -> your web root",
  "- .env.mail      -> one level above web root (same level as vendor/)",
  "- vendor/        -> Composer dependencies (if present)",
  "- composer.json  -> optional, for running composer install on server",
  "",
  "Expected server layout:",
  "/home/USER/",
  "  .env.mail",
  "  vendor/",
  "  public_html/",
  "    index.html",
  "    assets/",
  "    api/contact.php",
].join("\n");

fs.writeFileSync(path.join(distDir, "DEPLOY_STRUCTURE.txt"), `${instructions}\n`, "utf8");

console.log("Prepared shared-hosting package in dist/public_html");
