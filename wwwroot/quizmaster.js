const connection = new signalR.HubConnectionBuilder()
    .withUrl("/buzzerHub")
    .build();

// Anzeigen, wer gebuzzert hat
connection.on("EmpfangeBuzzer", function (spielerName) {
    document.getElementById("statusMeldung").innerText = spielerName + " hat gebuzzert !";
});

// Status zurücksetzen
connection.on("BuzzerFreigeben", function () {
    document.getElementById("statusMeldung").innerText = "FREI !";
});

connection.start().catch(function (err) {
    console.error(err.toString());
});

// Reset-Signal an den Server senden
document.getElementById("resetButton").addEventListener("click", function () {
    connection.invoke("ResetBuzzer").catch(function (err) {
        console.error(err.toString());
    });
});