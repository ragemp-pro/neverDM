using MySql.Data.MySqlClient;
using System;

public class MysqlDatabase
{
    private readonly string _connectionString;

    public MysqlDatabase(string connectionString)
    {
        _connectionString = connectionString;
    }

    private MySqlConnection GetConnection()
    {
        return new MySqlConnection(_connectionString);
    }

    public bool TestConnection()
    {
        try
        {
            using (var connection = GetConnection())
            {
                connection.Open();
                return connection.State == System.Data.ConnectionState.Open;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DATABASE] Error: {ex.Message}");
            return false;
        }
    }

    public bool IsTelegramIdExists(long telegramId)
    {
        using (var connection = GetConnection())
        {
            connection.Open();
            string query = "SELECT COUNT(*) FROM telegram WHERE idTG = @idTG";
            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@idTG", telegramId);
                var result = command.ExecuteScalar();
                return Convert.ToInt32(result) > 0;
            }
        }
    }
    public void AddTelegramId(long telegramId)
    {
        using (var connection = GetConnection())
        {
            connection.Open();
            string query = "INSERT INTO telegram (idTG) VALUES (@idTG)";
            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@idTG", telegramId);
                command.ExecuteNonQuery();
            }
        }
    }
    public string GetCodeByTelegramId(long telegramId)
    {
        using (var connection = GetConnection())
        {
            connection.Open();
            string query = "SELECT code FROM telegram WHERE idTG = @idTG";
            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@idTG", telegramId);
                var result = command.ExecuteScalar();
                return result?.ToString() ?? string.Empty; 
            }
        }
    }

    public int GetStatusByTelegramId(long telegramId)
    {
        using (var connection = GetConnection())
        {
            connection.Open();
            string query = "SELECT status FROM telegram WHERE idTG = @idTG";
            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@idTG", telegramId);
                var result = command.ExecuteScalar();
                return Convert.ToInt32(result);
            }
        }
    }

    public string GenerateUniqueCode()
    {
        string code;
        do
        {
            code = GenerateCode();
        } while (IsCodeExists(code)); 

        return code;
    }

    private string GenerateCode()
    {
        var random = new Random();
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var part1 = new string(Enumerable.Range(0, 4).Select(_ => chars[random.Next(chars.Length)]).ToArray());
        var part2 = new string(Enumerable.Range(0, 4).Select(_ => chars[random.Next(chars.Length)]).ToArray());
        return $"{part1}-{part2}";
    }

    private bool IsCodeExists(string code)
    {
        using (var connection = GetConnection())
        {
            connection.Open();
            string query = "SELECT COUNT(*) FROM telegram WHERE code = @code";
            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@code", code);
                var result = command.ExecuteScalar();
                return Convert.ToInt32(result) > 0;
            }
        }
    }

    public void SaveCode(long telegramId, string code)
    {
        using (var connection = GetConnection())
        {
            connection.Open();
            string query = "UPDATE telegram SET code = @code WHERE idTG = @idTG";
            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@idTG", telegramId);
                command.Parameters.AddWithValue("@code", code);
                command.ExecuteNonQuery();
            }
        }
    }
}
