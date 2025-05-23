const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const targets = [
    {
      url: "https://praktikum-radar.vercel.app/index.html",
      path: "vercel-abuse-package/screenshot_original.png",
    },
    {
      url: "https://praktikumsradar.vercel.app/homepage.html",
      path: "vercel-abuse-package/screenshot_infringing.png",
    },
  ];

  for (const t of targets) {
    console.log(`Taking screenshot of ${t.url}`);
    await page.goto(t.url, { waitUntil: "networkidle0" });
    await page.screenshot({ path: t.path, fullPage: true });
  }

  await browser.close();
})();
