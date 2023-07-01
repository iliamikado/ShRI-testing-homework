describe('These pages should not be changed', async function() {

    // This tests are very unstable (and useless)

    // it('main page', async function({browser}) {
    //     const puppeteer = await browser.getPuppeteer();
    //     const [page] = await puppeteer.pages()

    //     await page.goto('http://localhost:3000/hw/store');
    //     await browser.pause(1000);
    //     await browser.assertView('plain', 'body')
    // });

    // it('delivery page', async function({browser}) {
    //     const puppeteer = await browser.getPuppeteer();
    //     const [page] = await puppeteer.pages()

    //     await page.goto('http://localhost:3000/hw/store/delivery');
    //     await browser.pause(1000);
    //     await browser.assertView('plain', 'body')
    // });

    it('contacts page', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages()

        await page.goto('http://localhost:3000/hw/contacts');
        await browser.pause(1000);
        await browser.assertView('plain', 'body')
    });
});
