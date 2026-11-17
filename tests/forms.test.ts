import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { POST as inquiry } from '@/app/api/inquiry/route';
import { POST as subscribe } from '@/app/api/subscribe/route';
import { POST as checkout } from '@/app/api/checkout/route';
import { cleanText, resetRateLimits } from '@/lib/form-guard';
import { sendArtistSms } from '@/lib/notify';

const TWILIO_ENV = {
  TWILIO_ACCOUNT_SID: 'AC_test',
  TWILIO_AUTH_TOKEN: 'test-token',
  TWILIO_FROM_NUMBER: '+15550000001',
  ARTIST_PHONE: '+15550000002',
};

type SentSms = { to: string; from: string; body: string };
let sent: SentSms[] = [];
let twilioStatus = 201;
const realFetch = globalThis.fetch;

function configureTwilio() {
  Object.assign(process.env, TWILIO_ENV);
}

function clearTwilio() {
  for (const key of Object.keys(TWILIO_ENV)) delete process.env[key];
}

function post(path: string, body: unknown, ip = '203.0.113.10'): Request {
  return new Request(`https://example.test${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  sent = [];
  twilioStatus = 201;
  resetRateLimits();
  configureTwilio();
  globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
    const params = new URLSearchParams(String(init?.body ?? ''));
    sent.push({ to: params.get('To') ?? '', from: params.get('From') ?? '', body: params.get('Body') ?? '' });
    return new Response('{}', { status: twilioStatus });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  clearTwilio();
});

const INQUIRY = { name: 'Ada Collector', email: 'ada@example.test', message: 'Is this still available?', artworkTitle: "Point d'Azur" };

describe('inquiry', () => {
  it('texts the artist the collector details and message', async () => {
    const res = await inquiry(post('/api/inquiry', { ...INQUIRY, phone: '+1 555 0100' }));
    assert.equal(res.status, 200);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].to, TWILIO_ENV.ARTIST_PHONE);
    assert.match(sent[0].body, /New inquiry/);
    assert.match(sent[0].body, /Artwork: Point d'Azur/);
    assert.match(sent[0].body, /Ada Collector <ada@example\.test>, \+1 555 0100/);
    assert.match(sent[0].body, /Is this still available\?/);
  });

  it('carries the offer subject from Make an Offer', async () => {
    const res = await inquiry(post('/api/inquiry', {
      name: 'Ada', email: 'ada@example.test', subject: 'Offer for "Point d\'Azur"', message: 'OFFER: $2000',
    }));
    assert.equal(res.status, 200);
    assert.match(sent[0].body, /Offer for "Point d'Azur"/);
    assert.match(sent[0].body, /OFFER: \$2000/);
  });

  it('rejects missing fields and bad email without sending anything', async () => {
    for (const body of [{}, { ...INQUIRY, name: '' }, { ...INQUIRY, message: '  ' }, { ...INQUIRY, email: 'nope' }, { ...INQUIRY, name: 42 }]) {
      const res = await inquiry(post('/api/inquiry', body));
      assert.equal(res.status, 400);
    }
    assert.equal(sent.length, 0);
  });

  it('reports failure instead of success when texts cannot be sent', async () => {
    clearTwilio();
    const unconfigured = await inquiry(post('/api/inquiry', INQUIRY));
    assert.equal(unconfigured.status, 503);
    assert.equal(sent.length, 0);

    configureTwilio();
    twilioStatus = 500;
    const failed = await inquiry(post('/api/inquiry', INQUIRY));
    assert.equal(failed.status, 503);
    assert.match((await failed.json()).error, /couldn't be sent/);
  });

  it('limits each visitor to five messages per ten minutes', async () => {
    for (let i = 0; i < 5; i++) assert.equal((await inquiry(post('/api/inquiry', INQUIRY))).status, 200);
    assert.equal((await inquiry(post('/api/inquiry', INQUIRY))).status, 429);
    assert.equal((await inquiry(post('/api/inquiry', INQUIRY, '198.51.100.7'))).status, 200);
    assert.equal(sent.length, 6);
  });
});

describe('subscribe', () => {
  it('texts the sign-up to the artist', async () => {
    const res = await subscribe(post('/api/subscribe', { email: 'fan@example.test' }));
    assert.equal(res.status, 200);
    assert.match(sent[0].body, /Mailing list sign-up[\s\S]*fan@example\.test/);
  });

  it('rejects an invalid email and reports a failed send', async () => {
    assert.equal((await subscribe(post('/api/subscribe', { email: 'x' }))).status, 400);
    clearTwilio();
    assert.equal((await subscribe(post('/api/subscribe', { email: 'fan@example.test' }))).status, 503);
    assert.equal(sent.length, 0);
  });
});

const BUYER = { name: 'Ben Buyer', email: 'ben@example.test', phone: '', message: 'Shipping to Lisbon' };

describe('purchase request', () => {
  it('uses catalog titles and prices, not what the browser sends', async () => {
    const res = await checkout(post('/api/checkout', {
      ...BUYER,
      items: [{ artwork: { id: 1, title: 'Fake title', price: 1, priceFormatted: '$1' } }],
      total: 1,
    }));
    assert.equal(res.status, 200);
    assert.equal(sent.length, 1);
    assert.match(sent[0].body, /Purchase request/);
    assert.match(sent[0].body, /- Point d'Azur \(\$2,400\)/);
    assert.match(sent[0].body, /Listed total: \$2,400/);
    assert.match(sent[0].body, /Ben Buyer <ben@example\.test>/);
    assert.match(sent[0].body, /Shipping to Lisbon/);
    assert.match(sent[0].body, /No payment has been taken/);
    assert.doesNotMatch(sent[0].body, /Fake title|\$1\b/);
  });

  it('refuses unknown or sold works', async () => {
    const unknown = await checkout(post('/api/checkout', { ...BUYER, items: [{ artwork: { id: 999999 } }] }));
    assert.equal(unknown.status, 400);
    const sold = await checkout(post('/api/checkout', { ...BUYER, items: [{ artwork: { id: 2 } }] }));
    assert.equal(sold.status, 409);
    assert.match((await sold.json()).error, /Garden at La Perdrix/);
    assert.equal(sent.length, 0);
  });

  it('requires the buyer name and a valid email', async () => {
    const items = [{ artwork: { id: 1 } }];
    assert.equal((await checkout(post('/api/checkout', { items }))).status, 400);
    assert.equal((await checkout(post('/api/checkout', { ...BUYER, email: 'bad', items }))).status, 400);
    assert.equal((await checkout(post('/api/checkout', { ...BUYER, items: [] }))).status, 400);
    assert.equal(sent.length, 0);
  });

  it('never reports success when the artist was not told', async () => {
    twilioStatus = 503;
    const res = await checkout(post('/api/checkout', { ...BUYER, items: [{ artwork: { id: 1 } }] }));
    assert.equal(res.status, 503);
  });
});

describe('helpers', () => {
  it('cleanText trims, strips control characters and enforces limits', () => {
    assert.equal(cleanText('  hi\u0000 there\u0007 ', 20), 'hi there');
    assert.equal(cleanText(undefined, 5), '');
    assert.equal(cleanText(12, 5), null);
    assert.equal(cleanText('toolong', 3), null);
  });

  it('keeps texts within Twilio limits', async () => {
    assert.equal(await sendArtistSms('x'.repeat(5000)), true);
    assert.equal(sent[0].body.length, 1500);
    assert.ok(sent[0].body.endsWith('…'));
  });
});
