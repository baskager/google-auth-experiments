const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  http = require("http").Server(app),
  debug = require("debug")("auth-server"),
  exphbs = require("express-handlebars"),
  fs = require("fs"),
  config = require("./config"),
  port = config.port || 3000,
  { OAuth2Client } = require("google-auth-library");

const handlebars = exphbs.create({
  defaultLayout: "main"
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

// Define directory from which static files are served
app.use(express.static("public"));

fs.readFile("credentials/google.json", "utf8", function(err, data) {
  if (err) throw err;
  const credentials = JSON.parse(data);
  client = new OAuth2Client(credentials.clientId);

  app.get("/", function(req, res) {
    res.render("home", {
      pageName: "home",
      googleClientId: credentials.clientId
    });
  });

  app.post("/sign-in/google", function(req, res) {
    let accessToken = req.body.accessToken;

    var verify = new Promise(function(resolve, reject) {
      const ticket = client.verifyIdToken({
        idToken: accessToken,
        audience: credentials.clientId // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });

      resolve(ticket);
    })
      .then(ticket => {
        const payload = ticket.getPayload();
        //   const userid = payload["sub"];
        debug(payload);
        // Send user data back to the client
        res.send(payload);
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
      })
      .catch(error => {
        debug(error);
        res.send(error.message);
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
