const connection = new signalR.HubConnectionBuilder()
    .withUrl("/buzzerHub")
    .build();

let countdownInterval;

// Punkte der Spieler auf der Seite aktualisieren
connection.on("SpielerUpdate", function (punkte) {
    const liste = document.getElementById("punkteListe");
    liste.innerHTML = "";
    for (const [name, punktzahl] of Object.entries(punkte)) {
        liste.innerHTML += `<li><strong>${name}:</strong> ${punktzahl} Punkte</li>`;
    }
});

// Anzeigen, wer gebuzzert hat und Bewertungs-Buttons freischalten
connection.on("EmpfangeBuzzer", function (spielerName) {
    const btn = document.getElementById("buzzerBtn");
    if (btn) {
        btn.disabled = true;
        btn.innerText = spielerName + " hat gebuzzert !";
        btn.style.backgroundColor = "gray";
    }

    const status = document.getElementById("statusMeldung");
    if (status) {
        status.innerText = spielerName + " hat gebuzzert !";
        document.getElementById("btnRichtig").disabled = false;
        document.getElementById("btnFalsch").disabled = false;
    }

    // Timer Logik
    let zeit = 5;
    document.getElementById("timerAnzeige").innerText = "Zeit: " + zeit + "s";

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        zeit--;
        if (zeit > 0) {
            document.getElementById("timerAnzeige").innerText = "Zeit: " + zeit + "s";
        }
        else {
            document.getElementById("timerAnzeige").innerText = "Zeit abgelaufen!";
            clearInterval(countdownInterval);
        }
    }, 1000);
});

// Status zurücksetzen und Bewertungs-Buttons wieder sperren
connection.on("BuzzerFreigeben", function () {
    document.getElementById("statusMeldung").innerText = "Wartet auf Spieler...";
    document.getElementById("btnRichtig").disabled = true;
    document.getElementById("btnFalsch").disabled = true;

    clearInterval(countdownInterval);
    document.getElementById("timerAnzeige").innerText = "";
});

connection.start().then(function () {
    connection.invoke("AlsQuizmasterAnmelden").catch(function (err) {
        console.error(err.toString());
    });
}).catch(function (err) {
    console.error(err.toString());
});

// Richtige Antwort an den Server senden
document.getElementById("btnRichtig").addEventListener("click", function () {
    connection.invoke("AntwortRichtig").catch(function (err) {
        console.error(err.toString());
    });
});

// Falsche Antwort an den Server senden
document.getElementById("btnFalsch").addEventListener("click", function () {
    connection.invoke("AntwortFalsch").catch(function (err) {
        console.error(err.toString());
    });
});

// Reset-Signal an den Server senden
document.getElementById("resetButton").addEventListener("click", function () {
    connection.invoke("ResetBuzzer").catch(function (err) {
        console.error(err.toString());
    });
});