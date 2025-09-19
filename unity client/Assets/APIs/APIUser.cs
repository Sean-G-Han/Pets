using UnityEngine;
using UnityEngine.Networking;
using System.Text;
using System.Threading.Tasks;

public class APIUser
{
    private readonly string baseUrl;

    public APIUser(string baseUrl)
    {
        this.baseUrl = baseUrl;
    }

    [System.Serializable]
    public class RegisterRequest
    {
        public string email;
        public string password;
        public string display_name;

        public RegisterRequest(string email, string password, string display_name)
        {
            this.email = email;
            this.password = password;
            this.display_name = display_name;   
        }
    }

    [System.Serializable]
    private class RegisterResponse
    {
        public string message;
        public string access_token;
        public string error;
    }

    [System.Serializable]
    public class LoginRequest
    {
        public string email;
        public string password;

        public LoginRequest(string email, string password)
        {
            this.email = email;
            this.password = password;
        }
    }

    [System.Serializable]
    private class LoginResponse
    {
        public string access_token;
        public string error;
    }

    public async Task<string> Register(string email, string password, string display_name)
    {
        string url = $"{baseUrl}/register";

        var body = new RegisterRequest(email, password, display_name) ;

        string jsonBody = JsonUtility.ToJson(body);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);

        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            var operation = request.SendWebRequest();
            while (!operation.isDone)
                await Task.Yield();

            if (request.result != UnityWebRequest.Result.Success)
                throw new System.Exception(request.error);

            RegisterResponse res = JsonUtility.FromJson<RegisterResponse>(request.downloadHandler.text);

            if (!string.IsNullOrEmpty(res.error))
                throw new System.Exception("Register failed: " + res.error);

            return res.access_token;
        }
    }

    public async Task<string> Login(string email, string password)
    {
        string url = $"{baseUrl}/login";

        var body = new LoginRequest(email, password) ;

        string jsonBody = JsonUtility.ToJson(body);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);

        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            var operation = request.SendWebRequest();
            while (!operation.isDone)
                await Task.Yield();

            if (request.result != UnityWebRequest.Result.Success)
                throw new System.Exception(request.error);

            LoginResponse res = JsonUtility.FromJson<LoginResponse>(request.downloadHandler.text);

            if (!string.IsNullOrEmpty(res.error))
                throw new System.Exception("Login failed: " + res.error);

            return res.access_token;
        }
    }
}
