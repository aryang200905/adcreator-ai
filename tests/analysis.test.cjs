/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS loader tests TypeScript without an extra runtime dependency. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const cache = new Map();
function load(file) {
  const filename = path.resolve(file);
  if (cache.has(filename)) return cache.get(filename).exports;
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const m = new Module(filename, module);
  m.filename = filename; m.paths = module.paths;
  const original = m.require.bind(m);
  m.require = id => id.startsWith('@/') ? load(`src/${id.slice(2)}.ts`) : id.startsWith('./') ? load(path.resolve(path.dirname(filename), `${id}.ts`)) : original(id);
  cache.set(filename, m); m._compile(compiled, filename); return m.exports;
}
const { analyzeScript, PLATFORMS, VOICES } = load('src/lib/adAnalyzer.ts');
const { isAnalysis } = load('src/lib/analysisSchema.ts');
const sample = 'Meet TrailCup. A reusable travel mug with a locking lid for your commute. Shop TrailCup for $24.';

test('rewrites keep the product, offer and action instead of advertising copywriting', () => {
  const review = analyzeScript(sample, 'tiktok', 'ugc-casual');
  assert.equal(review.rewrites.length, 3);
  for (const rewrite of review.rewrites) {
    const text = rewrite.parts.map(p => p.text).join(' ');
    assert.match(text, /TrailCup/); assert.match(text, /\$24/);
    assert.doesNotMatch(text, /leaking attention|algorithm quietly|every ad opening/);
  }
  assert.equal(isAnalysis(review), true);
  const software = analyzeScript('Ledger helps freelancers organize invoices. Start your 14-day trial.', 'linkedin', 'professional-b2b');
  assert.notDeepEqual(software.rewrites, review.rewrites);
  assert.match(JSON.stringify(software.rewrites), /Ledger/);
});
test('questions and proof are not inferred from unrelated words or discount numbers', () => {
  const result = analyzeScript('A new reusable cup. Which color suits you? Shop for 20% off.', 'tiktok', 'ugc-casual');
  assert.ok(!result.signals.includes('Question opening'));
  assert.ok(!result.signals.includes('Evidence claim detected — unverified'));
  assert.throws(() => analyzeScript(' ', 'tiktok', 'ugc-casual'));
});
test('all platform and voice combinations are valid, and platform feedback changes', () => {
  for (const platform of PLATFORMS) for (const voice of VOICES) {
    assert.ok(isAnalysis(analyzeScript(sample, platform.value, voice.value)));
  }
  assert.notDeepEqual(analyzeScript(sample, 'linkedin', 'ugc-casual').improvements, analyzeScript(sample, 'youtube-shorts', 'ugc-casual').improvements);
  assert.equal(isAnalysis({ rewrites: [] }), false);
});
test('AI endpoint rejects unauthorized, invalid, oversized and malformed responses; accepts validated output', async () => {
  const { POST } = load('src/app/api/analyze/route.ts');
  const previous = { ...process.env };
  const originalFetch = global.fetch;
  const request = (body, token = true) => new Request('http://localhost/api/analyze', { method: 'POST', headers: token ? { Authorization: 'Bearer test-token' } : {}, body: JSON.stringify(body) });
  const input = { script: sample, platform: 'tiktok', voice: 'ugc-casual' };
  let providerCalls = 0;
  try {
    delete process.env.OPENAI_API_KEY;
    assert.equal((await POST(request(input, false))).status, 401);
    const missing = await POST(request(input));
    assert.equal(missing.status, 503); assert.equal((await missing.json()).code, 'AI_NOT_CONFIGURED');
    process.env.OPENAI_API_KEY = 'test-only'; process.env.OPENAI_MODEL = 'test-model'; process.env.AI_ALLOWED_UIDS = 'test-user';
    assert.equal((await POST(request({ ...input, platform: 'made-up' }))).status, 400);
    assert.equal((await POST(request({ ...input, script: 'x'.repeat(41000) }))).status, 413);
    global.fetch = async () => new Response('{}', { status: 401 });
    assert.equal((await POST(request(input))).status, 401);
    global.fetch = async url => {
      assert.match(url, /identitytoolkit/);
      return Response.json({ users: [{ localId: 'not-allowed' }] });
    };
    assert.equal((await POST(request(input))).status, 403);
    global.fetch = async (url, options) => {
      if (url.includes('identitytoolkit')) return Response.json({ users: [{ localId: 'test-user' }] });
      providerCalls++;
      const sent = JSON.parse(options.body);
      assert.equal(sent.store, false); assert.equal(sent.input, sample);
      return Response.json({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(analyzeScript(sample, 'tiktok', 'ugc-casual')) }] }] });
    };
    assert.equal((await POST(request(input))).status, 200);
    global.fetch = async url => url.includes('identitytoolkit') ? Response.json({ users: [{ localId: 'test-user' }] }) : Response.json({ status: 'completed', output: [] });
    assert.equal((await POST(request(input))).status, 502);
    for (let i = 0; i < 3; i++) assert.equal((await POST(request(input))).status, 502);
    assert.equal((await POST(request(input))).status, 429);
    assert.equal(providerCalls, 1);
  } finally {
    global.fetch = originalFetch;
    for (const key of ['OPENAI_API_KEY', 'OPENAI_MODEL', 'AI_ALLOWED_UIDS']) {
      if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key];
    }
  }
});
