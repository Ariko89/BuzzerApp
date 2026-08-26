// Wir bereiten die Verbindung vor
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/buzzerHub")
    .build();

let meinName = "";
let countdownInterval;

// Hier hören wir dem Server zu, wenn es ein Punkte-Update gibt
connection.on("SpielerUpdate", function (punkte) {
    const liste = document.getElementById("punkteListe");
    liste.innerHTML = "";
    for (const [name, punktzahl] of Object.entries(punkte)) {
        liste.innerHTML += `<li><strong>${name}:</strong> ${punktzahl} Punkte</li>`;
    }
});

// Hier hören wir dem Server zu, wenn jemand gebuzzert hat
connection.on("EmpfangeBuzzer", function (spielerName) {
    // Hier blockieren wir alle Buzzer (damit niemand mehr drücken kann)
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

// Hier hören wir dem Server zu, wenn die Runde zurückgesetzt wird
connection.on("BuzzerFreigeben", function () {
    // Buzzer-Button für alle wieder klickbar machen, falls angemeldet
    if (meinName) {
        document.getElementById("buzzerBtn").disabled = false;
    }

    // Status wieder auf frei setzen
    document.getElementById("buzzerBtn").innerText = "BUZZER";
    document.getElementById("buzzerBtn").style.backgroundColor = "red";

    clearInterval(countdownInterval);
    document.getElementById("timerAnzeige").innerText = "";
});

// Hier wird die Verbindung gestartet
connection.start().catch(function (err) {
    console.error(err.toString());
});

// Klick-Event für den Anmelden-Button
document.getElementById("anmeldenBtn").addEventListener("click", function () {
    meinName = document.getElementById("spielerName").value;

    // Prüfen ob ein Name eingegeben wurde
    if (!meinName || meinName.trim() == "") {
        alert("Bitte gib zuerst deinen Namen ein!");
        return;
    }

    connection.invoke("Anmelden", meinName).catch(function (err) {
        console.error(err.toString());
    });

    // Buzzer aktivieren
    document.getElementById("buzzerBtn").disabled = false;

    // Login-Bereich komplett verstecken
    document.getElementById("loginBereich").style.display = "none";

    // Antwort-Feld für den Quizmaster einblenden
    document.getElementById("antwortBereich").style.display = "block";
});

// Klick-Event für den Buzzer
document.getElementById("buzzerBtn").addEventListener("click", function () {
    // Prüfen ob ein Name eingegeben wurde
    if (!meinName || meinName.trim() == "") {
        alert("Bitte melde dich zuerst an!");
        return;
    }

    connection.invoke("Buzzern", meinName).catch(function (err) {
        console.error(err.toString());
    });

    // Sound abspielen
    new Audio('buzzer.mp3').play();
});

// Leertaste zum Buzzern nutzen
document.addEventListener("keydown", function (event) {
    // Prüfen, ob die Leertaste gedrückt wurde
    if (event.code === "Space") {
        // Verhindert das Scrollen der Seite bei Leertaste
        event.preventDefault();

        // Simuliert einen Klick auf den Buzzer, falls dieser nicht gesperrt ist
        if (!document.getElementById("buzzerBtn").disabled) {
            document.getElementById("buzzerBtn").click();
        }
    }
});