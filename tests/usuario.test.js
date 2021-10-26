const mongoose = require("mongoose");
const { MONGO_URL } = require("../start/db_url");
const UsuarioService = require("../services/UsuarioService");

describe("User test", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
});
