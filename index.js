require('dotenv/config');
const ms = require('ms');
const chalk = require('chalk');
const crypto = require('crypto');
const app = require('express')();
const cron = require('node-cron');
const consola = require('consola');
const tinydate = require('tinydate');
const { format } = require('timeago.js');
const { Markup, Telegraf } = require('telegraf');

const oneDay = 864e5;
const tasks = new Map();
const logger = consola.withTag(chalk`{bgCyan.bold.dim  alertbot }`);
const bot = new Telegraf(process.env.BOT_TOKEN);
const secretPath = bot.secretPathComponent();
logger.wrapAll();

const helpMessage =
  'Please enter the time and text to schedule the alert.' +
  '\n\nUse the following format:\n\t\t<b>/alert 10m text</b>' +
  '\n\n<b>10m</b>: <i>You can choose the alert time, minutes(<b>10m</b>), hours(<b>10h</b>), days(<b>10d</b>), weeks(<b>10w</b>), months(<b>10m</b>), years(<b>10y</b>).</i>' +
  '\n\n<b>text</b>: <i>Here you can add whatever you want the bot show you</i>';

// telegraf
bot.launch({
  // uncomment the following lines if you use heroku or other hosting provider
  // webhook: {
  //   domain: 'myapp.herokuapp.com',
  //   port: process.env.PORT || 8080,
  //   cb: app
  // }
});
bot.telegram.setMyCommands([
  {
    command: 'alert',
    description: 'Schedule alert'
  },
  {
    command: 'help',
    description: 'Help'
  }
]);
bot
  .catch(logger.error) // handle errors
  .help(ctx => ctx.replyWithHTML(helpMessage)) // handle '/help' command
  .start(ctx => ctx.replyWithHTML(helpMessage)) // handle '/start' command
  .action(/^cancel-alert:([0-9a-f]+)$/, cancelAlert) // handle 'Cancel alert' button
  .command('alert', alert); // handle '/alert' command

async function cancelAlert (ctx) {
  const [, taskId] = ctx.match;
  await ctx.deleteMessage();
  const task = tasks.get(taskId);
  const cronTasks = cron.getTasks();
  if (task) {
    task.stop();
    tasks.delete(taskId);
    for (let i = 0; i < cronTasks.length; i += 1) {
      if (task === cronTasks[i]) {
        cronTasks[i].stop();
        cronTasks.splice(i, 1);
        logger.log('Task destroyed', cronTasks);
      }
    }
  }
}

async function alert (ctx) {
  const arr = ctx.message.text.split(/\s/);
  if (ctx.chat.type !== 'private')
    return ctx.reply('Sorry, this feature only works in private chat', {
      ...Markup.inlineKeyboard([Markup.button.url('PM', 'https://t.me/<botname>')])
    });
  if (arr.length === 1) return ctx.replyWithHTML(helpMessage);
  const time = ms(arr[1]);
  // check if time is valid and not less than 10 segs
  if (isNaN(time) || time < 20000) return ctx.reply('Invalid time format');
  arr.splice(0, 2);
  const taskId = createID();
  const textMessage = arr.join(' ');
  await ctx.deleteMessage(ctx.message.message_id);
  const { date, message_id } = await ctx.replyWithHTML(
    'You alert has been scheduled:' +
      `\n\n\t\u2014 <b>${textMessage}</b> <i>at ${format(time + Date.now())}</i>`,
    {
      ...Markup.inlineKeyboard([Markup.button.callback('Cancel alert', `cancel-alert:${taskId}`)])
    }
  );
  const cronTime = createCronTime(time + date * 1000);
  const task = cron.schedule(
    cronTime,
    async () => {
      await ctx.reply(textMessage);
      await ctx.deleteMessage(message_id);
    },
    {
      scheduled: false
    }
  );
  tasks.set(taskId, task);
  logger.log('Task scheduled');
  task.start();
}

function createCronTime (time) {
  // format date to cron syntax
  const date = new Date(time);
  const seconds = date.getSeconds();
  const months = date.getMonth() + 1;
  const minutes = date.getMinutes();
  const dayOfWeek = date.getDay();
  const hours = date.getHours();
  const days = date.getDate();

  return `${seconds} ${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
}

function createID () {
  return crypto.createHash('sha3-256').update(crypto.randomBytes(100)).digest('hex').substr(0, 6);
}

function escapeMessage (str) {
  return str[0]
    .replace(/([_*[]()~`>#+-=\|{}.!]+)/gim, '\\$1')
    .replace('&', '&amp;')
    .replace('<', '&lt;')
    .replace('>', '&gt;');
}
