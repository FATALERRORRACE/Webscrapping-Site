/**
 * Get the container where the products are being shown
 * @param {import("puppeteer").Page} page
 * @param { { containerSelector: string, shadowDomSelector?: string } } selectors
 * @returns {Promise<import("puppeteer").ElementHandle<HTMLElement>[]>}
 */
async function detectProductListContainer(
  page,
  { containerSelector, shadowDomSelector }
) {
  let documentContainer = await page.$('body');

  if (shadowDomSelector) {
    const shadowDomElement = await page.$(shadowDomSelector);
    await page.waitForFunction(
      (selector) => {
        // eslint-disable-next-line no-undef
        const element = document.querySelector(selector);
        return !!element.shadowRoot;
      },
      {},
      shadowDomSelector
    );
    documentContainer = await shadowDomElement.getProperty('shadowRoot');
  }

  const productContainer = documentContainer.$$(containerSelector);

  return productContainer;
}

module.exports = { detectProductListContainer };
