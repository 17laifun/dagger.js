const puppeteer = require('puppeteer');
const { pageExtend } = require('puppeteer-jquery');
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const baseContentPath = resolve(__dirname, './cases');
const htmlTemplateStart = readFileSync('./template/index-start.html').toString();
const htmlTemplateEnd = readFileSync('./template/index-end.html').toString();
const versions = require('./versions.json');
const frameworks = {};
versions.forEach(({ tag, path }) => (frameworks[tag] = readFileSync(`../src/dagger${ path }.js`).toString()));

global.runner = (name, describe, it, dirName, callback, { contentPath = 'content.html', optionsPath = '', modulesPath = '', routersPath = '' } = {}) => describe(name, () => {
    const fullContentPath = resolve(dirName, contentPath), content = readFileSync(fullContentPath).toString().trim(), isEntireContent = content.startsWith('<html>') || content.startsWith('<!DOCTYPE ');
    return versions.forEach(({ tag, desc, path }) => it(desc, () => browser.newPage().then(page => (isEntireContent ? writeFileSync(fullContentPath, content.replace('%VERSION%', path)) || page.goto(`http://localhost:6688/${ dirName.replace(__dirname, '').replace(/\\/g, '/') }/${ contentPath }`) : page.setContent(`${ htmlTemplateStart.replace('%OPTIONS%', optionsPath ? readFileSync(resolve(dirName, optionsPath)) : '{}').replace('%MODULES%', modulesPath ? readFileSync(resolve(dirName, modulesPath)) : '{}').replace('%ROUTERS%', routersPath ? readFileSync(resolve(dirName, routersPath)) : '{}') }${ frameworks[tag] }${ htmlTemplateEnd.replace('%CONTENT%', content) }`)) && page).then(page => {
        pageExtend(page);
        let promises = callback(page.jQuery.bind(page), page);
        Array.isArray(promises) || (promises = [promises]);
        return Promise.all(promises.map(promise => Object.is(typeof promise, 'function') ? promise() : promise)).then(() => page.close());
    })));
});

module.exports = () => puppeteer.launch({
    headless: false,
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
