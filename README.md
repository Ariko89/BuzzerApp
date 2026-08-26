# Quiz-Buzzer App (ASP.NET Core SignalR)

Eine Echtzeit-Webanwendung für Quizspiele, entwickelt mit **C#, ASP.NET Core, SignalR** und **Vanilla JavaScript**. Die App bietet ein interaktives Erlebnis für Spieler und ein umfassendes Kontroll-Dashboard für den Quizmaster.

## Funktionen

### Für Spieler
* **Echtzeit-Buzzer:** Schnelles Buzzern via Button oder **Leertaste**.
* **Live-Punkte:** Anzeige des aktuellen Punktestands aller Teilnehmer.
* **Geheime Antworten:** Spieler können Textantworten über SignalR-Gruppen absenden, die **nur** der Quizmaster sieht.
* **Countdown:** Automatischer 5-Sekunden-Timer nach dem Buzzern.

### Für den Quizmaster
* **Antwort-Bewertung:** 
  * Richtig = 4 Punkte für den aktuellen Spieler.
  * Falsch = 1 Punkt für alle anderen Spieler.
* **Live-Dashboard:** Übersicht über alle angemeldeten Spieler, Punktestände und eingegebene Geheim-Antworten.
* **Manuelle Kontrolle:** Buzzer-Runden können jederzeit manuell zurückgesetzt werden.

### UI & Design
* **Dynamisches Login:** Das Namens-Eingabefeld verschwindet elegant nach der Anmeldung.
* **Dark / Light Mode:** Globaler Button zum Wechseln des Designs für eine augenschonende Nutzung.
* **Responsive Layout:** Einheitliches Design für Startseite, Spieler-Ansicht und Quizmaster-Bereich.

## Technologien

* **Backend:** C#, ASP.NET Core
* **Echtzeit-Kommunikation:** SignalR (inkl. Thread-sicherer Locks & Groups)
* **Frontend:** HTML5, CSS3, Vanilla JavaScript

## Installation & Start

1. Repository klonen:
   ```bash
   git clone [Deine-Repo-URL]