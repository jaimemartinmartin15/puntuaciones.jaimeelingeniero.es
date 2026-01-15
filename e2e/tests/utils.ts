import * as puppeteer from 'puppeteer';

const baseUrl = process.env['baseUrl'] ?? 'http://localhost:4200/';
let browser: puppeteer.Browser;
let page: puppeteer.Page;

export function setupBrowserHooks(path = ''): void {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 360, height: 657 });
    await page.goto(`${baseUrl}${path}`);
  });

  afterEach(async () => {
    await page.evaluate(() => localStorage.clear());
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });
}

export function getBrowserState(): {
  browser: puppeteer.Browser;
  page: puppeteer.Page;
  baseUrl: string;
} {
  if (!browser) {
    throw new Error('No browser state found! Ensure `setupBrowserHooks()` is called.');
  }
  return {
    browser,
    page,
    baseUrl,
  };
}

export async function enterScorePocha(scores: number[]) {
  await page.locator('[data-test-id="btn-new-round"]').click();

  for (let score of scores) {
    await page.locator(`[data-test-id="kb-btn-${score}"]`).click();
    await page.locator('[data-test-id="kb-btn-next"]').click();
  }
}

export async function enterScore(scores: number[]) {
  await page.locator('[data-test-id="btn-new-round"]').click();

  for (let score of scores) {
    const digits = score.toString().split('');
    for (let digit of digits) {
      if (digit === '-') {
        await page.locator(`[data-test-id="kb-btn-sign"]`).click();
      } else {
        await page.locator(`[data-test-id="kb-btn-${digit}"]`).click();
      }
    }
    await page.locator('[data-test-id="kb-btn-next"]').click();
  }
}

export async function enterScoreBrisca(teamIndex: number) {
  await page.locator('[data-test-id="btn-new-round"]').click();
  await page.locator(`[data-test-id="player-${teamIndex}"]`).click();
}

export async function enterPlayerNames(names: string[]) {
  for (let i = 0; i < names.length; i++) {
    await page.type(`[data-test-id="player-input-${i}"]`, names[i]);
  }
}

export async function enterTeamAndPlayerNames(names: string[], teams: string[]) {
  for (let team = 0; team < teams.length; team++) {
    // selects all text so it is overrided when typing next
    await page.locator(`[data-test-id="team-${team}"] [data-test-id="input-team-name"]`).click({ clickCount: 3 });
    await page.type(`[data-test-id="team-${team}"] [data-test-id="input-team-name"]`, teams[team]);

    for (let name = 0; name < names.length / teams.length; name++) {
      await page.type(`[data-test-id="team-${team}"] [data-test-id="player-input-${name}"]`, names[team * (names.length / teams.length) + name]);
    }
  }
}

export async function verifyUrl(pathname: string) {
  let url = await page.url();
  expect(new URL(url).pathname).toBe(pathname);
}

export async function takeScreenshot(path: string) {
  await page.screenshot({ path });
}
