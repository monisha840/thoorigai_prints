/**
 * Renders a JSON-LD graph into the document.
 *
 * Server-rendered into the markup rather than injected by script, because a
 * crawler that does not execute JavaScript still has to see it.
 *
 * `<` is escaped to `<` before the string reaches `dangerouslySetInnerHTML`.
 * Without that, any content string containing `</script>` — a product summary,
 * an image caption, anything that one day comes from a CMS — closes the tag
 * early and the rest of the graph lands in the DOM as executable markup.
 * `JSON.stringify` does not escape it; this is the standard mitigation.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}

export default JsonLd;
