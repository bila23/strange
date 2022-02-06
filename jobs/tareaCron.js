const cron = require("node-cron");
const TareaService = require("../services/TareaService");
const NotasService = require("../services/NotasService");

/*
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
field	        value
second	      0-59
minute	      0-59
hour	        0-23
day of month	1-31
month	        1-12 (or names)
day of week	  0-7 (or names, 0 or 7 are sunday)
*/

function notas() {
  cron.schedule("* 0 10 * * *", async () => {
    await NotasService.execute();
  });
}

function tareas_proc_aprob_to_pend() {
  cron.schedule("0 2 * * *", async () => {
    await TareaService.update_pro_aprob_to_pend();
  });
}

exports.tareas_proc_aprob_to_pend = tareas_proc_aprob_to_pend;
