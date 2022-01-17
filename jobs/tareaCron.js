const cron = require("node-cron");
const TareaService = require("../services/TareaService");

function tareas_proc_aprob_to_pend() {
  cron.schedule("0 2 * * *", async () => {
    await TareaService.update_pro_aprob_to_pend();
  });
}

exports.tareas_proc_aprob_to_pend = tareas_proc_aprob_to_pend;
