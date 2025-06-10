// scripts/scrapeEvents.js

const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Event = require('../models/Event');
require('dotenv').config();

(async () => {
  console.log('📡 Launching headless browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let currentPage = 1;

  await mongoose.connect(process.env.MONGODB_URI);

  while (true) {
    const url = `https://sigiforge.com/events/list/page/${currentPage}/?iframe`;
    console.log(`🌐 Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle0' });

    const events = await page.evaluate(() => {
      const results = [];
      const items = document.querySelectorAll('article.tribe-events-calendar-list__event');

      items.forEach(item => {
        const name = item.querySelector('h3 a')?.innerText.trim();
        const link = item.querySelector('h3 a')?.href;
        const dateRaw = item.querySelector('time')?.getAttribute('datetime');
        const date = (dateRaw && !isNaN(Date.parse(dateRaw))) ? dateRaw : null;
        const location = item.querySelector('.tribe-events-calendar-list__event-venue-title')?.innerText.trim();

        if (name && date) {
          results.push({ name, date, location, link });
        }
      });

      return results;
    });

    console.log(`📄 Page ${currentPage}: Found ${events.length} events`);
    if (events.length === 0) break;

    for (const ev of events) {
      try {
        const existing = await Event.findOne({ name: ev.name, date: new Date(ev.date) });

        // If not existing or changed (e.g. location or link), update
        if (!existing || existing.location !== ev.location || existing.link !== ev.link) {
          await Event.findOneAndUpdate(
            { name: ev.name, date: new Date(ev.date) },
            {
              name: ev.name,
              date: new Date(ev.date),
              location: ev.location,
              link: ev.link
            },
            { upsert: true, new: true }
          );
          console.log(`✔️ Saved/Updated: ${ev.name}`);
        } else {
          console.log(`⏭️ Skipped (no changes): ${ev.name}`);
        }
      } catch (err) {
        console.error(`❌ Error saving: ${ev.name}`, err.message);
      }
    }

    const hasNext = await page.$('a[rel="next"]');
    if (!hasNext) {
      console.log('⛔ No more pages. Finished.');
      break;
    }

    currentPage++;
  }

  await mongoose.disconnect();
  await browser.close();
  console.log('✅ All events scraped and saved');
})();
