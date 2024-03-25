import { enterScoreBrisca, enterTeamAndPlayerNames, getBrowserState, setupBrowserHooks, takeScreenshot, verifyUrl } from './utils';

const SCREENSHOTS_PATH = (fileName: string) => `./e2e/screenshots/e2e-results/brisca-${fileName}.png`;

describe('Brisca game', function () {
  setupBrowserHooks();

  it('should allow to play a game', async function () {
    const { page } = getBrowserState();

    // game config
    await verifyUrl('/configuracion');
    await page.locator('[data-test-id="select-game-name"]').click();
    await page.locator('[data-test-id="game-name-option-Brisca"]').click();
    await enterTeamAndPlayerNames(['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'], ['Us', 'Them']);
    await takeScreenshot(SCREENSHOTS_PATH('configuration'));

    // game started
    await page.locator('[data-test-id="btn-start"]').click();
    await verifyUrl('/brisca');
    await takeScreenshot(SCREENSHOTS_PATH('round-0'));

    /******************************************* ROUND 1 *******************************************/
    await enterScoreBrisca(0);
    await takeScreenshot(SCREENSHOTS_PATH('round-1'));

    /******************************************* ROUND 2 *******************************************/
    await enterScoreBrisca(0);
    await takeScreenshot(SCREENSHOTS_PATH('round-2'));

    /******************************************* ROUND 3 *******************************************/
    await enterScoreBrisca(0);
    await takeScreenshot(SCREENSHOTS_PATH('round-3'));

    /******************************************* ROUND 4 *******************************************/
    await enterScoreBrisca(0);
    await takeScreenshot(SCREENSHOTS_PATH('round-4'));

    /******************************************* ROUND 5 *******************************************/
    await enterScoreBrisca(1);
    await takeScreenshot(SCREENSHOTS_PATH('round-5'));

    /******************************************* ROUND 6 *******************************************/
    await enterScoreBrisca(1);
    await takeScreenshot(SCREENSHOTS_PATH('round-6'));

    /******************************************* ROUND 7 *******************************************/
    await enterScoreBrisca(0);
    await takeScreenshot(SCREENSHOTS_PATH('round-7'));

    /******************************************* ROUND 8 *******************************************/
    await enterScoreBrisca(0);
    await takeScreenshot(SCREENSHOTS_PATH('round-8'));

    /**************************************** REMOVE SCORE  ****************************************/
    await page.locator('[data-test-id="player-container"]').click();
    await page.locator('[data-test-id="player-container"]').click();
    await page.locator('[data-test-id="player-container"]').click();
    await takeScreenshot(SCREENSHOTS_PATH('delete-point-1'));
    await page.locator('[data-test-id="player-container"]').click();
    await page.locator('[data-test-id="player-container"]').click();
    await takeScreenshot(SCREENSHOTS_PATH('delete-point-2'));

    /**************************************** CLOSE BANNER  ****************************************/
    await page.locator('[data-test-id="close-button"]').click();
    await takeScreenshot(SCREENSHOTS_PATH('close-banner'));
  }, 30000);
});
