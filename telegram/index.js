import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { done, job, setSchedule, setSupabaseId, snooze, userSupabaseId } from './utils.js';


export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // SERVER ONLY
);

// Load token from .env
const token = process.env.BOT_TOKEN;
// Create a bot that uses 'polling'
export const bot = new TelegramBot(token, { polling: true });
bot.on('polling_error', console.error);

// check the db if the supabase id is already set, if it is set then do not ask for it again

bot.onText(/\/start/, async (msg) => {
    //const id = userSupabaseId || await setSupabaseId(msg);
    bot.sendMessage(msg.chat.id, `if you want to recieve notifications about your upcoming tasks, please send /set_notifier command`);

});

bot.onText(/\/set_notifier/, async (msg) => {
    const id = userSupabaseId || await setSupabaseId(msg);
    if (job) { job.stop() }
    await setSchedule(id, msg.chat.id);
});
bot.onText(/\/stop_notifier/, async (msg) => {
    if (job) { job.stop() }
});
bot.onText(/\/get_score/, async (msg) => {
    if (!userSupabaseId) await setSupabaseId(msg);
    const { data, error } = await supabase
        .from('telegram-ids')
        .select('points')
        .eq('uid', userSupabaseId)
        .single();
        if (error) {
           return bot.sendMessage(msg.chat.id, "❌ Error fetching score.");
        }
        bot.sendMessage(msg.chat.id, `Your current score is: ${data.points}`);
});

bot.on('callback_query', async (query) => {
    if (!userSupabaseId) await setSupabaseId(query.message);
    const data = query.data;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    if (data.startsWith('done_')) {
        await done({
            data, query, chatId, messageId, userSupabaseId
        });
    }

    if (data.startsWith('snooze_')) {
        await snooze({ data, query, chatId, messageId, userSupabaseId });
    }

})

function isUUID(str) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}
