using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Polling;
using telegramNever;

class mainBOT
{
    private static ITelegramBotClient _botClient = null!;
    private static ReceiverOptions _receiverOptions = null!;
    private static MysqlDatabase _mysqlDatabase = null!;
    private static Commands _commands = null!;
    private static Handlers _handlers = null!;

    static async Task Main()
    {
        string connectionString = "Server=localhost;Database=server;UID=root;Password=;";
        _mysqlDatabase = new MysqlDatabase(connectionString); 

        if (_mysqlDatabase.TestConnection())
        {
            Console.WriteLine("[DATABASE] Connected to database");
        }
        else
        {
            Console.WriteLine("[DATABASE] Error connected");
            return;
        }

        _botClient = new TelegramBotClient(""); // свой токен тг бота
        _receiverOptions = new ReceiverOptions
        {
            AllowedUpdates = new[] { UpdateType.Message, UpdateType.CallbackQuery }, 
        };

        _commands = new Commands(_botClient); 
        _handlers = new Handlers(_botClient, _mysqlDatabase); 

        using var cts = new CancellationTokenSource();

        await Task.Run(() => _botClient.StartReceiving(
            UpdateHandler,
            ErrorHandler,
            _receiverOptions,
            cts.Token
        ));

        var me = await _botClient.GetMe();
        Console.WriteLine($"[BOT] {me.FirstName} started");

        await Task.Delay(-1);
    }

    private static async Task UpdateHandler(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
    {
        if (update.Type == UpdateType.Message && update.Message?.Text != null)
        {
            var message = update.Message;
            if (message?.From != null)
            {
                Console.WriteLine($"{message.From.FirstName} (ID: {message.From.Id}): {message.Text}");
                await _commands.HandleStartCommand(message); 
            }
        }

        if (update.Type == UpdateType.CallbackQuery && update.CallbackQuery != null)
        {
            var callbackQuery = update.CallbackQuery;
            await _handlers.HandleCallbackQuery(callbackQuery);
        }
    }

    private static Task ErrorHandler(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Ошибка: {exception.Message}");
        return Task.CompletedTask;
    }
}
