let cachedGenerator = null;

export default async function downloadResume() {
  if (!cachedGenerator) {
    const module = await import("./generateResumePDF");
    cachedGenerator = module.default;
  }

  cachedGenerator();
}
