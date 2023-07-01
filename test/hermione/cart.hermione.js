const { node } = require('webpack');
const { bugId } = require('./bugId');
const { assert } = require('chai');

describe('cart', async function() {
    it('should add product in cart from catalog', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages()
        await page.goto('http://localhost:3000/hw/store/catalog/0' + bugId);
        await page.evaluate(() => {
            localStorage.clear();
        });

        const addToCart = await page.waitForSelector('.ProductDetails-AddToCart');
        await addToCart.click()
        const text = (await page.$eval('.nav-link:nth-of-type(4)', node => node.innerHTML));
        assert.equal(text, 'Cart (1)', 'cart count should be increased');
        await page.evaluate(() => {
            localStorage.clear();
        });
    });

    it('should save cart in localStorage', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages()
        await page.goto('http://localhost:3000/hw/store/catalog/0' + bugId);
        await page.evaluate(() => {
            localStorage.clear();
        });
        let addToCart = await page.waitForSelector('.ProductDetails-AddToCart');
        await addToCart.click()
        let text = (await page.$eval('.nav-link:nth-of-type(4)', node => node.innerHTML));
        if (text === 'Cart') {
            return;
        }
        await page.goto('http://localhost:3000/hw/store/catalog/0' + bugId);
        addToCart = await page.waitForSelector('.ProductDetails-AddToCart');
        text = (await page.$eval('.nav-link:nth-of-type(4)', node => node.innerHTML));
        assert.equal(text, 'Cart (1)', 'cart count should be the same');
        await page.evaluate(() => {
            localStorage.clear();
        });
    });

    it('should make checkout', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages()
        await page.goto('http://localhost:3000/hw/store/cart' + bugId);
        await page.evaluate(() => {
            localStorage.setItem('example-store-cart', '{"1":{"name":"Ergonomic Gloves","count":1,"price":113}}');
        });
        await page.goto('http://localhost:3000/hw/store/cart' + bugId);
        const nameInput = await page.waitForSelector('.Form-Field_type_name')
        const phoneInput = await page.waitForSelector('.Form-Field_type_phone')
        const addressInput = await page.waitForSelector('.Form-Field_type_address')
        const checkoutButton = await page.waitForSelector('.Form-Submit')
        await nameInput.type('John');
        await phoneInput.type('+71234567890');
        await addressInput.type('aba ba');
        await checkoutButton.click();
        await browser.pause(2000);
        const sended = !Boolean(await page.$('.Form-Submit'));
        if (sended) {
            return;
        }
        const errors = await Promise.all((await page.$$('.invalid-feedback')).map(inv => inv.boundingBox()));
        if (errors.filter(err => (err != null)).length === 0) {
            assert.fail('inputs were correct, but page did not changed');
        }
    });

    it('should check inputs correctly', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages()
        await page.goto('http://localhost:3000/hw/store/cart' + bugId);
        await page.evaluate(() => {
            localStorage.setItem('example-store-cart', '{"1":{"name":"Ergonomic Gloves","count":1,"price":113}}');
        });
        await page.goto('http://localhost:3000/hw/store/cart' + bugId);
        const nameInput = await page.waitForSelector('.Form-Field_type_name')
        const phoneInput = await page.waitForSelector('.Form-Field_type_phone')
        const addressInput = await page.waitForSelector('.Form-Field_type_address')
        const checkoutButton = await page.waitForSelector('.Form-Submit')
        await nameInput.type('John');
        await phoneInput.type('+71234567890');
        await addressInput.type('aba ba');
        await checkoutButton.click();
        await browser.pause(2000);
        const sended = !Boolean(await page.$('.Form-Submit'));
        if (sended) {
            return;
        }
        const errors = await Promise.all((await page.$$('.invalid-feedback')).map(inv => inv.boundingBox()));
        assert.isNull(errors[0], 'name was correct, but error happend');
        assert.isNull(errors[1], 'phone was correct, but error happend');
        assert.isNull(errors[2], 'address was correct, but error happend');
    });

    it('should show succesfull card', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages()
        await page.goto('http://localhost:3000/hw/store/cart' + bugId);
        await page.evaluate(() => {
            localStorage.setItem('example-store-cart', '{"1":{"name":"Ergonomic Gloves","count":1,"price":113}}');
        });
        await page.goto('http://localhost:3000/hw/store/cart' + bugId);
        const nameInput = await page.waitForSelector('.Form-Field_type_name')
        const phoneInput = await page.waitForSelector('.Form-Field_type_phone')
        const addressInput = await page.waitForSelector('.Form-Field_type_address')
        const checkoutButton = await page.waitForSelector('.Form-Submit')
        await nameInput.type('John');
        await phoneInput.type('+71234567890');
        await addressInput.type('aba ba');
        await checkoutButton.click();
        await browser.pause(2000);
        const sended = !Boolean(await page.$('.Form-Submit'));
        if (!sended) {
            return;
        }
        const successCard = await page.$eval('.Cart-SuccessMessage', node => ({
            classes: node.className,
        }))
        if (!successCard.classes.includes('alert-success')) {
            assert.fail('Successful card should have alert-success class');
        }
    });

    it('should show correct order number', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages()
        await page.goto('http://localhost:3000/hw/store/cart' + bugId);
        await page.evaluate(() => {
            localStorage.setItem('example-store-cart', '{"1":{"name":"Ergonomic Gloves","count":1,"price":113}}');
        });
        await page.goto('http://localhost:3000/hw/store/cart' + bugId);
        const nameInput = await page.waitForSelector('.Form-Field_type_name')
        const phoneInput = await page.waitForSelector('.Form-Field_type_phone')
        const addressInput = await page.waitForSelector('.Form-Field_type_address')
        const checkoutButton = await page.waitForSelector('.Form-Submit')
        await nameInput.type('John');
        await phoneInput.type('+71234567890');
        await addressInput.type('aba ba');
        await checkoutButton.click();
        await browser.pause(2000);
        const sended = !Boolean(await page.$('.Form-Submit'));
        if (!sended) {
            return;
        }
        const successCard = await page.$eval('.Cart-SuccessMessage', node => ({
            order: node.querySelector('.Cart-Number').innerHTML
        }))
        assert.isNumber(+successCard.order, 'Order number should be a number');
        if (+successCard.order > 100 || +successCard.order < 1) {
            assert.fail('order number has invalid value')
        }
    });

});
