// Static data source for the blog. In a real app this might come from a CMS,
// database, or markdown files. Here it's a typed array.

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  body: string[];
};

export const posts: Post[] = [
  {
    id: "getting-started-with-react",
    title: "Getting Started with React",
    excerpt:
      "Components, props, and state — the three ideas you need to start building with React.",
    author: "Maya Patel",
    date: "2026-05-02",
    body: [
      "React lets you describe your UI as a tree of components. Each component is a function that returns markup.",
      "Props pass data down from parent to child, while state holds data that changes over time inside a component.",
      "Once these three ideas click, the rest of React is just patterns built on top of them.",
    ],
  },
  {
    id: "why-typescript",
    title: "Why TypeScript Is Worth It",
    excerpt:
      "Static types catch bugs before you run your code and make refactoring far less scary.",
    author: "Liam Carter",
    date: "2026-05-18",
    body: [
      "TypeScript adds a type layer on top of JavaScript. Your editor can now tell you when you've passed the wrong shape of data.",
      "The biggest win is confidence: renaming a field or changing a function signature surfaces every place that needs updating.",
      "Start loose and tighten over time — you don't need perfect types on day one.",
    ],
  },
  {
    id: "the-app-router",
    title: "Understanding the Next.js App Router",
    excerpt:
      "Folders become routes, and layouts wrap your pages. Here's the mental model.",
    author: "Sofia Rossi",
    date: "2026-06-01",
    body: [
      "In the App Router, the folder structure inside `app/` defines your routes. A `page.tsx` file makes a route public.",
      "Dynamic segments use square brackets, like `[id]`, and receive the value through the `params` prop.",
      "`layout.tsx` files wrap everything beneath them, perfect for shared headers and footers.",
    ],
  },
];

// Helper to find a single post by its id.
export function getPostById(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}
