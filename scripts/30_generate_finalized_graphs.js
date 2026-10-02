const fs = require("fs");
const { execSync } = require("child_process");

const feeds = require("../feeds.json");

if (fs.existsSync("./final_graphs")) fs.rmSync("./final_graphs", { recursive: true, force: true });
fs.mkdirSync("./final_graphs");

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
    console.time(`Done converting ${feed.name} into graph (${i + 1} / ${feeds.length})`);
    try {
      execSync(
        `gtfs2graph -m 0,1,2 ./final_zips/${feed.key}.zip | topo | loom > ./final_graphs/${feed.key}.json`,
        { stdio: "ignore" }
      );
    } catch (error) {
      console.error("Command failed to execute:", error.message);
    }
    console.timeEnd(`Done converting ${feed.name} into graph (${i + 1} / ${feeds.length})`);
    return;
  }
});
