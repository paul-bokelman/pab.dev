import slugify from "slugify";

/** filename (or wikilink target) -> url-safe slug */
export const toSlug = (value: string) => slugify(value.replace(/\.mdx?$/, ""), { lower: true, strict: true });

/** where attachments live: obsidian writes them to public/vault, next serves them from /vault */
export const ATTACHMENTS = "/vault";

export type LinkResolver = (target: string) => string | null;

const IMAGE = /\.(png|jpe?g|gif|svg|webp|avif)$/i;
const VIDEO = /\.(mp4|webm|mov)$/i;

const attachment = (file: string) => `${ATTACHMENTS}/${file.split("/").pop()!.split(" ").join("%20")}`;

/**
 * Obsidian's markdown is *almost* commonmark. These are the divergences that
 * actually show up in a vault, translated to something MDX understands.
 */
export const fromObsidian = (markdown: string, resolve: LinkResolver): string => {
  let out = markdown;

  // ![[attachment.png]] / ![[clip.mp4|caption]] — embeds
  out = out.replace(/!\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g, (_match, target: string, alias?: string) => {
    const file = target.trim();
    const label = (alias ?? "").trim();

    // must stay on one line: multi-line jsx is only valid in mdx as a flow
    // element, and an embed can legitimately appear mid-paragraph
    if (VIDEO.test(file)) {
      const video = `<video src="${attachment(file)}" loop autoPlay muted playsInline controls />`;
      const caption = label ? `<sub>${label}</sub>` : "";
      return `<div className="video">${video}${caption}</div>`;
    }

    if (IMAGE.test(file)) return `![${label}](${attachment(file)})`;

    // embedding another note is not something a static page can do — link instead
    const href = resolve(file);
    return href ? `[${label || file}](${href})` : label || file;
  });

  // [[note]] / [[note#heading|alias]] — internal links
  out = out.replace(/\[\[([^\]|#]+?)(?:#([^\]|]*))?(?:\|([^\]]*))?\]\]/g, (_match, target: string, _hash, alias?: string) => {
    const label = (alias ?? "").trim() || target.trim();
    const href = resolve(target.trim());
    return href ? `[${label}](${href})` : label;
  });

  // > [!note] Title — callouts collapse to a plain quote with a bolded lead
  out = out.replace(/^(\s*)>\s*\[!(\w+)\][+-]?\s*(.*)$/gm, (_match, indent: string, kind: string, title: string) => {
    const heading = title.trim() || kind.toLowerCase();
    return `${indent}> **${heading}**`;
  });

  // ==highlight==
  out = out.replace(/==([^=\n]+)==/g, "<mark>$1</mark>");

  // ^block-ids are an obsidian-only anchor
  out = out.replace(/[ \t]*\^[a-zA-Z0-9-]+$/gm, "");

  return out;
};
