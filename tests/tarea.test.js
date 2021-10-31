const mongoose = require("mongoose");
const { generateCode } = require("../services/TareaService");
const { MONGO_URL } = require("../start/db_url");

describe("Funcionalidad relacionada a tareas", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("Generar codigo de tarea", async () => {
    const result = await generateCode();
    expect(result).toBeGreaterThanOrEqual(1);
  });
});
