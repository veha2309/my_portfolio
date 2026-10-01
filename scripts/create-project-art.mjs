// Original, deliberately labeled illustrations. Public demos require authentication.
// These SVGs are representative compositions, never claimed to be app screenshots.
import { writeFileSync, mkdirSync } from "node:fs";

const out = new URL("../public/images/projects/", import.meta.url);
mkdirSync(out, { recursive: true });
const colors = {
  bg: "#111714",
  panel: "#1a211d",
  edge: "#344137",
  text: "#eeeee4",
  muted: "#899b8d",
  green: "#b1c4a3",
};
const rect = (x, y, w, h, fill, r = 0, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const text = (x, y, value, size = 14, fill = colors.text, extra = "") =>
  `<text x="${x}" y="${y}" ${extra.includes("font-family=") ? "" : 'font-family="Arial, sans-serif"'} font-size="${size}" fill="${fill}" ${extra}>${value}</text>`;
const line = (x1, y1, x2, y2, stroke = colors.edge) =>
  `<path d="M${x1} ${y1}H${x2}V${y2}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
const pill = (x, y, label) =>
  rect(x, y, 80, 25, "#28332b", 12) +
  text(x + 14, y + 17, label, 9, colors.green);
const shell = (title, bg, content) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700" role="img"><title>${title} — product illustration</title><defs><linearGradient id="back" x2="1" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="${bg}" stop-opacity=".65"/></linearGradient><filter id="shadow" x="-35%" y="-35%" width="170%" height="190%"><feDropShadow dx="0" dy="25" stdDeviation="22" flood-opacity=".22"/></filter></defs>${rect(0, 0, 1000, 700, bg)}${rect(0, 0, 1000, 700, "url(#back)")}<circle cx="870" cy="90" r="330" fill="none" stroke="#ffffff" stroke-opacity=".1"/><circle cx="870" cy="90" r="420" fill="none" stroke="#ffffff" stroke-opacity=".07"/>${content}</svg>`;

function dashboard(title, stock = false) {
  let s = `<g filter="url(#shadow)">${rect(74, 88, 852, 524, colors.bg, 10, 'stroke="#46544b" stroke-width="1"')}`;
  s += rect(74, 88, 852, 37, "#202a23", 10) + rect(74, 116, 852, 9, "#202a23");
  for (let i = 0; i < 3; i++)
    s += `<circle cx="${94 + i * 13}" cy="107" r="3" fill="#67786a"/>`;
  s += text(440, 111, `${title.toLowerCase()}.app`, 9, "#9fad9f");
  s += line(230, 125, 230, 612, "#29332b");
  s += text(98, 161, title, 17, "#e1e8db", 'font-weight="600"');
  s += text(98, 207, "WORKSPACE", 8, colors.muted, 'letter-spacing="1.5"');
  s +=
    rect(89, 223, 126, 31, "#2a382d", 5) +
    text(105, 244, "Overview", 10, colors.green);
  [
    "Transactions",
    stock ? "Watchlist" : "Accounts",
    stock ? "Positions" : "Insights",
    "Settings",
  ].forEach((v, i) => {
    s += text(105, 279 + i * 34, v, 10, colors.muted);
  });
  s +=
    `<circle cx="109" cy="579" r="12" fill="#c2ae88"/>` +
    text(103, 582, "VS", 8, "#17221a") +
    text(132, 582, "My workspace", 9, "#b6c1b4");
  s +=
    text(257, 163, stock ? "Market overview" : "Financial overview", 22) +
    text(
      257,
      185,
      stock
        ? "A little perspective on the bigger picture."
        : "A clearer picture of where you stand.",
      10,
      colors.muted,
    );
  s += pill(812, 145, "This month");
  const values = stock
    ? ["₹8,42,950", "+₹42,610", "12"]
    : ["₹2,48,610", "₹86,400", "₹32,150"];
  const labels = stock
    ? ["PORTFOLIO VALUE", "TOTAL RETURNS", "HOLDINGS"]
    : ["TOTAL BALANCE", "MONTHLY INCOME", "MONTHLY SPENDING"];
  values.forEach((v, i) => {
    const x = 257 + i * 216;
    s +=
      rect(x, 210, 201, 102, colors.panel, 5) +
      text(x + 15, 234, labels[i], 8, colors.muted, 'letter-spacing=".8"') +
      text(x + 15, 269, v, 24) +
      text(
        x + 15,
        291,
        i === 2 ? "Across your accounts" : "↗ 12.8% this month",
        8,
        colors.green,
      );
  });
  s +=
    rect(257, 329, 418, 208, colors.panel, 5) +
    text(273, 353, stock ? "Portfolio performance" : "Balance over time", 11) +
    text(589, 353, "30 DAYS", 7, colors.muted);
  for (let i = 0; i < 4; i++)
    s += line(273, 382 + 36 * i, 658, 382 + 36 * i, "#2b352d");
  if (stock) {
    for (let i = 0; i < 23; i++) {
      const y = 437 - i * 2 + Math.sin(i * 1.8) * 22,
        color = i % 3 ? "#acbc9c" : "#928070";
      s +=
        `<path d="M${282 + i * 16} ${y - 16}v${42 + (i % 3) * 5}" stroke="${color}"/>` +
        rect(278 + i * 16, y, 8, 12 + (i % 4) * 5, color, 1);
    }
  } else {
    s +=
      '<path d="M274 479 297 466 316 471 337 450 355 461 379 436 400 443 424 416 444 424 462 408 485 424 507 399 531 407 553 381 578 395 603 373 629 384 657 362L657 510H274Z" fill="#a7be94" fill-opacity=".08"/>';
    s +=
      '<path d="M274 479 297 466 316 471 337 450 355 461 379 436 400 443 424 416 444 424 462 408 485 424 507 399 531 407 553 381 578 395 603 373 629 384 657 362" fill="none" stroke="#b1c4a3" stroke-width="2.5"/>';
  }
  s +=
    text(274, 524, "01 SEP", 7, colors.muted) +
    text(605, 524, "30 SEP", 7, colors.muted);
  s +=
    rect(691, 329, 199, 208, colors.panel, 5) +
    text(708, 353, stock ? "Your watchlist" : "Spending breakdown", 11);
  if (stock) {
    ["NVDA", "AAPL", "MSFT", "GOOGL"].forEach((v, i) => {
      s +=
        text(708, 387 + i * 39, v, 10) +
        text(829, 387 + i * 39, "+2.14%", 8, colors.green) +
        line(708, 399 + i * 39, 873, 399 + i * 39);
    });
  } else {
    s +=
      '<circle cx="790" cy="418" r="40" fill="none" stroke="#384537" stroke-width="15"/><circle cx="790" cy="418" r="40" fill="none" stroke="#b1c4a3" stroke-width="15" stroke-dasharray="135 251" transform="rotate(-90 790 418)"/>';
    s +=
      text(770, 423, "₹32k", 16) +
      text(710, 492, "Essentials", 9, colors.muted) +
      text(837, 492, "54%", 9) +
      text(710, 514, "Lifestyle", 9, colors.muted) +
      text(837, 514, "28%", 9);
  }
  s +=
    rect(257, 550, 633, 40, colors.panel, 5) +
    text(
      273,
      574,
      stock
        ? "Markets move. Stay in the picture."
        : "Your next financial chapter starts here.",
      10,
      colors.muted,
    ) +
    text(822, 574, "Explore →", 9, colors.green);
  return s + "</g>";
}

function phone(title, vision = false) {
  let s =
    text(65, 119, vision ? "A different way" : "The market,", 33, "#26342d") +
    text(65, 161, vision ? "to see." : "within reach.", 33, "#26342d");
  s += text(
    65,
    206,
    vision ? "ON-DEVICE PERCEPTION" : "BUILT FOR MOBILE",
    9,
    "#344438",
    'letter-spacing="2"',
  );
  s += `<g transform="translate(260,22) rotate(-7,240,330)" filter="url(#shadow)">${rect(140, 20, 280, 608, "#172019", 39, 'stroke="#3e4a3b" stroke-width="3"')}${rect(150, 30, 260, 588, colors.bg, 31)}`;
  s +=
    rect(230, 39, 100, 23, "#070c09", 14) +
    text(168, 58, "9:41", 10) +
    text(363, 58, "•••", 11);
  s +=
    text(172, 111, title, 16) +
    text(
      172,
      143,
      vision ? "YOUR SURROUNDINGS" : "YOUR PORTFOLIO",
      8,
      colors.muted,
      'letter-spacing="1"',
    );
  s +=
    text(
      172,
      181,
      vision ? "A clearer path." : "₹84,290.50",
      vision ? 26 : 31,
    ) +
    text(
      172,
      208,
      vision ? "Camera perception · On device" : "+₹2,416.20 (2.95%) today",
      9,
      colors.green,
    );
  if (vision) {
    s += rect(169, 229, 221, 237, "#394b3d", 9);
    s +=
      '<path d="M170 466 250 355H308L390 466" fill="#6c7c68"/><path d="M170 229H390V305H170Z" fill="#536850"/><path d="M170 229 230 275V407L170 466Z" fill="#293c2c"/><path d="M390 229 325 278V409L390 466Z" fill="#293c2c"/>';
    s +=
      '<circle cx="265" cy="309" r="11" fill="#acb59d"/>' +
      rect(254, 323, 22, 44, "#acb59d", 6);
    s +=
      rect(243, 285, 45, 95, "none", 3, 'stroke="#d3e3be" stroke-width="1.5"') +
      rect(243, 274, 66, 13, "#c4d6b2", 2) +
      text(247, 283, "PERSON 94%", 7, "#18271c");
    s +=
      rect(177, 475, 205, 56, "#243328", 9) +
      text(192, 496, "Object detected", 10, "#d5e5c7") +
      text(192, 515, "Environmental context", 8, colors.muted);
    s +=
      rect(204, 552, 150, 34, "#b1c4a3", 17) +
      text(231, 574, "Camera active", 10, "#152419");
  } else {
    ["1D", "1W", "1M", "3M", "1Y"].forEach((v, i) => {
      s += text(175 + i * 43, 248, v, 9, i === 2 ? "#e8eedd" : colors.muted);
    });
    for (let i = 0; i < 15; i++) {
      const y = 339 - i * 2 + Math.cos(i * 2) * 19,
        color = i % 3 ? "#b1c4a3" : "#a1806f";
      s +=
        `<path d="M${179 + i * 14} ${y - 14}v54" stroke="${color}"/>` +
        rect(175 + i * 14, y, 8, 16 + (i % 3) * 6, color, 1);
    }
    s += text(174, 410, "YOUR HOLDINGS", 8, colors.muted, 'letter-spacing="1"');
    ["NVDA", "AAPL", "MSFT"].forEach((v, i) => {
      s +=
        rect(171, 429 + i * 45, 26, 26, "#2d3a2c", 6) +
        text(179, 446 + i * 45, v[0], 9, colors.green) +
        text(208, 439 + i * 45, v, 10) +
        text(208, 454 + i * 45, "Portfolio position", 7, colors.muted) +
        text(341, 444 + i * 45, "+2.14%", 9, colors.green);
    });
    s +=
      line(171, 577, 389, 577) +
      text(182, 596, "Overview     Markets     Portfolio", 9, colors.muted);
  }
  s += rect(239, 606, 84, 3, "#8c9788", 2) + "</g>";
  s +=
    rect(701, 468, 234, 104, "#ddd6c2", 4, 'transform="rotate(4 800 510)"') +
    text(
      720,
      500,
      vision ? "DESIGNED FOR ACCESS" : "CONNECTED BY DESIGN",
      9,
      "#415044",
      'letter-spacing="1"',
    ) +
    text(720, 532, vision ? "Useful cues." : "Web + mobile.", 25, "#26352c") +
    text(
      720,
      553,
      vision ? "Human purpose." : "One connected portfolio.",
      11,
      "#415044",
    );
  return s;
}

for (const [slug, title, bg, content] of [
  ["financeflow", "FinanceFlow", "#748678", dashboard("FinanceFlow")],
  ["stockpulse", "StockPulse", "#829aa3", dashboard("StockPulse", true)],
  ["stockpulse-mobile", "StockPulse Mobile", "#b3a085", phone("StockPulse")],
  [
    "vision-assistant",
    "Vision Assistant",
    "#858879",
    phone("Vision Assistant", true),
  ],
])
  writeFileSync(new URL(`${slug}.svg`, out), shell(title, bg, content));

// The studio share card is authored separately in public/social-card.svg.
// Regenerating product illustrations must preserve that brand asset.
