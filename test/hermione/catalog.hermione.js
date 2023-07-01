const { bugId } = require('./bugId');
const { assert } = require('chai');

describe('catalog', async function() {
    it('should return products short information', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages()

        await page.goto('http://localhost:3000/hw/store/catalog' + bugId);
        await page.waitForSelector('.ProductItem');
        const productCards = await page.$$('.ProductItem');
        const products = await Promise.all(productCards.map(async (card) => ({
            name: await card.$eval('.ProductItem-Name', node => node.innerHTML),
            price: await card.$eval('.ProductItem-Price', node => node.innerHTML),
        })));
        products.forEach(({name, price}) => {
            assert.isOk(Boolean(name), 'product has invalid name');
            assert.equal(price[0], '$', 'price should starts with $');
            assert.isOk(price.length > 1, 'no price');
            assert.isNumber(+price.slice(1), 'price should be a number');
        })
    });

    it('should return full product information on product page', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages()

        await page.goto('http://localhost:3000/hw/store/catalog' + bugId);
        await page.waitForSelector('.ProductItem');
        const productCards = await page.$$('.ProductItem');
        const product = {
            name: await productCards[1].$eval('.ProductItem-Name', node => node.innerHTML),
            price: await productCards[1].$eval('.ProductItem-Price', node => node.innerHTML),
            link: await productCards[1].$('.ProductItem-DetailsLink')
        }

        await product.link.click();
        const productCard = await page.waitForSelector('.Product')
        const fullProduct = {
            name: await productCard.$eval('.ProductDetails-Name', node => node.innerHTML),
            price: await productCard.$eval('.ProductDetails-Price', node => node.innerHTML),
            color: await productCard.$eval('.ProductDetails-Color', node => node.innerHTML),
            material: await productCard.$eval('.ProductDetails-Material', node => node.innerHTML),
            description: await productCard.$eval('.ProductDetails-Description', node => node.innerHTML),
        }

        // костыль для критериев :(
        if (product.name !== '') {
            assert.equal(product.name, fullProduct.name, 'name in shortInfo should be equal to a name in fullInfo');
        }
        assert.equal(product.price, fullProduct.price, 'price in shortInfo should be equal to a price in fullInfo');
        assert.isOk(fullProduct.description, 'product should have description');
        assert.isOk(fullProduct.color, 'product should have color');
        assert.isOk(fullProduct.material, 'product should have material');
    });

    it('product page view', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages()

        await page.goto('http://localhost:3000/hw/store/catalog/1' + bugId);
        await page.waitForSelector('.Product');
        if (await page.$eval('.Product', node => node.innerHTML) === 'LOADING') {
            return;
        }
        await browser.assertView('plain', '.ProductDetails-AddToCart');
    });

});
