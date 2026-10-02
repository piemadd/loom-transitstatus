# loom-transitstatus

Requires jdk v17 or higher. 
Requires [loom](https://github.com/ad-freiburg/loom) to be installed.

1. `git clone https://github.com/piemdad/loom-transitstatus`
2. `npm run download_gtfs_merge` <- downloads the onebusaway gtfs merging cli tool from the official repo. you can download this yourself if youd like
3. Edit `./feeds.json` if you'd like (by default chicagoland commuter rails will be rendered)
4. `npm run all`