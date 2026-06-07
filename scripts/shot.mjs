import { chromium } from "playwright-core";

const base = "http://localhost:6007/iframe.html?id=pages-reservations--default&viewMode=story";
const browser = await chromium.launch();

async function shot(name, { dark = false, action } = {}) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(base, { waitUntil: "networkidle" });
    if (dark) await page.evaluate(() => document.documentElement.classList.add("dark-mode"));
    await page.waitForTimeout(800);
    if (action) await action(page);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `/tmp/${name}.png` });
    if (errors.length) console.log(`[${name}] CONSOLE ERRORS:\n` + errors.join("\n"));
    console.log("saved /tmp/" + name + ".png");
    await page.close();
}

await shot("res-dark", { dark: true });
await shot("res-filter", {
    action: async (page) => {
        await page.getByRole("button", { name: /add filter/i }).click();
        await page.waitForTimeout(600);
    },
});
await shot("res-select", {
    action: async (page) => {
        // select header checkbox (first checkbox) to trigger bulk bar
        const cb = page.locator('input[type="checkbox"], [role="checkbox"]').first();
        await cb.click().catch(() => {});
        await page.waitForTimeout(400);
    },
});

await browser.close();
