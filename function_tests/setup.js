const puppeteer = require('puppeteer');
const { pageExtend } = require('puppeteer-jquery');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const baseContentPath = resolve(__dirname, './cases');
const htmlTemplateStart = readFileSync('./template/index-start.html').toString();
const htmlTemplateEnd = readFileSync('./template/index-end.html').toString();
const versions = require('./versions.json');
const frameworks = {};
versions.forEach(({ tag, path }) => (frameworks[tag] = readFileSync(`../src/dagger${ path }.js`).toString()));

const initialize = async (tag, contentPath, options, modules, routers) => browser.newPage().then(page => page.setContent(`${ htmlTemplateStart.replace('%OPTIONS%', options).replace('%MODULES%', modules).replace('%ROUTERS%', routers) }${ frameworks[tag] }${ htmlTemplateEnd.replace('%CONTENT%', readFileSync(contentPath)) }`) && page);

global.runner = (name, describe, it, dirName, callback, { contentPath = 'content.html', options = '{ integrity: false }', modules = '{}', routers = '{}' } = {}) => describe(name, () => versions.forEach(({ tag, desc }) => it(desc, () => initialize(tag, resolve(dirName, contentPath), options, modules, routers).then(page => {
    pageExtend(page);
    let promises = callback(page.jQuery.bind(page));
    Array.isArray(promises) || (promises = [promises]);
    return Promise.all(promises.map(promise => Object.is(typeof promise, 'function') ? promise() : promise)).then(() => page.close());
}))));

module.exports = () => puppeteer.launch({
    headless: true,
    /* args: [
        '–disable-gpu',
        '–disable-dev-shm-usage',
        '–disable-setuid-sandbox',
        '–no-first-run',
        '–no-sandbox',
        '–no-zygote',
        '–single-process'
    ] */
}).then(browser => (global.browser = browser));
