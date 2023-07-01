const { bugId } = require('./bugId');

describe('hamburger menu', async function() {
    it('should have hamburger menu on small screen and it should work correctly', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages()

        await page.goto('http://localhost:3000/hw/store' + bugId);
        await page.setViewport({width: 574, height: 1200});
        const header = await page.waitForSelector('.navbar');
        await browser.assertView('closed', '.navbar');
        const hamburger = await header.waitForSelector('.navbar-toggler');
        await hamburger.click();
        await browser.pause(1000);
        await browser.assertView('opened', '.navbar', {ignoreElements: ['.nav-link:nth-of-type(4)']});
        await hamburger.click();
        await browser.pause(1000);
        await browser.assertView('closedAfterClickOnBurger', '.navbar');
        await hamburger.click();
        await browser.pause(1000);
        const navLink = await header.waitForSelector('.nav-link');
        await navLink.click();
        await browser.pause(1000);
        await browser.assertView('closedAfterClickOnLink', '.navbar');
    });
});
