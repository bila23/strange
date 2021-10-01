const config = require("config");

const MONGO_URL = `mongodb+srv://${config.get("database.user")}:${config.get(
  "database.password"
)}@cluster0.tveqv.gcp.mongodb.net/${config.get(
  "database.name"
)}?retryWrites=true&w=majority`;

exports.MONGO_URL = MONGO_URL;
