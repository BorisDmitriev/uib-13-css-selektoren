const puppeteer = require("puppeteer");
const path = require('path');

const browserOptions = {
    headless: true,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
    devtools: false,
}
let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try { 
        this.puppeteer.close(); 
    } catch (e) 
    {} 
    done();
});

describe("Selectors", () => {
    it("All H3 elements should be blue", async () => {
        const h3 = await page.$eval('h3', el => getComputedStyle(el).color);
        expect(h3).toBe('rgb(0, 0, 255)'); // blue
    });

    it('The items "Item 3, Item 5" should have a class name and color set to red', async () => {
        
        const item3 = await page.evaluate(() => {
            // get element contain text "Item 3" in lower case have a class attribute and not have a style attribute and have no id attribute
            const item3Elm = Array.from(document.querySelectorAll('li')).find(elm => elm.textContent.toLowerCase() === 'item 3' && elm.hasAttribute('class') && !elm.hasAttribute('style') && !elm.hasAttribute('id'));
            return window.getComputedStyle(item3Elm).color;
        });
        
        const item5 = await page.evaluate(() => {
            // get element contain text "Item 5" in lower case have a class attribute and not have a style attribute
            const item5Elm = Array.from(document.querySelectorAll('li')).find(elm => elm.textContent.toLowerCase() === 'item 5' && elm.hasAttribute('class') && !elm.hasAttribute('style') && !elm.hasAttribute('id'));
            return window.getComputedStyle(item5Elm).color;
        })
        // check if the color of item 3 is red
        expect(item5).toBe('rgb(255, 0, 0)');
        expect(item3).toBe('rgb(255, 0, 0)');
    });

    it("Task5(this) item Should be assigned an 'Id' and its color should be changed", async () => {
        const task5 = await page.$eval('ul li:nth-child(5)', el => getComputedStyle(el).color);
        expect(task5).not.toBe('rgb(0, 0, 0)'); // black
        const task5Id = await page.$eval('ul li:nth-child(5)', el => el.id);
        expect(task5Id).not.toBe('');
        expect(task5Id).toBeTruthy();

    });
    it("Images should be selected using a 'combinator' and given a border", async () => {
        const imageBorder = await page.$eval('img + img', el => getComputedStyle(el).borderStyle);
        // get the image that has a class attribute
        const imageClass = await page.evaluate(() => {
            const imageClassElm = Array.from(document.querySelectorAll('img')).find(elm => elm.className);
            return imageClassElm;
        });
         // get image that has style attribute
         const imageStyle = await page.$x('//img[@style]');
        // expect image style attribute to be not defined
        expect(imageStyle.toString()).toBe('');
        expect(imageClass).toBeUndefined(); // The class attribute should not be set
        expect(imageBorder).not.toBe('none');
    });
    it("The link ending with '.com' should be given a background-color of yellow", async () => {
        const link = await page.evaluate(() => {
            const linkElm = Array.from(document.querySelectorAll('a')).find(elm => elm.href.endsWith('.com') && !elm.hasAttribute('class') && !elm.hasAttribute('style') && !elm.hasAttribute('id'));
            return window.getComputedStyle(linkElm).backgroundColor;
        })
        expect(link).toBe('rgb(255, 255, 0)'); // yellow
    });


});

