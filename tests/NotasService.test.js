const mongoose = require("mongoose");
const NotasService = require("../services/NotasService");
const { TareasUsuario } = require("../models/tarea/tareasUsuario");
const { MONGO_URL } = require("../start/db_url");

describe("Funcionalidad relacionada a notas", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  afterAll(async () => {
    await TareasUsuario.deleteMany();
    await mongoose.disconnect();
  });

  it("Recupero las tareas de este dia", async () => {
    const result = await NotasService.findTodayTareas();
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it("Separo los usuarios", async () => {
    await NotasService.separeteInUser();
  });

  it("Tareas por usuario", async () => {
    const list = await NotasService.tareasByUser();
    expect(list.length).toBe(2);
  });
});
