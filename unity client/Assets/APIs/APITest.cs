using UnityEngine;

public class TestAuth : MonoBehaviour
{
    private async void Start()
    {
        APIUser apiUser = new APIUser("http://localhost:3000");

        try
        {
            string loginToken = await apiUser.Login("Test1@gmail.com", "Test123");
            Debug.Log("Logged in, got token: " + loginToken);
        }
        catch (System.Exception ex)
        {
            Debug.LogError(ex.Message);
        }
    }
}
