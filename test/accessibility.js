const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const axeCore = require('axe-core');

(async () => {
  const filePath = path.resolve(__dirname, '..', 'assets', 'index.html');
  const url = 'file://' + filePath;
  const outDir = path.resolve(__dirname, '..', 'accessibility-results');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const viewports = [
    { name: 'iphone-se', width: 375, height: 667 },
    { name: 'iphone-13', width: 390, height: 844 },
    { name: 'pixel-6', width: 412, height: 915 },
    { name: 'ipad-landscape', width: 1024, height: 768 },
    { name: 'desktop-1366', width: 1366, height: 768 }
  ];

  const browser = await chromium.launch();
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(url);
    // inject axe
    await page.addScriptTag({ content: axeCore.source });
    // run axe
    const results = await page.evaluate(async () => {
      return await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } });
    });
    const filename = `axe-${vp.name}.json`;
    fs.writeFileSync(path.join(outDir, filename), JSON.stringify(results, null, 2));
    // screenshot for visual inspection
    await page.screenshot({ path: path.join(outDir, `screenshot-${vp.name}.png`), fullPage: true });
    await context.close();
    console.log(`Saved results for ${vp.name}`);
  }
  await browser.close();
  console.log('Accessibility runs complete. Results in ./accessibility-results/');
})();
