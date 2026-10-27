const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const ts = require("typescript")

function load(relative, imports = {}) {
  const source = fs.readFileSync(path.join(__dirname, "..", relative), "utf8")
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const context = { exports: {}, process: { env: { NODE_ENV: "test" } }, console,
    require: (name) => imports[name] || {} }
  vm.runInNewContext(code, context)
  return context.exports
}

const urls = load("src/lib/util/journal-url.ts")
const articles = [
  { _type: "blog", title: "Article", slug: "on-wax-rooms-and-scent", category: "Spaces", image: "cover.jpg" },
  { _type: "blogTemplate1", title: "Notes", slug: "field-notes", category: "Field Notes", image: "notes.jpg" },
  { _type: "blog", title: "Older article", slug: "older-article", image: "older.jpg" },
]
const sanity = load("src/lib/sanity.ts", {
  "../sanity/lib/client": { client: { fetch: async () => articles } },
  "./util/journal-url": urls,
})

;(async () => {
  for (const [fetchArticles, argument] of [[sanity.getLatestJournalWithCoverSanity, 3], [sanity.getJournalBlogsSanity, {}]]) {
    const result = await fetchArticles(argument)
    assert.equal(result[0].href, "/journal/spaces/on-wax-rooms-and-scent")
    assert.equal(result[1].href, "/journal/field-notes/field-notes")
    assert.equal(result[2].href, "/journal/archive/older-article")
    for (const article of result) {
      assert.ok(article.href && !article.href.includes("undefined"))
      assert.equal(`/in${article.href}`, urls.getJournalPath(article.slug, article.category, "in"))
    }
  }
  assert.equal(articles[0].href, undefined, "Do not mutate cached CMS data")
  console.log("PASS homepage/journal article URLs: both templates, category slugs and missing-category fallback")
})().catch((error) => { console.error(error); process.exitCode = 1 })
