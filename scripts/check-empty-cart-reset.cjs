const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const code = ts.transpileModule(fs.readFileSync('src/lib/data/cart.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText

function setup(items) {
  let current = { id: 'old', region_id: 'in', items, shipping_methods: [{ data: { paymentMethod: 'COD', cod_fee: 100 } }] }
  let cookie = 'old', created = 0
  const cookies = {
    getCartId: async () => cookie,
    getAuthHeaders: async () => ({}),
    getCacheTag: async name => name,
    setCartId: async id => { cookie = id },
    removeCartId: async () => { cookie = null },
  }
  const sdk = {
    client: { fetch: async (url, options) => {
      if (options.method === 'DELETE') { current.items = current.items.filter(i => !url.endsWith('/' + i.id)); return {} }
      return { cart: current }
    } },
    store: { cart: { create: async () => {
      created++
      current = { id: 'fresh', region_id: 'in', items: [], shipping_methods: [] }
      return { cart: current }
    } } },
  }
  const exports = {}
  vm.runInNewContext(code, { exports, console, require: name => {
    if (name === '@lib/config') return { sdk }
    if (name === './cookies') return cookies
    if (name === './regions') return { getRegion: async () => ({ id: 'in' }) }
    if (name === 'next/cache') return { revalidateTag: () => {} }
    if (name === '@lib/util/medusa-error') return { default: error => { throw error } }
    return {}
  } })
  return { actions: exports, cookie: () => cookie, created: () => created }
}

;(async () => {
  const last = setup([{ id: 'one' }])
  await last.actions.deleteLineItem('one')
  assert.equal(last.cookie(), null, 'Last removal must detach old COD cart')
  const fresh = await last.actions.getOrSetCart('in')
  assert.equal(fresh.id, 'fresh')
  assert.equal(fresh.shipping_methods.length, 0)
  const partial = setup([{ id: 'one' }, { id: 'two' }])
  await partial.actions.deleteLineItem('one')
  assert.equal(partial.cookie(), 'old', 'Keep cart while other items remain')
  await partial.actions.getOrSetCart('in')
  assert.equal(partial.created(), 0)
  const legacy = setup([])
  assert.equal((await legacy.actions.getOrSetCart('in')).id, 'fresh', 'Previously emptied COD carts must also recover')
  console.log('Cart reset regression checks passed: empty, partial removal, legacy empty cart.')
})().catch(error => { console.error(error); process.exitCode = 1 })
