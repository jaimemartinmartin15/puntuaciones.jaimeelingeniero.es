import * as puppeteer from 'puppeteer';
import { enterPlayerNames, takeScreenshot, enterScore, getBrowserState, setupBrowserHooks, verifyUrl } from './utils';

const SCREENSHOTS_PATH = (fileName: string) => `./e2e/result-screenshots/other-game/${fileName}.png`;

async function setConfigurationOtherGame(page: puppeteer.Page, winner: 'highest' | 'lowest') {
  await verifyUrl('/configuracion');
  await page.locator('[data-test-id="select-game-name"]').click();
  await page.locator('[data-test-id="game-name-option-Otro juego"]').click();
  await page.locator(`[data-test-id="option-winner-${winner}-score"]`).click();
  await enterPlayerNames(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  await page.locator('[data-test-id="dealing-player-icon-3"]').click();
  await takeScreenshot(SCREENSHOTS_PATH(`${winner} configuration`));
}

describe('Other game', function () {
  setupBrowserHooks();

  it('should allow to play a game (winner highest score)', async function () {
    const { page } = getBrowserState();

    await setConfigurationOtherGame(page, 'highest');

    // game started
    await page.locator('[data-test-id="btn-start"]').click();
    await verifyUrl('/ranking');
    await takeScreenshot(SCREENSHOTS_PATH('highest ranking round 0'));

    /******************************************* ROUND 1 *******************************************/
    await enterScore([3, 200, 50, 26]);
    await takeScreenshot(SCREENSHOTS_PATH('highest ranking round 1'));

    /******************************************* ROUND 2 *******************************************/
    await enterScore([100, -23, 4, 29]);
    await takeScreenshot(SCREENSHOTS_PATH('highest ranking round 2'));

    /******************************************* ROUND 3 *******************************************/
    await enterScore([74, 56, -2, 34]);
    await takeScreenshot(SCREENSHOTS_PATH('highest ranking round 3'));

    /******************************************* ROUND 4 *******************************************/
    await enterScore([-23, -4, 25, -7]);
    await takeScreenshot(SCREENSHOTS_PATH('highest ranking round 4'));

    // change to scoreboard view
    await page.locator('[data-test-id="btn-change-view"]').click();
    await page.locator('[data-test-id="change-view-pop-up"] a:nth-child(2)').click();
    await verifyUrl('/tabla');
    await page.setViewport({ width: 570, height: 650 });
    await takeScreenshot(SCREENSHOTS_PATH('highest scoreboard'));

    // change to statistics view
    await page.locator('[data-test-id="btn-change-view"]').click();
    await page.locator('[data-test-id="change-view-pop-up"] a:nth-child(3)').click();
    await verifyUrl('/estadisticas');
    await page.setViewport({ width: 500, height: 900 });
    await takeScreenshot(SCREENSHOTS_PATH('highest statistics'));
  }, 30000);

  it('should allow to play a game (winner lowest score)', async function () {
    const { page } = getBrowserState();

    await setConfigurationOtherGame(page, 'lowest');

    // game started
    await page.locator('[data-test-id="btn-start"]').click();
    await verifyUrl('/ranking');
    await takeScreenshot(SCREENSHOTS_PATH('lowest ranking round 0'));

    /******************************************* ROUND 1 *******************************************/
    await enterScore([3, 200, 50, 26]);
    await takeScreenshot(SCREENSHOTS_PATH('lowest ranking round 1'));

    /******************************************* ROUND 2 *******************************************/
    await enterScore([100, -23, 4, 29]);
    await takeScreenshot(SCREENSHOTS_PATH('lowest ranking round 2'));

    /******************************************* ROUND 3 *******************************************/
    await enterScore([74, 56, -2, 34]);
    await takeScreenshot(SCREENSHOTS_PATH('lowest ranking round 3'));

    /******************************************* ROUND 4 *******************************************/
    await enterScore([-23, -4, 25, -7]);
    await takeScreenshot(SCREENSHOTS_PATH('lowest ranking round 4'));

    // change to scoreboard view
    await page.locator('[data-test-id="btn-change-view"]').click();
    await page.locator('[data-test-id="change-view-pop-up"] a:nth-child(2)').click();
    await verifyUrl('/tabla');
    await page.setViewport({ width: 570, height: 650 });
    await takeScreenshot(SCREENSHOTS_PATH('lowest scoreboard'));

    // change to statistics view
    await page.locator('[data-test-id="btn-change-view"]').click();
    await page.locator('[data-test-id="change-view-pop-up"] a:nth-child(3)').click();
    await verifyUrl('/estadisticas');
    await page.setViewport({ width: 500, height: 900 });
    await takeScreenshot(SCREENSHOTS_PATH('lowest statistics'));
  }, 30000);
});
