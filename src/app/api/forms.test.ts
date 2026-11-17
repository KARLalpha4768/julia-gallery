import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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
    expect(res.status).toBe(200);
    expect(sent.length).toBe(1);
    expect(sent[0].to).toBe(TWILIO_ENV.ARTIST_PHONE);
    expect(sent[0].body).toMatch(/New inquiry/);
    expect(sent[0].body).toMatch(/Artwork: Point d'Azur/);
    expect(sent[0].body).toMatch(/Ada Collector <ada@example\.test>, \+1 555 0100/);
    expect(sent[0].body).toMatch(/Is this still available\?/);
  });

  it('carries the offer subject from Make an Offer', async () => {
    const res = await inquiry(post('/api/inquiry', {
      name: 'Ada', email: 'ada@example.test', subject: 'Offer for "Point d\'Azur"', message: 'OFFER: $2000',
    }));
    expect(res.status).toBe(200);
    expect(sent[0].body).toMatch(/Offer for "Point d'Azur"/);
    expect(sent[0].body).toMatch(/OFFER: \$2000/);
  });

  it('rejects missing fields and bad email without sending anything', async () => {
    for (const body of [{}, { ...INQUIRY, name: '' }, { ...INQUIRY, message: '  ' }, { ...INQUIRY, email: 'nope' }, { ...INQUIRY, name: 42 }]) {
      const res = await inquiry(post('/api/inquiry', body));
      expect(res.status).toBe(400);
    }
    expect(sent.length).toBe(0);
  });

  it('reports failure instead of success when texts cannot be sent', async () => {
    clearTwilio();
    const unconfigured = await inquiry(post('/api/inquiry', INQUIRY));
    expect(unconfigured.status).toBe(503);
    expect(sent.length).toBe(0);

    configureTwilio();
    twilioStatus = 500;
    const failed = await inquiry(post('/api/inquiry', INQUIRY));
    expect(failed.status).toBe(503);
    expect((await failed.json()).error).toMatch(/couldn't be sent/);
  });

  it('limits each visitor to five messages per ten minutes', async () => {
    for (let i = 0; i < 5; i++) expect((await inquiry(post('/api/inquiry', INQUIRY))).status).toBe(200);
    expect((await inquiry(post('/api/inquiry', INQUIRY))).status).toBe(429);
    expect((await inquiry(post('/api/inquiry', INQUIRY, '198.51.100.7'))).status).toBe(200);
    expect(sent.length).toBe(6);
  });
});

describe('subscribe', () => {
  it('texts the sign-up to the artist', async () => {
    const res = await subscribe(post('/api/subscribe', { email: 'fan@example.test' }));
    expect(res.status).toBe(200);
    expect(sent[0].body).toMatch(/Mailing list sign-up[\s\S]*fan@example\.test/);
  });

  it('rejects an invalid email and reports a failed send', async () => {
    expect((await subscribe(post('/api/subscribe', { email: 'x' }))).status).toBe(400);
    clearTwilio();
    expect((await subscribe(post('/api/subscribe', { email: 'fan@example.test' }))).status).toBe(503);
    expect(sent.length).toBe(0);
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
    expect(res.status).toBe(200);
    expect(sent.length).toBe(1);
    expect(sent[0].body).toMatch(/Purchase request/);
    expect(sent[0].body).toMatch(/- Point d'Azur \(\$2,400\)/);
    expect(sent[0].body).toMatch(/Listed total: \$2,400/);
    expect(sent[0].body).toMatch(/Ben Buyer <ben@example\.test>/);
    expect(sent[0].body).toMatch(/Shipping to Lisbon/);
    expect(sent[0].body).toMatch(/No payment has been taken/);
    expect(sent[0].body).not.toMatch(/Fake title|\$1\b/);
  });

  it('refuses unknown or sold works', async () => {
    const unknown = await checkout(post('/api/checkout', { ...BUYER, items: [{ artwork: { id: 999999 } }] }));
    expect(unknown.status).toBe(400);
    const sold = await checkout(post('/api/checkout', { ...BUYER, items: [{ artwork: { id: 2 } }] }));
    expect(sold.status).toBe(409);
    expect((await sold.json()).error).toMatch(/Garden at La Perdrix/);
    expect(sent.length).toBe(0);
  });

  it('requires the buyer name and a valid email', async () => {
    const items = [{ artwork: { id: 1 } }];
    expect((await checkout(post('/api/checkout', { items }))).status).toBe(400);
    expect((await checkout(post('/api/checkout', { ...BUYER, email: 'bad', items }))).status).toBe(400);
    expect((await checkout(post('/api/checkout', { ...BUYER, items: [] }))).status).toBe(400);
    expect(sent.length).toBe(0);
  });

  it('never reports success when the artist was not told', async () => {
    twilioStatus = 503;
    const res = await checkout(post('/api/checkout', { ...BUYER, items: [{ artwork: { id: 1 } }] }));
    expect(res.status).toBe(503);
  });
});

describe('helpers', () => {
  it('cleanText trims, strips control characters and enforces limits', () => {
    expect(cleanText('  hi\u0000 there\u0007 ', 20)).toBe('hi there');
    expect(cleanText(undefined, 5)).toBe('');
    expect(cleanText(12, 5)).toBe(null);
    expect(cleanText('toolong', 3)).toBe(null);
  });

  it('keeps texts within Twilio limits', async () => {
    expect(await sendArtistSms('x'.repeat(5000))).toBe(true);
    expect(sent[0].body.length).toBe(1500);
    expect(sent[0].body.endsWith('…')).toBe(true);
  });
});
