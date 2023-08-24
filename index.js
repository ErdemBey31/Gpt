
const { Telegraf } = require('telegraf');
const express = require('express');
const app = express();
const port = 3000;
const { askGptAi } = require('sensui-package');
const bot = new Telegraf('6448227146:AAENITUSXo6dZxa2MCfDjXtLJXqm4Ig1mAs');
const { fetchBardAiResponse } = require('sensui-package');
let gptmodel = "nohave"

bot.start((ctx) => {
  if (gptmodel == "nohave") {
    ctx.replyWithMarkdown("Please select your GPT model.", {
      reply_markup: {
        inline_keyboard: [
          [{text:'Bard AI', callback_data:'bard'}],
          [{text:'Gpt AI', callback_data:'gptai'}]
        ]
      }
    });
  } else {
    ctx.replyWithMarkdown("*Hello, welcome to my unlimited chat GPT bot. Just post the problem. How can I help?*");
  }
});
bot.action('gptai', (ctx) => {
  gptmodel = "gptai"
  const chatId = ctx.chat.id
  try { 
    ctx.deleteMessage(chatId, ctx.message.message_id)
    ctx.replyWithMarkdown("*Selected model: gptai. To change write /change*")
  } catch (error) {
    ctx.replyWithMarkdown("*Selected model: gptai. To change write /change*")
  }
})
bot.action('bard', (ctx) => {
  gptmodel = "bard"
  const chatId = ctx.chat.id
  try { 
    ctx.deleteMessage(chatId, ctx.message.message_id)
    ctx.replyWithMarkdown("*Selected model: bard ai To change write /change*")
  } catch (error) {
    ctx.replyWithMarkdown("*Selected model: bard ai To change write /change*")
  }
})
bot.command("change", (ctx) => {
  gptmodel = "nohave"
  ctx.reply("Revoked successfully, type /start to change")
})
bot.on("message", async (ctx) => {
  if (gptmodel == "nohave") {
    ctx.replyWithMarkdown("First you need to select the gpt model.")
    return;
   }
  if (gptmodel == "gptai") {
    try {
      const response = await askGptAi(ctx.message.text);
      ctx.replyWithHTML(`<b>RESPONSE FROM GPTAI</b>: <code> ${response} </code>`);
    } catch (error) {
      ctx.reply(`Error: ${error.message}`);
}
}
  if (gptmodel == "bard") {
    try {
      const response = await fetchBardAiResponse(ctx.message.text);
      ctx.replyWithHTML(`<b>RESPONSE:</b> <code> ${response} </code>`);
  } catch (error) {
      ctx.reply(error.message);
  }
  }
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
console.log("Bot is working.")
bot.launch();