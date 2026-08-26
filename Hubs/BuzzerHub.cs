using Microsoft.AspNetCore.SignalR;

namespace BuzzerApp.Hubs;

public class BuzzerHub : Hub
{
    // Thread-Sicherheit bei simultanen Anfragen
    private static readonly object _lockObj = new object();

    // Zähler für alle aktiven Browser-Tabs
    private static int _aktiveVerbindungen = 0;

    // Speichert die Punkte aller Spieler (Key: Name, Value: Punkte)
    private static Dictionary<string, int> _punkte = new();

    // Speichert den Namen des Spielers, der gebuzzert hat.
    // Ist der Wert null, ist der Buzzer für alle freigegeben.
    private static string? _gebuzzert = null;


    // Registriert einen Spieler beim Betreten der Seite im System.
    public async Task Anmelden(string spielerName) {
        if (!_punkte.ContainsKey(spielerName)) {
            _punkte.Add(spielerName, 0);
        }
        await Clients.All.SendAsync("SpielerUpdate", _punkte);
    }

    // Registriert diesen Tab als Quizmaster
    public async Task AlsQuizmasterAnmelden() {
        await Groups.AddToGroupAsync(Context.ConnectionId, "Quizmaster");
    }

    // Übergabe des Namens des Spielers, der gebuzzert hat
    public async Task Buzzern(string spielerName) {
        lock (_lockObj) {
            if (_gebuzzert != null) {
                return;
            }

            // Sperrt den Buzzer für die anderen, indem der Name hinterlegt wird
            _gebuzzert = spielerName;
        }
        Console.WriteLine($"Empfangen: {spielerName} hat gebuzzert");

        // JavaScript-Funktion "EmpfangeBuzzer" in allen Browsern aufrufen
        await Clients.All.SendAsync("EmpfangeBuzzer", spielerName);
    }

    // Wird aufgerufen, wenn der Quizmaster die Antwort als richtig markiert
    public async Task AntwortRichtig() {
        // Der Spieler, der gebuzzert hat, erhält 4 Punkte
        if (_gebuzzert != null) {
            _punkte[_gebuzzert] += 4;
        }

        // Runde automatisch neu starten
        await ResetBuzzer();
    }

    // Wird aufgerufen, wenn der Quizmaster die Antwort als falsch markiert
    public async Task AntwortFalsch() {
        if (_gebuzzert != null) {
            // Alle Anderen Spieler erhalten 1 Punkt
            foreach (var spieler in _punkte.Keys.ToList()) {
                if (spieler != _gebuzzert) {
                    _punkte[spieler]++;
                }
            }
        }

        // Runde automatisch neu starten
        await ResetBuzzer();
    }

    // Methode, um die Runde für alle wieder freizugeben
    public async Task ResetBuzzer() {
        lock (_lockObj) {
            // Buzzer wieder freigeben
            _gebuzzert = null;
        }

        Console.WriteLine("Buzzer und Punkte wurden aktualisiert.");

        // Neue Punktstände senden und alle Buzzer entsperren
        await Clients.All.SendAsync("SpielerUpdate", _punkte);
        await Clients.All.SendAsync("BuzzerFreigeben");
    }

    public override async Task OnConnectedAsync() {
        lock (_lockObj) {
            if (_aktiveVerbindungen >= 5) {
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

            // Zähler beim Verlassen der Seite wieder verringern
            _aktiveVerbindungen--;
            Console.WriteLine($"Verbindung getrennt. Aktuell: {_aktiveVerbindungen}/5");
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Sendet den Text nur an die Gruppe "Quizmaster"
    public async Task AntwortSenden(string spielerName, string text) {
        await Clients.Group("Quizmaster").SendAsync("EmpfangeAntwort", spielerName, text);
    }
}