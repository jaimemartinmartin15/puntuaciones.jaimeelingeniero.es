import { enterPlayerNames, takeScreenshot, enterScorePocha, getBrowserState, setupBrowserHooks, verifyUrl } from './utils';

const SCREENSHOTS_PATH = (fileName: string) => `./e2e/result-screenshots/pocha/${fileName}.png`;

describe('Pocha game', function () {
  setupBrowserHooks();

  it('should allow to play a game', async function () {
    const { page } = getBrowserState();

    // game config
    await verifyUrl('/configuracion');
    await enterPlayerNames(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
    await takeScreenshot(SCREENSHOTS_PATH('configuration'));

    // game started
    await page.locator('[data-test-id="btn-start"]').click();
    await verifyUrl('/ranking');
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 0'));

    /******************************************* ROUND 1 *******************************************/
    await enterScorePocha([5, -10, 5, 5]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 1'));

    // /******************************************* ROUND 2 *******************************************/
    await enterScorePocha([5, -20, 10, -10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 2'));

    /******************************************* ROUND 3 *******************************************/
    await enterScorePocha([5, -10, 5, 10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 3'));

    /******************************************* ROUND 4 *******************************************/
    await enterScorePocha([20, -10, 5, 10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 4'));

    /******************************************* ROUND 5 *******************************************/
    await enterScorePocha([5, 10, -20, -10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 5'));

    /******************************************* ROUND 6 *******************************************/
    await enterScorePocha([30, 5, -10, 20]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 6'));

    /******************************************* ROUND 7 *******************************************/
    await enterScorePocha([-10, 10, 5, 20]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 7'));

    /******************************************* ROUND 8 *******************************************/
    await enterScorePocha([-10, 20, -20, 10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 8'));

    /******************************************* ROUND 9 *******************************************/
    await enterScorePocha([20, 20, -10, 10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 9'));

    /******************************************* ROUND 10 *******************************************/
    await enterScorePocha([20, -20, 30, 20]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 10'));

    /******************************************* ROUND 11 *******************************************/
    await enterScorePocha([10, 20, -10, -10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 11'));

    /******************************************* ROUND 12 *******************************************/
    await enterScorePocha([40, -10, 20, -10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 12'));

    /******************************************* ROUND 13 *******************************************/
    await enterScorePocha([-10, -10, -10, 40]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 13'));

    /******************************************* ROUND 14 *******************************************/
    await enterScorePocha([5, -20, 20, 20]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 14'));

    /******************************************* ROUND 15 *******************************************/
    await enterScorePocha([10, -10, -10, -10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 15'));

    /******************************************* ROUND 16 *******************************************/
    await enterScorePocha([20, -10, -10, -10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 16'));

    /******************************************* ROUND 17 *******************************************/
    await enterScorePocha([10, -10, 10, -20]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 17'));

    /******************************************* ROUND 18 *******************************************/
    await enterScorePocha([5, 5, -20, -10]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 18'));

    /******************************************* ROUND 19 *******************************************/
    await enterScorePocha([-10, 5, -20, 5]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 19'));

    /******************************************* ROUND 20 *******************************************/
    await enterScorePocha([5, 20, 5, -20]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 20'));

    /******************************************* ROUND 21 *******************************************/
    await enterScorePocha([-20, 5, -10, 5]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 21'));

    /******************************************* ROUND 22 *******************************************/
    await enterScorePocha([-10, 5, 5, 5]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 22'));

    /******************************************* ROUND 23 *******************************************/
    await enterScorePocha([-10, 10, 5, 5]);
    await takeScreenshot(SCREENSHOTS_PATH('ranking round 23'));

    // change to scoreboard view
    await page.locator('[data-test-id="btn-change-view"]').click();
    await page.locator('[data-test-id="change-view-pop-up"] a:nth-child(2)').click();
    await verifyUrl('/tabla');
    await page.setViewport({ width: 570, height: 1000 });
    await takeScreenshot(SCREENSHOTS_PATH('scoreboard'));

    // change to statistics view
    await page.locator('[data-test-id="btn-change-view"]').click();
    await page.locator('[data-test-id="change-view-pop-up"] a:nth-child(3)').click();
    await verifyUrl('/estadisticas');
    await page.setViewport({ width: 500, height: 900 });
    await takeScreenshot(SCREENSHOTS_PATH('statistics'));
  }, 30000);
});
