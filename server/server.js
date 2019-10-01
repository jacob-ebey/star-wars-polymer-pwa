const prpl = require("prpl-server");
const express = require("express");

const app = express();

app.get("/api/launch", (req, res, next) => res.send("boom"));

app.get(
  "/*",
  prpl.makeHandler("./build", {
    builds: [
      { name: "esm-bundled", browserCapabilities: ["es2015", "modules"] },
      { name: "es6-bundled", browserCapabilities: ["es2015"] },
      { name: "es5-bundled" }
    ]
  })
);

app.listen(process.env.PORT || 8080);
