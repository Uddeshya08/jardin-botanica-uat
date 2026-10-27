const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const ts = require("typescript")

const source = fs.readFileSync(path.join(__dirname, "../src/lib/hooks/use-sequential-carousel.ts"), "utf8")
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText

function harness(states = ["ready", "ready", "ready", "ready"]) {
  let now = 0, timerId = 0, group = 0, refIndex = 0, effectIndex = 0
  let alternate = new Set()
  const timers = new Map(), refs = [], effects = [], callbacks = new Map(), events = new Map()
  const changes = [], scrolls = []
  let observer
  const rectangle = (left = 0, width = 100) => ({ left, right: left + width, top: 0, bottom: 100, width, height: 100 })
  const slides = states.map((_, index) => ({
    getBoundingClientRect: () => rectangle((index - group * 2) * 100),
    querySelector: () => ({ dataset: { carouselMediaState: states[index] }, getBoundingClientRect: () => rectangle() }),
  }))
  const api = {
    rootNode: () => ({ getBoundingClientRect: () => rectangle(0, 200) }),
    slideNodes: () => slides,
    selectedScrollSnap: () => group,
    scrollSnapList: () => [0, 1],
    canScrollNext: () => group === 0,
    scrollTo: (index) => { scrolls.push(index); callbacks.get("select")(); group = index; callbacks.get("settle")() },
    on: (event, callback) => callbacks.set(event, callback),
    off: (event) => callbacks.delete(event),
  }
  const listeners = {
    addEventListener: (name, callback) => events.set(name, callback),
    removeEventListener: (name) => events.delete(name),
  }
  const react = {
    useState: () => [alternate, (updater) => {
      const next = typeof updater === "function" ? updater(alternate) : updater
      const before = Array.from(alternate).sort().join(","), after = Array.from(next).sort().join(",")
      alternate = next
      if (before !== after) changes.push({ at: now, indices: Array.from(next) })
    }],
    useRef: (value) => refs[refIndex++] ||= { current: value },
    useEffect: (callback, deps) => {
      const index = effectIndex++, previous = effects[index]
      if (!previous || deps.some((value, i) => value !== previous.deps[i])) {
        previous?.cleanup?.()
        effects[index] = { deps, pending: callback }
      }
    },
  }
  const context = {
    exports: {}, require: () => react,
    setTimeout: (callback, delay) => { timers.set(++timerId, { callback, at: now + delay }); return timerId },
    clearTimeout: (id) => timers.delete(id),
    window: { ...listeners, innerHeight: 1000, matchMedia: () => ({ ...listeners, matches: false }) },
    document: { ...listeners, hidden: false },
    IntersectionObserver: class { constructor(callback) { observer = callback } observe() {} disconnect() {} },
  }
  vm.runInNewContext(code, context)
  const render = (paused = false) => {
    refIndex = effectIndex = 0
    context.exports.useSequentialCarousel(api, states.length, true, paused)
    for (const effect of effects) if (effect.pending) {
      const callback = effect.pending; effect.pending = undefined; effect.cleanup = callback()
    }
  }
  const advance = (duration) => {
    const until = now + duration
    for (let guard = 0; guard < 10000; guard++) {
      const next = Array.from(timers.entries()).sort((a, b) => a[1].at - b[1].at)[0]
      if (!next || next[1].at > until) break
      timers.delete(next[0]); now = next[1].at; next[1].callback()
    }
    now = until
  }
  render()
  observer([{ isIntersecting: true }])
  return { states, changes, scrolls, advance, render, callbacks, observer, timers,
    indices: () => Array.from(alternate), cleanup: () => effects.forEach((effect) => effect.cleanup?.()) }
}

const slow = harness(["loading", "ready", "ready", "ready"])
slow.advance(5000)
assert.equal(slow.changes.length, 0, "Wait for first image instead of skipping or showing unloaded media")
slow.states[0] = "ready"
slow.advance(200)
assert.deepEqual(slow.indices(), [0])
slow.callbacks.get("reInit")()
assert.deepEqual(slow.indices(), [0], "Image resize must not reset already changed cards")
slow.advance(1000)
assert.deepEqual(slow.indices(), [0, 1], "Reinitialization must continue at next card")
assert.equal(slow.scrolls.length, 0, "Wait until second image finishes before scrolling")
slow.advance(2700)
assert.deepEqual(slow.scrolls, [1])
slow.advance(1000)
assert.deepEqual(slow.indices(), [2], "Next group starts with its first card")
slow.cleanup()
assert.equal(slow.timers.size, 0)

const paused = harness()
paused.advance(1000)
paused.render(true)
paused.advance(10000)
assert.deepEqual(paused.indices(), [0])
paused.render(false)
paused.advance(1000)
assert.deepEqual(paused.indices(), [0, 1], "Hover pause resumes cursor without restarting first card")
paused.cleanup()

const failed = harness(["unavailable", "ready", "ready", "ready"])
failed.advance(1000)
assert.deepEqual(failed.indices(), [1], "Failed media must not block remaining products")
failed.cleanup()
console.log("PASS product image sequence: loading, resize, ordered groups, pause/resume, failed images and cleanup")
