"use strict";

require("@babel/polyfill");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _app = _interopRequireDefault(require("./app"));

require("./db");

require("./passport");

require("./models/Video");

require("./models/Comment");

require("./models/User");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var PORT = process.env.PORT;

var handleListening = function handleListening() {
  console.log("Listening on: http://localhost:".concat(PORT));
  console.log(process.env.FB_CALLBACK);
};

_app["default"].listen(PORT, handleListening);