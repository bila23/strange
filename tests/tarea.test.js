const { expectCt } = require("helmet");
const { sendMailToSave } = require("../services/TareaService");

describe("Funcionalidad relacionada a tareas", () => {
  it("should send a mail", async () => {
    const flag = await sendMailToSave();
    expect(flag).toBe(true);
  });
});
