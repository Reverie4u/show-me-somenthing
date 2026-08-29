const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORE = new Set(['node_modules', '.git', 'test-results', 'playwright-report']);

function htmlFiles() {
  const out = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (IGNORE.has(e.name)) continue;
        walk(path.join(dir, e.name));
      } else if (e.name.endsWith('.html')) {
        out.push(path.relative(ROOT, path.join(dir, e.name)));
      }
    }
  })(ROOT);
  return out.sort();
}

const PAGES = htmlFiles();

const ARROW_MAX_FONT = 14;   // 当前 .fl-arr 为 12px
const ARROW_MAX_HEIGHT = 40; // 正常高度 ≈ 12px×1.6 + 5px×2 ≈ 29px；仅拦截真正过大的箭头
const OVERLAP_TOLERANCE = 2; // 允许多少像素级的贴边误差

test.describe('静态页面布局检查', () => {
  for (const file of PAGES) {
    test(`${file} · 无重叠 / 无横向溢出 / 箭头不过大`, async ({ page }) => {
      await page.goto('/' + file, { waitUntil: 'networkidle' });

      // ① 无横向溢出
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflow, `${file} 出现横向溢出`).toBe(false);

      // ② 箭头尺寸
      const arrows = await page.locator('.fl-arr').evaluateAll((els) =>
        els.map((e) => ({
          fs: parseFloat(getComputedStyle(e).fontSize),
          h: e.getBoundingClientRect().height,
        })),
      );
      for (const a of arrows) {
        expect(a.fs, `${file}: 箭头字号 ${a.fs}px 过大`).toBeLessThanOrEqual(ARROW_MAX_FONT);
        expect(a.h, `${file}: 箭头高度 ${a.h}px 过大`).toBeLessThanOrEqual(ARROW_MAX_HEIGHT);
      }

      // ③ 块级元素重叠（排除 inline 元素与互为父子的包含关系，避免同行内联文本的误报）
      const overlaps = await page.evaluate((tol) => {
        const INLINE = /^(inline|inline-block|inline-flex|inline-grid)$/;
        const els = [...document.querySelectorAll('body *')].filter((e) => {
          const r = e.getBoundingClientRect();
          const cs = getComputedStyle(e);
          return (
            r.width > 0 &&
            r.height > 0 &&
            cs.display !== 'none' &&
            cs.visibility !== 'hidden' &&
            !INLINE.test(cs.display)
          );
        });
        const rects = els.map((el) => {
          const r = el.getBoundingClientRect();
          return { el, r };
        });
        // 用 DOM 祖先判断“嵌套”，避免 overflow-x:auto 裁剪后子元素矩形溢出被误判为重叠
        const contains = (a, b) => a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el);
        const label = (x) => `${x.el.tagName.toLowerCase()}#${[x.el.id, x.el.className].filter(Boolean).join('.')}`;
        const bad = [];
        for (let i = 0; i < rects.length; i++) {
          for (let j = i + 1; j < rects.length; j++) {
            const A = rects[i];
            const B = rects[j];
            if (contains(A, B) || contains(B, A)) continue;
            const ox = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left);
            const oy = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top);
            if (ox > tol && oy > tol) {
              const minArea = Math.min(A.r.width * A.r.height, B.r.width * B.r.height);
              if (ox * oy > Math.max(64, minArea * 0.05)) {
                bad.push(`${label(A)} ⊗ ${label(B)}`);
              }
            }
          }
        }
        return bad.slice(0, 10);
      }, OVERLAP_TOLERANCE);
      expect(overlaps, `${file} 存在重叠: ${overlaps.join(', ')}`).toEqual([]);
    });
  }
});

test.describe('视觉回归（可选）', () => {
  for (const file of PAGES) {
    test(`${file} · 截图对比`, async ({ page }) => {
      test.skip(process.env.VISUAL !== '1', '设置 VISUAL=1 运行；首次用 npm run visual:update 生成基线');
      await page.goto('/' + file, { waitUntil: 'networkidle' });
      await expect(page).toHaveScreenshot(`${file.replace(/\//g, '__')}.png`);
    });
  }
});
