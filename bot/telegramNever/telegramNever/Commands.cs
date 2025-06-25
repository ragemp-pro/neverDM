using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;

namespace telegramNever
{
    internal class Commands
    {
        private readonly ITelegramBotClient _botClient;

        public Commands(ITelegramBotClient botClient)
        {
            _botClient = botClient;
        }

        public async Task HandleStartCommand(Message message)
        {
            string welcomeText = "never project — проект на платформе RageMP.";

            var inlineKeyboard = new InlineKeyboardMarkup(new[]
            {
                new[]
                {
                    InlineKeyboardButton.WithCallbackData("🌐 Соцсети", "social_networks"),
                    InlineKeyboardButton.WithCallbackData("📋 Информация по проекту", "project_info")
                },
                new[]
                {
                    InlineKeyboardButton.WithCallbackData("🛠️ Поддержка", "support")
                },
                new[]
                {
                    InlineKeyboardButton.WithCallbackData("🔗 Привязка телеграма к игровому аккаунту", "link_account")
                }
            });

            await _botClient.SendMessage(
                chatId: message.Chat.Id,
                text: welcomeText,
                parseMode: ParseMode.Markdown,
                replyMarkup: inlineKeyboard
            );
        }
    }
}
