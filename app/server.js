const express = require("express"),
  app = express(),
  http = require("http").Server(app),
  debug = require("debug")("auth-server"),
  exphbs = require("express-handlebars"),
  fs = require("fs"),
  config = require("./config"),
  port = config.port || 3000;

const handlebars = exphbs.create({
  defaultLayout: "main"
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

// Define directory from which static files are served
app.use(express.static("public"));

fs.readFile("credentials/google.json", "utf8", function(err, data) {
  if (err) throw err;
  const credentials = JSON.parse(data);

  app.get("/", function(req, res) {
    res.render("home", {
      pageName: "home",
      meta: meta
    });
  });

  app.get("/sign-in/google", function(req, res) {
    let accessToken = req.body.accessToken;

    res.render("secured", {
      //   account: payload.getUser()
    });
  });

  app.get("/sign-in/firebase", function(req, res) {
    let accessToken = req.body.accessToken;

    res.render("secured", {
      //   account: payload.getUser()
    });
  });

  http.listen(port, function() {
    console.log("Server listening on port " + port);
    debug("Debug logs for auth-server enabled");
  });
});
