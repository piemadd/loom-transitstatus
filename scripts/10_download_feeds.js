const fs = require("fs");
const fetch = require("node-fetch");

const feeds = require("../feeds.json");

if (fs.existsSync("./zips")) fs.rmSync("./zips", { recursive: true, force: true });
fs.mkdirSync("./zips");

feeds.forEach((feed, i) => {
  if (feed.sources) {// not a source feed
    console.log(`Skipping ${feed.name} (not a source feed) (${i + 1} / ${feeds.length})`);
    return; 
  }

  if (feed.disabled) {
    console.log(`Skipping ${feed.name} (disabled) (${i + 1} / ${feeds.length})`);
    return; 
  }

  console.log(`Downloading ${feed.name}`);
  fetch(feed.url, { method: "GET" })
    .then((res) => {
      if (res.status !== 200) {
        res.text().then((resText) => {
          console.log(resText);
          throw new Error(`Error downloading ${feed.name}`);
        });
      } else {
        const dest = fs.createWriteStream(`./zips/${feed.key}.zip`);
        res.body.pipe(dest);
        res.body.on("end", () => {
          console.log(`Finished downloading feed: ${feed.name} (${i + 1} / ${feeds.length})`);
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
});
