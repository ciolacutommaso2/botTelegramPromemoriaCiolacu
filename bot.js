const schedule = require('node-schedule');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const conf = JSON.parse(fs.readFileSync('conf.json'));
const token = conf.key;

const bot = new TelegramBot(token, {polling: true});

function aggiungiPromemoria (chatId, lezione, giorno, oraStart1, oraEnd) {
    const dizT = {
        "lunedì": 1,
        "lunedi": 1,
        "martedì": 2,
        "martedi": 2,
        "mercoledì": 3,
        "mercoledi": 3,
        "giovedì": 4,
        "giovedi": 4,
        "venerdì": 5,
        "venedi": 5,
        "sabato": 6,
        "domenica": 0,
    }
    if (oraStart1.length !== 5) {
    oraStart = oraStart1.split(":");
    const stringOra = oraStart[1] + " " + oraStart[0] + " * * " + dizT[giorno.toLowerCase()];
    console.log("stringOra: " + stringOra);

    schedule.scheduleJob(stringOra, () => {
        bot.sendMessage(chatId, "Promemoria: " + lezione + " inizia tra 5 minuti! ");
    })
    console.log("Promemoria aggiunto, ", chatId)
}

bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) return; 

    console.log(text.slice(0, 4));

    if (text === "/start") {
        bot.sendMessage(chatId, "Ciao! con questo bot potrai gestire le tue lezioni e poter visualizzare l'orario \n\n ");
        return;
    }
    
    if (text.slice(0, 4) === "/add") {
        const list = text.split(" ");
        const lezione = list[1];
        const giorno = list[2];
        const oraStart = list[3];
        const oraEnd = list[4];


        console.log("Lezione: " + lezione + "\nGiorno: " + giorno + "\nOra inizio: " + oraStart + "\nOra fine: " + oraEnd);
        try {
        aggiungiPromemoria(chatId, lezione, giorno, oraStart, oraEnd);
        } catch (e) {
            console.log("Errore: " + e);
            bot.sendMessage(chatId, "Errore: " + e);
            return;
        }

        bot.sendMessage(chatId, "Promemoria aggiunto con successo. Verrai avvisato 5 minuti prima: ");
        return;
    }


    
});