const fs = require("fs");
const { execSync } = require("child_process");

const feeds = require("../feeds.json");

if (fs.existsSync("./renders")) fs.rmSync("./renders", { recursive: true, force: true });
fs.mkdirSync("./renders");

feeds.forEach((feed, i) => {
  if (!feed.finalFeed) {
    console.log(`Skipping ${feed.name} (not a final feed) (${i + 1} / ${feeds.length})`);
    return;
  }

  if (feed.disabled) {
    console.log(`Skipping ${feed.name} (disabled) (${i + 1} / ${feeds.length})`);
    return;
  }

  if (feed.finalFeed) {
    console.log(`Converting ${feed.name} into finalized graph`);
    try {
      execSync(`cat ./final_graphs/${feed.key}.json | transitmap -l > ./renders/${feed.key}.svg`, { stdio: "ignore" });
      execSync(`rsvg-convert -f pdf -b "#999999" ./renders/${feed.key}.svg -o ./renders/${feed.key}.pdf`, { stdio: "ignore" });
    } catch (error) {
      console.error("Command failed to execute:", error.message);
    }
    console.log(`Done converting ${feed.name} into graph (${i + 1} / ${feeds.length})`);
    return;
  }
});
