require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const { format } = require('date-fns');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // SERVER ONLY
);

// Load token from .env
const token = process.env.BOT_TOKEN;
let userSupabaseId;
// check the db if the supabase id is already set
(() => {
  console.log("This runs immediately!");
})();

// Create a bot that uses 'polling'
const bot = new TelegramBot(token, { polling: true });
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
                userSupabaseId = data.user.id;
            } catch (err) {
                bot.sendMessage(chatId, "❌ Something went wrong. Try again.");
                return askForSupabaseId(chatId); // reuse
            }
        }
    });
}

// Start the flow
bot.onText(/\/getid/, (msg) => {
    askForSupabaseId(msg.chat.id);
});
function isUUID(str) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}
function setSchedule(userId, chatId) {
    cron.schedule('* * * * *', async () => { // runs every minute
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
                        const diffMinutes = diffMs / (1000 * 60);
                        if (diffMinutes < 30 && diffMinutes > 0) {
                            await bot.sendMessage(chatId, `⏰ Habit: ${habit.name} is due in ${Math.floor(diffMinutes)} minutes at ${format(taskTime, 'hh:mm a')} ⏰`);
                        }
                    }
                } else {
                    bot.sendMessage(chatId, 'No upcoming tasks found.');
                }
            });
    });
}