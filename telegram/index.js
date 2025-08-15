require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const { format } = require('date-fns');
const dayjs = require('dayjs');


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // SERVER ONLY
);

// Load token from .env
const token = process.env.BOT_TOKEN;
// Create a bot that uses 'polling'
const bot = new TelegramBot(token, { polling: true });
bot.on('polling_error', console.error);
let userSupabaseId;
let job;
// check the db if the supabase id is already set, if it is set then do not ask for it again
const setSupabaseId = async (msg) => {
    const { data, error } = await supabase.from('telegram-ids').select('uid').eq('telegramId', msg.from.id)
    console.log('last');
    if (error) {
        console.log(error);
    }
    if (data.length && data[0].uid) {
        userSupabaseId = data[0].uid;
        return userSupabaseId
    } else {
        askForSupabaseId(msg.chat.id);
    }
}

function setSchedule(userId, chatId) {
    console.log(userId, chatId);
    bot.sendMessage(chatId, `you will be notified about your upcoming with 30 minutes before the task`);
    job = cron.schedule('* * * * *', async () => { // runs every minuteّ
        const now = new Date();
        await supabase
            .from('habits')
            .select('*')
            .eq('user_id', userId)
            .eq('checked', false)
            .then(async ({ data, error }) => {
                if (error) {
                    console.error('Error fetching habits:', error);
                    return;
                }
                if (data.length > 0) {
                    for (const habit of data) {
                        const taskTime = new Date(habit.selected_time); // convert DB string to Date
                        const diffMs = taskTime - now; // difference in milliseconds
                        let diffMinutes = diffMs / (1000 * 60);
                        diffMinutes = 3; // ____TESTING PURPOSES____
                        if (Math.round(diffMinutes) === 60) {
                            await bot.sendMessage(chatId, `⏰ habit: ${habit.name} is due in 1 hour at ${format(taskTime, 'hh:mm a ')} ⏰`)
                        }
                        if (diffMinutes <= 1 && diffMinutes >= -1) {
                            await bot.sendMessage(chatId, `✅ Habit: ${habit.name} is due now at ${format(taskTime, 'hh:mm a')} ✅`);
                        }

                        if (diffMinutes < 30 && diffMinutes > 1) {
                            await bot.sendMessage(chatId, `⏰ Habit: ${habit.name} is due in ${Math.floor(diffMinutes)} minutes at ${format(taskTime, 'hh:mm a')} ⏰`, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            { text: "✅ Done", callback_data: `done_${habit.id}` },
                                            { text: "⏰ Snooze 15 min", callback_data: `snooze_${habit.id}_15_${habit.selected_time}` }
                                        ]
                                    ]
                                }
                            });
                        }
                    }
                } else {
                    bot.sendMessage(chatId, 'No upcoming tasks found.');
                }
            });
    });
}
async function askForSupabaseId(chatId) {
    const sentMessage = await bot.sendMessage(chatId, 'Please reply with your Supabase ID:', {
        reply_markup: { force_reply: true }
    });

    bot.once('message', async (msg) => {
        if (
            msg.reply_to_message &&
            msg.reply_to_message.message_id === sentMessage.message_id
        ) {
            const userId = msg.text;

            // Validate UUID first
            if (!isUUID(userId)) {
                bot.sendMessage(chatId, "❌ Invalid ID. Try again.");
                return askForSupabaseId(chatId); // reuse the same function
            }

            try {
                const { data, error } = await supabase.auth.admin.getUserById(userId);

                if (error || !data) {
                    bot.sendMessage(chatId, "❌ User not found. Try again.");
                    return askForSupabaseId(chatId); // reuse
                }

                bot.sendMessage(chatId, `✅ User found: ${data.user.email} \n and you receive notifications about your upcoming task before 30 min.`);
                // Save user ID here if needed
                setSchedule(userId, chatId)
                //set the userid from telegram for its corresponding supabase auth id
                const { error: error2 } = await supabase.from('telegram-ids').insert({ uid: userId, telegramId: chatId })
                if (error2) {
                    console.log(error2);
                    throw new Error(error2)
                }
                userSupabaseId = userId; // set global variable
            } catch {
                bot.sendMessage(chatId, "❌ Something went wrong. Try again.");
                return askForSupabaseId(chatId); // reuse
            }
        }
    });
}

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
function snoozeDate(dateStr, minutes) {
    return dayjs(dateStr)
        .add(minutes, "minute")
        .format("YYYY-MM-DD HH:mm:ss");
}

bot.on('callback_query', async (query) => {
    if (!userSupabaseId) return;
    const data = query.data;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    if (data.startsWith('done_')) {
        const habitId = data.split('_')[1];
        //______TESTING REWARDS________CHANGDE CHECKED TO FALSE 
        const { error } = await supabase.from('habits').update({ checked: false }).eq('id', habitId);
        const { data: data2 } = await supabase.from('habits').select('selected_time').eq('id', habitId)
        console.log(data2[0].selected_time);
        //check if the task is done before the time
        if (data.length && new Date(data2[0].selected_time) > new Date()) {
            // reward the user
            console.log('task is done before the time so you deserve a reward');
            // const { error: error2,data:data2 } = await supabase.from('telegram-ids').update({ points: supabase.literal('points + 1') }).eq('uid', userSupabaseId);
            // if (error2) {
            //     console.log(error2);
            //     throw new Error('error while updating rewards' + error2);
            // }
            // console.log(data2);
            
        }
        if (error) {
            console.log(error);
            return bot.answerCallbackQuery(query.id, { text: `❌ Error marking habit as done.` });
        }
        bot.answerCallbackQuery(query.id, { text: `✅ Habit marked as done!` });
        await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId });
    }

    if (data.startsWith('snooze_')) {
        const parts = data.split('_');
        const habitId = parts[1];
        const snoozeMinutes = parseInt(parts[2], 10);
        const selected_time = parts[3]
        const { error } = await supabase.from('habits').update({ selected_time: snoozeDate(selected_time, snoozeMinutes) }).eq('id', habitId);
        if (error) {
            console.log(error);
            return bot.answerCallbackQuery(query.id, { text: `❌ Error snoozing habit` })
        }
        await bot.answerCallbackQuery(query.id, { text: `⏰ Habit snoozed by ${snoozeMinutes} minutes!` });
        await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId });
    }

})

function isUUID(str) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}
