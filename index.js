const Fortnite = require("fortnite-api");

const ftnt = new Fortnite([
  "i2ef@live.com",
  "~EpHXd3-[95Yv)Qpm%",
  "MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=",
  "ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ=",
], { debug: true });

ftnt.login().then(() => {
  ftnt
    .getStatsBRFromID("8926bc07392b4870977c4a7937e7225b", "pc")
    .then((stats) => {
      console.log(stats)
    }).catch((error) => {
      console.log(error);
    });
});
