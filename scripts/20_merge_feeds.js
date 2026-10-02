const fs = require("fs");
const { execSync } = require("child_process");

const feeds = require("../feeds.json");

if (fs.existsSync("./final_zips")) fs.rmSync("./final_zips", { recursive: true, force: true });
fs.mkdirSync("./final_zips");

feeds.forEach((feed, i) => {
  if (!feed.finalFeed) {
    console.log(`Skipping ${feed.name} (not a final feed) (${i + 1} / ${feeds.length})`);
    return;
  }

  if (feed.disabled) {
    console.log(`Skipping ${feed.name} (disabled) (${i + 1} / ${feeds.length})`);
    return; 
  }

  if (feed.finalFeed && !feed.sources) {
    // feed is complete
    fs.cpSync(`./zips/${feed.key}.zip`, `./final_zips/${feed.key}.zip`);
    console.log(`Copied ${feed.name} to final feeds (${i + 1} / ${feeds.length})`);
    return;
  }

  if (feed.finalFeed && feed.sources) {
    console.log(`Merging feeds ${feed.sources.join(", ")} into ${feed.name}`);
    //fs.cpSync(`./zips/${feed.key}.zip`, `./final_zips/${feed.key}.zip`);
    try {
      execSync(
        `java -jar ./onebusaway-gtfs-merge.jar --file=agency.txt --file=stops.txt --file=routes.txt --file=trips.txt --file=stop_times.txt --file=calendar.txt --file=calendar_dates.txt --file=shapes.txt --file=fare_attributes.txt --file=fare_rules.txt --file=frequencies.txt --file=transfers.txt --logDroppedDuplicates ${feed.sources.map((key) => `./zips/${key}.zip`).join(" ")} ./final_zips/${feed.key}.zip`,
        { stdio: "ignore" }
      );
    } catch (error) {
      console.error("Command failed to execute:", error.message);
    }
    //java -jar ./onebusaway-gtfs-merge.jar --file=agency.txt --file=stops.txt --file=routes.txt --file=trips.txt --file=stop_times.txt --file=calendar.txt --file=calendar_dates.txt --file=shapes.txt --file=fare_attributes.txt --file=fare_rules.txt --file=frequencies.txt --file=transfers.txt  --logDroppedDuplicates ./zips/metra.zip ./zips/southshore.zip ./chicago_test.zi
    console.log(`Done merging together ${feed.name} for final feeds (${i + 1} / ${feeds.length})`);
    return;
  }
});
