import { enterPlayerNames, takeScreenshot, enterScore, getBrowserState, setupBrowserHooks, verifyUrl } from './utils';

const SCREENSHOTS_PATH = (fileName: string) => `./e2e/screenshots/e2e-results/chinchon-${fileName}.png`;

describe('Chinchón game', function () {
  setupBrowserHooks();

  it('should allow to play a game', async function () {
    const { page } = getBrowserState();

    // game config
    await verifyUrl('/configuracion');
    await page.locator('[data-test-id="select-game-name"]').click();
    await page.locator('[data-test-id="game-name-option-Chinchón"]').click();
    await enterPlayerNames(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
    await page.locator('[data-test-id="dealing-player-icon-2"]').click();
    await takeScreenshot(SCREENSHOTS_PATH('configuration'));

    // game started
    await page.locator('[data-test-id="btn-start"]').click();
    await verifyUrl('/ranking');
    await takeScreenshot(SCREENSHOTS_PATH('ranking-round-0'));

    /******************************************* ROUND 1 *******************************************/
    await enterScore([2, 23, 12, 22]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking-round-1'));

    /******************************************* ROUND 2 *******************************************/
    await enterScore([26, 1, -10, 5]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking-round-2'));

    /******************************************* ROUND 3 *******************************************/
    await enterScore([26, 32, 1, 2]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking-round-3'));

    /******************************************* ROUND 4 *******************************************/
    await enterScore([50, 56, 20, 3]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking-round-4'));

    /******************************************* ROUND 5 *******************************************/
    await enterScore([15, 29, 2, 32]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking-round-5'));

    /******************************************* ROUND 6 *******************************************/
    await enterScore([53, 12, 3, 10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking-round-6'));

    /******************************************* ROUND 7 *******************************************/
    await enterScore([16, 16, 24, 18]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking-round-7'));

    /******************************************* ROUND 8 *******************************************/
    await enterScore([3, -10, 34, 9]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking-round-8'));

    /******************************************* ROUND 9 *******************************************/
    await enterScore([15, 3, 15, 16]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking-round-9'));

    // change to scoreboard view
    await page.locator('[data-test-id="btn-change-view"]').click();
    await page.locator('[data-test-id="change-view-pop-up"] a:nth-child(2)').click();
    await verifyUrl('/tabla');
    await page.setViewport({ width: 570, height: 650 });
    await takeScreenshot(SCREENSHOTS_PATH('scoreboard'));

    // change to statistics view
    await page.locator('[data-test-id="btn-change-view"]').click();
    await page.locator('[data-test-id="change-view-pop-up"] a:nth-child(3)').click();
    await verifyUrl('/estadisticas');
    await page.setViewport({ width: 500, height: 900 });
    await takeScreenshot(SCREENSHOTS_PATH('statistics'));
  }, 30000);
});
