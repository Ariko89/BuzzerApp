# 🔴 SignalR Quiz-Buzzer

Ein schnelles Echtzeit-Multiplayer-Buzzersystem für Quizrunden. Dieses Projekt ist als Praxisprojekt entstanden, um C# und asynchrone Web-Kommunikation zu vertiefen – mit ein wenig KI-Unterstützung beim Feinschliff der Logik. 

Ziel war es, eine absolut synchrone Auswertung zu garantieren, wenn mehrere Leute exakt gleichzeitig auf den Buzzer hauen.

## ✨ Features
* **Millisekunden-genauer Lock:** Thread-Sicherheit (`lock` in C#) garantiert, dass immer nur ein Spieler den Buzzer auslösen kann.
* **Teilnehmer-Limit:** Der Hub erlaubt maximal 5 Verbindungen (4 Spieler + 1 Quizmaster). Weitere Verbindungen werden serverseitig direkt gekappt.
* **Quizmaster-Dashboard:** Ein separates Pult (`quizmaster.html`), um den Buzzer für die nächste Runde wieder freizugeben.
* **Audio-Feedback:** Automatischer MP3-Sound beim Auslösen.

## 🚀 Tech-Stack
* **Backend:** C#, ASP.NET Core SignalR
* **Frontend:** HTML, CSS, JavaScript (Vanilla)

## 🛠️ Lokale Installation
1. Repository klonen.
2. Im Projektverzeichnis das Terminal öffnen und `dotnet run` ausführen.
3. Im Browser aufrufen:
   * **Spieler:** `http://localhost:<PORT>`
   * **Quizmaster:** `http://localhost:<PORT>/quizmaster.html`
