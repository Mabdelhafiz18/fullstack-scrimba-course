import GithubSlugger from "github-slugger";

// Pulls h1–h3 headings out of a Markdown string for a table of contents.
// Uses github-slugger — the same slugger rehype-slug uses when rendering — so
// the generated ids match the heading ids in the page, and the anchors work.
export function extractHeadings(markdown) {
  const slugger = new GithubSlugger();
  const headings = [];
  let inFence = false;

  for (const line of (markdown || "").split("\n")) {
    // Skip fenced code blocks so a `# comment` inside code isn't a heading.
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length;
    const text = match[2]
      .replace(/`([^`]+)`/g, "$1") // inline code
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> text
      .replace(/[*_]/g, "") // emphasis markers
      .trim();
    if (text) headings.push({ depth, text, id: slugger.slug(text) });
  }

  return headings;
}
