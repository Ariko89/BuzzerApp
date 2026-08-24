// Wir bereiten die Verbindung vor
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/buzzerHub")
    .build();

// Hier hören wir dem Server zu, wenn jemand gebuzzert hat
connection.on("EmpfangeBuzzer", function (spielerName) {
    // Sound abspielen
    document.getElementById("buzzerSound").play();

    // Hier wird der text auf der Seite geändert
    document.getElementById("statusMeldung").innerText = spielerName + " hat gebuzzert !";

    // Hier blockieren wir alle Buzzer (damit niemand mehr drücken kann)
    document.getElementById("buzzerButton").disabled = true;
});

// Hier hören wir den Server zu, wenn die Runde zurückgesetzt wird
connection.on("BuzzerFreigeben", function () {

    // Status wieder auf frei setzen
    document.getElementById("statusMeldung").innerText = "FREI !"

    //Buzzer-Button für alle wieder klickbar machen
    document.getElementById("buzzerButton").disabled = false;
});

// Hier wird die Verbindung gestartet
connection.start().catch(function (err) {
    console.error(err.toString());
});

// Klick-Event für den Buzzer
document.getElementById("buzzerButton").addEventListener("click", function () {
    const meinName = document.getElementById("spielerName").value;

    // Prüfen ob ein Name eingegeben wurde
    if (!meinName || meinName.trim() == "") { 
        alert("Bitte gib zuerst deinen Namen ein!");
        return;
    }

    connection.invoke("Buzzern", meinName).catch(function (err) {
        console.error(err.toString());
    });
});