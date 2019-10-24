// NPM-Free Server by The Jared Wilcurt
// All you need to run this is an installed copy of Node.JS
// Put this next to the files you want to serve and run: node server.js

// Require in some of the native stuff that comes with Node
var http = require("http");
var https = require("https");
https.debug = true;
var url = require("url");
var path = require("path");
var fs = require("fs");
// Port number to use
var port = 8080;
// Colors for CLI output
var WHT = "\033[39m";
var RED = "\033[91m";
var GRN = "\033[32m";

var username = process.env.API_USERNAME,
  password = process.env.API_PASSWORD,
  auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

var api_create = process.env.API_PATH + "/Create";
var api_submit = process.env.API_PATH + "/SQFlow";

var options = {
  hostname: process.env.API_HOSTNAME,
  port: process.env.API_PORT,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: auth
  },
  key: process.env.API_KEY,
  cert: process.env.API_CERT
};

console.log(options);
// Create the server
http
  .createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    var contentTypesByExtension = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
      ".json": "text/json",
      ".svg": "image/svg+xml"
    };

    console.log("filename=" + uri);
    /* For these 2 endpoints, we are doing the backend call API */
    if (uri.indexOf("/createcase") !== -1 || uri.indexOf("/submitflow") !== -1) {
      collectRequestData(request, result => {
        let data = JSON.parse(result);
        if (uri.indexOf("/createcase") !== -1) {
          options.path = api_create;
        } else {
          options.path = api_submit;
        }
        var req = https.request(options, function(res) {
          res.setEncoding("utf8");
          res.on("data", function(d) {
            response.writeHead(200, { "Content-Type": "text/json" });
            response.write(d);
            response.end();
            console.log("RETURNED for " + uri, d);
          });
        });
        req.write(JSON.stringify(data));
        req.end();
      });
    } else {
      // Check if the requested file exists
      fs.exists(filename, function(exists) {
        // If it doesn't
        if (!exists) {
          // Output a red error pointing to failed request
          console.log(RED + "FAIL: " + filename);
          // Redirect the browser to the 404 page
          filename = path.join(process.cwd(), "/404.html");
          // If the requested URL is a folder, like http://localhost:8000/catpics
        } else if (fs.statSync(filename).isDirectory()) {
          // Output a green line to the console explaining what folder was requested
          console.log(GRN + "FLDR: " + WHT + filename);
          // redirect the user to the index.html in the requested folder
          filename += "/index.html";
        }

        // Assuming the file exists, read it
        fs.readFile(filename, "binary", function(err, file) {
          // Output a green line to console explaining the file that will be loaded in the browser
          console.log(GRN + "FILE: " + WHT + filename);
          // If there was an error trying to read the file
          if (err) {
            // Put the error in the browser
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write(err + "\n");
            response.end();
            return;
          }

          // Otherwise, declare a headers object and a var for the MIME-Type
          var headers = {};
          var contentType = contentTypesByExtension[path.extname(filename)];
          // If the requested file has a matching MIME-Type
          if (contentType) {
            // Set it in the headers
            headers["Content-Type"] = contentType;
          }

          // Output the read file to the browser for it to load
          response.writeHead(200, headers);
          response.write(file, "binary");
          response.end();
        });
      });
    }
  })
  .listen(parseInt(port, 10));

function collectRequestData(req, callback) {
  let data = [];
  req.on("data", chunk => {
    data.push(chunk);
  });
  req.on("end", () => {
    callback(data);
  });
}

// Message to display when server is started
console.log(WHT + "Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
