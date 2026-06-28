import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

// Renders Markdown to HTML. react-markdown does not allow raw HTML by default,
// so post content can't inject scripts — safe to show user-written posts.
// rehype-slug adds an `id` to every heading so the table of contents can link
// to them (see extractHeadings in lib/toc.js, which uses the same slugger).
export default function Markdown({ children }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
