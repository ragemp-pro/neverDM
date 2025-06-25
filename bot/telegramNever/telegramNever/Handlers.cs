using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;

namespace telegramNever
{
    internal class Handlers
    {
        private readonly ITelegramBotClient _botClient;
        private readonly MysqlDatabase _mysqlDatabase;

        public Handlers(ITelegramBotClient botClient, MysqlDatabase mysqlDatabase)
        {
            _botClient = botClient;
            _mysqlDatabase = mysqlDatabase;
        }

        public async Task HandleCallbackQuery(CallbackQuery callbackQuery)
        {
            if (callbackQuery == null || callbackQuery.Data == null)
            {
                Console.WriteLine("Ошибка: callbackQuery или callbackQuery.Data = null");
                return;
            }

            await _botClient.AnswerCallbackQuery(
                callbackQueryId: callbackQuery.Id,
                text: "Вы выбрали: " + callbackQuery.Data,
                showAlert: false
            );

            if (callbackQuery.Message != null)
            {
                if (callbackQuery.Data == "link_account")
                {
                    if (callbackQuery.From != null)
                    {
                        long telegramId = callbackQuery.From.Id;

                        if (_mysqlDatabase.IsTelegramIdExists(telegramId))
                        {
                            int status = _mysqlDatabase.GetStatusByTelegramId(telegramId);
                            if (status == 1)
                            {
                                await _botClient.SendMessage(
                                    chatId: callbackQuery.Message.Chat.Id,
                                    text: "Ваш аккаунт уже привязан."
                                );
                            }
                            else
                            {
                                string existingCode = _mysqlDatabase.GetCodeByTelegramId(telegramId);
                                var projectInfoText = $"🔗 Привязка аккаунта \n\nВаш код привязки: `{existingCode}` \nЗайдите в игру, нажмите бинд на кнопку `M`, он откроет меню\\.\nВ меню найдите вкладку `Настройки`, там найдите поле `Привязка телеграма`, введите указанный код\\.";

                                await _botClient.SendMessage(
                                    chatId: callbackQuery.Message.Chat.Id,
                                    text: projectInfoText,
                                    parseMode: ParseMode.MarkdownV2
                                );
                            }
                        }
                        else
                        {
                            _mysqlDatabase.AddTelegramId(telegramId);

                            var code = _mysqlDatabase.GenerateUniqueCode();
                            _mysqlDatabase.SaveCode(telegramId, code);
                            var projectInfoText = $"🔗 Привязка аккаунта \n\nВы создали код привязки: `{code}` \nЗайдите в игру, нажмите бинд на кнопку `M`, он откроет меню\\.\nВ меню найдите вкладку `Настройки`, там найдите поле `Привязка телеграма`, введите указанный код\\.";

                            await _botClient.SendMessage(
                                chatId: callbackQuery.Message.Chat.Id,
                                text: projectInfoText,
                                parseMode: ParseMode.MarkdownV2
                            );
                        }
                    }
                    else
                    {
                        Console.WriteLine("Ошибка: callbackQuery.From = null");
                    }
                }
            }
            else
            {
                Console.WriteLine("Ошибка: callbackQuery.Message = null");
            }
        }



    }
}
