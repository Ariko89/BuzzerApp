using Microsoft.AspNetCore.SignalR;

namespace BuzzerApp.Hubs;

public class BuzzerHub : Hub
{
    private static bool _istGesperrt = false;
    private static readonly object _lockObj = new object();


    // Übergabe des Namen des Spielers der gebuzzert hat !
    public async Task Buzzern(string spielerName) {

        // Thread-Sicherheit bei simultanen Anfragen.
        lock (_lockObj) {
            if (_istGesperrt) {
                // Abbruch, falls bereits ein anderer Client den Buzzer ausgelöst hat.
                return;
            }

            // Setzt den Sperrstatus, um nachfolgende Aufrufe zu blockieren.
            _istGesperrt = true;
        }

        Console.WriteLine($"Empfangen: {spielerName} hat gebuzzert");
        // Clients.All sprechen wir alle Browser an
        // SendAsync um im Browser eine JavaScript-Funktion aufzurufen ("EmpangeBuzzer")
        // Und es wird der spielerName übergeben
        await Clients.All.SendAsync("EmpfangeBuzzer", spielerName);
    }

    // Methode um die Runde für alle wieder freizugeben.
    public async Task ResetBuzzer() {

        // Wieder freigeben
        lock (_lockObj) {
            _istGesperrt = false;
        }

        Console.WriteLine("Buzzer wurde zurückgesetzt.");

        //Sendet an alle Browser das Signal zum Entsperren.
        await Clients.All.SendAsync("BuzzerFreigeben");
    }

    // Zähler für alle aktiven Browser-Tabs (Spieler + Quizmaster)
    private static int _aktiveVerbindungen = 0;

    public override async Task OnConnectedAsync() {
        lock (_lockObj) {
            
            // Maximal 5 Verbindungen (4 Spieler + 1 Quizmaster)
            if(_aktiveVerbindungen >= 5) {

                // Maximale Anzahl erreicht: Verbindung sofort trennen.
                Context.Abort();
                return;
            }

            _aktiveVerbindungen++;
            Console.WriteLine($"Neue Verbindung. Aktuell: {_aktiveVerbindungen}/5");
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception) {
        lock (_lockObj) {

            // Zähler beim Verlassen der Seite wieder verringern.
            _aktiveVerbindungen--;
            Console.WriteLine($"Verbindung getrennt. Aktuell: {_aktiveVerbindungen}/5");
        }

        await base.OnDisconnectedAsync(exception);
    }
}