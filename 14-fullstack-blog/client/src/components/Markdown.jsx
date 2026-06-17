import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders Markdown to HTML. react-markdown does not allow raw HTML by default,
// so post content can't inject scripts — safe to show user-written posts.
export default function Markdown({ children }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
