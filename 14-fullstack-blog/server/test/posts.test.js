import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import { pool, initSchema } from "../db.js";
import { TEST_PASSWORD } from "./setup.js";

// Write routes require auth — log in once and reuse the token via these helpers.
let token;
const authPost = (path) =>
  request(app).post(path).set("Authorization", `Bearer ${token}`);
const authPut = (path) =>
  request(app).put(path).set("Authorization", `Bearer ${token}`);
const authDelete = (path) =>
  request(app).delete(path).set("Authorization", `Bearer ${token}`);

beforeAll(async () => {
  await initSchema();
  const res = await request(app).post("/api/login").send({ password: TEST_PASSWORD });
  token = res.body.token;
});

beforeEach(async () => {
  // Fresh table for every test so they don't depend on each other.
  await pool.query("TRUNCATE posts RESTART IDENTITY");
});

afterAll(async () => {
  await pool.end();
});

describe("auth", () => {
  it("POST /api/login returns a token for the correct password", async () => {
    const res = await request(app).post("/api/login").send({ password: TEST_PASSWORD });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
  });

  it("POST /api/login rejects a wrong password with 401", async () => {
    const res = await request(app).post("/api/login").send({ password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("POST /api/login rejects a missing password with 400", async () => {
    const res = await request(app).post("/api/login").send({});
    expect(res.status).toBe(400);
  });

  it("rejects an unauthenticated create with 401", async () => {
    const res = await request(app).post("/api/posts").send({ title: "X", body: "y" });
    expect(res.status).toBe(401);
  });

  it("rejects a bogus token with 401", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", "Bearer not.a.jwt")
      .send({ title: "X", body: "y" });
    expect(res.status).toBe(401);
  });

  it("rejects unauthenticated update and delete with 401", async () => {
    const created = await authPost("/api/posts").send({ title: "X", body: "y" });
    const put = await request(app)
      .put(`/api/posts/${created.body.id}`)
      .send({ title: "X", body: "z" });
    const del = await request(app).delete(`/api/posts/${created.body.id}`);
    expect(put.status).toBe(401);
    expect(del.status).toBe(401);
  });

  it("allows a create with a valid token", async () => {
    const res = await authPost("/api/posts").send({ title: "Authed", body: "y" });
    expect(res.status).toBe(201);
  });
});

describe("GET /api/posts", () => {
  it("returns an empty array when there are no posts", async () => {
    const res = await request(app).get("/api/posts");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns posts newest first", async () => {
    await authPost("/api/posts").send({ title: "First", body: "a" });
    await authPost("/api/posts").send({ title: "Second", body: "b" });
    const res = await request(app).get("/api/posts");
    expect(res.body.map((p) => p.title)).toEqual(["Second", "First"]);
  });

  it("does not expose the internal full-text search column", async () => {
    await authPost("/api/posts").send({ title: "Hi", body: "x" });
    const res = await request(app).get("/api/posts");
    expect(res.body[0]).not.toHaveProperty("search");
  });
});

describe("GET /api/posts?q= (full-text search)", () => {
  beforeEach(async () => {
    await authPost("/api/posts").send({
      title: "Learning PostgreSQL",
      body: "indexes and queries",
      excerpt: "databases are fun",
    });
    await authPost("/api/posts").send({
      title: "React tips",
      body: "hooks and components",
      excerpt: "frontend stuff",
    });
  });

  it("matches a word in the title (case-insensitive)", async () => {
    const res = await request(app).get("/api/posts?q=POSTGRESQL");
    expect(res.body.map((p) => p.title)).toEqual(["Learning PostgreSQL"]);
  });

  it("matches a word in the excerpt", async () => {
    const res = await request(app).get("/api/posts?q=frontend");
    expect(res.body.map((p) => p.title)).toEqual(["React tips"]);
  });

  it("matches a word that only appears in the body", async () => {
    const res = await request(app).get("/api/posts?q=hooks");
    expect(res.body.map((p) => p.title)).toEqual(["React tips"]);
  });

  it("stems words (searching 'query' finds 'queries')", async () => {
    const res = await request(app).get("/api/posts?q=query");
    expect(res.body.map((p) => p.title)).toEqual(["Learning PostgreSQL"]);
  });

  it("ranks a title match above a body-only match", async () => {
    await authPost("/api/posts").send({ title: "Signal boost", body: "noise" });
    await authPost("/api/posts").send({ title: "Quiet", body: "a faint signal here" });
    const res = await request(app).get("/api/posts?q=signal");
    expect(res.body.map((p) => p.title)).toEqual(["Signal boost", "Quiet"]);
  });

  it("returns an empty array when nothing matches", async () => {
    const res = await request(app).get("/api/posts?q=zzzznope");
    expect(res.body).toEqual([]);
  });

  it("ignores a blank query and returns everything", async () => {
    const res = await request(app).get("/api/posts?q=%20");
    expect(res.body.length).toBe(2);
  });
});

describe("GET /api/posts?tag= (filter)", () => {
  beforeEach(async () => {
    await authPost("/api/posts").send({ title: "Node post", body: "x", tags: "node,backend" });
    await authPost("/api/posts").send({ title: "Design post", body: "y", tags: "design" });
    await authPost("/api/posts").send({ title: "Nodemon note", body: "z", tags: "tooling" });
  });

  it("returns only posts carrying the exact tag", async () => {
    const res = await request(app).get("/api/posts?tag=node");
    expect(res.body.map((p) => p.title)).toEqual(["Node post"]);
  });

  it("does not match a tag as a substring of another tag", async () => {
    const res = await request(app).get("/api/posts?tag=node");
    expect(res.body.every((p) => p.title !== "Nodemon note")).toBe(true);
  });

  it("combines q and tag (both must hold)", async () => {
    const res = await request(app).get("/api/posts?tag=node&q=node");
    expect(res.body.map((p) => p.title)).toEqual(["Node post"]);
  });
});

describe("GET /api/posts?sort=", () => {
  it("sorts oldest first", async () => {
    await authPost("/api/posts").send({ title: "One", body: "x" });
    await authPost("/api/posts").send({ title: "Two", body: "y" });
    const res = await request(app).get("/api/posts?sort=oldest");
    expect(res.body.map((p) => p.title)).toEqual(["One", "Two"]);
  });

  it("sorts most-tagged first", async () => {
    await authPost("/api/posts").send({ title: "None", body: "x" });
    await authPost("/api/posts").send({ title: "Three", body: "y", tags: "a,b,c" });
    await authPost("/api/posts").send({ title: "One tag", body: "z", tags: "a" });
    const res = await request(app).get("/api/posts?sort=most-tags");
    expect(res.body.map((p) => p.title)).toEqual(["Three", "One tag", "None"]);
  });

  it("defaults to newest first", async () => {
    await authPost("/api/posts").send({ title: "First", body: "x" });
    await authPost("/api/posts").send({ title: "Second", body: "y" });
    const res = await request(app).get("/api/posts");
    expect(res.body.map((p) => p.title)).toEqual(["Second", "First"]);
  });

  it("falls back to newest for an unknown sort value", async () => {
    await authPost("/api/posts").send({ title: "First", body: "x" });
    await authPost("/api/posts").send({ title: "Second", body: "y" });
    const res = await request(app).get("/api/posts?sort=bogus");
    expect(res.body.map((p) => p.title)).toEqual(["Second", "First"]);
  });
});

describe("POST /api/posts", () => {
  it("creates a post and returns 201 with id, slug, and cleaned tags", async () => {
    const res = await authPost("/api/posts").send({
      title: "Hello, World!",
      body: "# hi",
      tags: "A, b ,a",
    });
    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe("number");
    expect(res.body.slug).toBe("hello-world");
    expect(res.body.tags).toBe("a,b");
    expect(res.body.created_at).toBeTruthy();
  });

  it("rejects a missing title with 400 and an errors array", async () => {
    const res = await authPost("/api/posts").send({ body: "x" });
    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it("rejects a missing body with 400", async () => {
    const res = await authPost("/api/posts").send({ title: "x" });
    expect(res.status).toBe(400);
  });

  it("generates unique slugs for duplicate titles", async () => {
    const a = await authPost("/api/posts").send({ title: "Dup", body: "x" });
    const b = await authPost("/api/posts").send({ title: "Dup", body: "y" });
    expect(a.body.slug).toBe("dup");
    expect(b.body.slug).toBe("dup-2");
  });

  it("rejects an over-long title with 400", async () => {
    const res = await authPost("/api/posts").send({ title: "a".repeat(201), body: "x" });
    expect(res.status).toBe(400);
  });

  it("rejects an over-long excerpt with 400", async () => {
    const res = await authPost("/api/posts").send({
      title: "T",
      body: "x",
      excerpt: "a".repeat(501),
    });
    expect(res.status).toBe(400);
  });

  it("rejects an over-long body with 400", async () => {
    const res = await authPost("/api/posts").send({ title: "T", body: "a".repeat(50001) });
    expect(res.status).toBe(400);
  });

  it("rejects over-long tags with 400", async () => {
    const res = await authPost("/api/posts").send({
      title: "T",
      body: "x",
      tags: "a".repeat(201),
    });
    expect(res.status).toBe(400);
  });

  it("accepts content at the limits", async () => {
    const res = await authPost("/api/posts").send({
      title: "a".repeat(200),
      body: "a".repeat(50000),
      excerpt: "a".repeat(500),
    });
    expect(res.status).toBe(201);
  });
});

describe("GET /api/posts/:slug", () => {
  it("returns a post by slug", async () => {
    await authPost("/api/posts").send({ title: "Find Me", body: "x" });
    const res = await request(app).get("/api/posts/find-me");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Find Me");
  });

  it("returns 404 for an unknown slug", async () => {
    const res = await request(app).get("/api/posts/nope");
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/posts/:id", () => {
  it("updates a post and refreshes the slug when the title changes", async () => {
    const created = await authPost("/api/posts").send({ title: "Old", body: "x" });
    const res = await authPut(`/api/posts/${created.body.id}`).send({
      title: "New Title",
      body: "y",
    });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New Title");
    expect(res.body.slug).toBe("new-title");
  });

  it("keeps the slug when the title is unchanged", async () => {
    const created = await authPost("/api/posts").send({ title: "Same", body: "x" });
    const res = await authPut(`/api/posts/${created.body.id}`).send({
      title: "Same",
      body: "updated body",
    });
    expect(res.body.slug).toBe("same");
    expect(res.body.body).toBe("updated body");
  });

  it("returns 404 when updating a missing post", async () => {
    const res = await authPut("/api/posts/9999").send({ title: "x", body: "y" });
    expect(res.status).toBe(404);
  });

  it("returns 404 for a non-numeric id instead of erroring", async () => {
    const res = await authPut("/api/posts/abc").send({ title: "x", body: "y" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/posts/:id", () => {
  it("deletes a post and returns 204", async () => {
    const created = await authPost("/api/posts").send({ title: "Bye", body: "x" });
    const res = await authDelete(`/api/posts/${created.body.id}`);
    expect(res.status).toBe(204);
    const after = await request(app).get("/api/posts/bye");
    expect(after.status).toBe(404);
  });

  it("returns 404 when deleting a missing post", async () => {
    const res = await authDelete("/api/posts/9999");
    expect(res.status).toBe(404);
  });

  it("returns 404 for a non-numeric id", async () => {
    const res = await authDelete("/api/posts/abc");
    expect(res.status).toBe(404);
  });
});

describe("cover_url", () => {
  it("stores a valid https cover_url on create", async () => {
    const res = await authPost("/api/posts").send({
      title: "T",
      body: "b",
      cover_url: "https://example.com/x.jpg",
    });
    expect(res.status).toBe(201);
    expect(res.body.cover_url).toBe("https://example.com/x.jpg");
  });

  it("is null when omitted", async () => {
    const res = await authPost("/api/posts").send({ title: "T", body: "b" });
    expect(res.body.cover_url).toBeNull();
  });

  it("rejects a non-http(s) cover_url with 400", async () => {
    const res = await authPost("/api/posts").send({
      title: "T",
      body: "b",
      cover_url: "javascript:alert(1)",
    });
    expect(res.status).toBe(400);
  });

  it("rejects a too-long cover_url with 400", async () => {
    const res = await authPost("/api/posts").send({
      title: "T",
      body: "b",
      cover_url: "https://e.com/" + "a".repeat(3000),
    });
    expect(res.status).toBe(400);
  });

  it("updates cover_url", async () => {
    const c = await authPost("/api/posts").send({ title: "T", body: "b" });
    const res = await authPut(`/api/posts/${c.body.id}`).send({
      title: "T",
      body: "b",
      cover_url: "https://example.com/new.png",
    });
    expect(res.body.cover_url).toBe("https://example.com/new.png");
  });
});

describe("GET /api/posts/:slug/related", () => {
  it("returns tag-related posts, most overlap first, excluding self", async () => {
    await authPost("/api/posts").send({ title: "Base", body: "b", tags: "a,b,c" });
    await authPost("/api/posts").send({ title: "Two shared", body: "b", tags: "a,b" });
    await authPost("/api/posts").send({ title: "One shared", body: "b", tags: "a" });
    await authPost("/api/posts").send({ title: "None", body: "b", tags: "x" });
    const res = await request(app).get("/api/posts/base/related");
    expect(res.status).toBe(200);
    expect(res.body.map((p) => p.title)).toEqual(["Two shared", "One shared"]);
  });

  it("returns an empty array when the post has no tags", async () => {
    await authPost("/api/posts").send({ title: "NoTags", body: "b" });
    const res = await request(app).get("/api/posts/notags/related");
    expect(res.body).toEqual([]);
  });

  it("returns 404 for an unknown slug", async () => {
    const res = await request(app).get("/api/posts/nope/related");
    expect(res.status).toBe(404);
  });

  it("returns at most 3", async () => {
    await authPost("/api/posts").send({ title: "B", body: "b", tags: "a,b,c,d" });
    for (const t of ["p1", "p2", "p3", "p4"]) {
      await authPost("/api/posts").send({ title: t, body: "b", tags: "a" });
    }
    const res = await request(app).get("/api/posts/b/related");
    expect(res.body.length).toBe(3);
  });
});
