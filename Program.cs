// Wir teilen dem Programm mit wo unser Hub liegt
using BuzzerApp.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Wir fügen SignalR-Dienste hinzu
builder.Services.AddSignalR();

var app = builder.Build();

// Wir suchen automatisch nach einer index.html als Startseite
app.UseDefaultFiles();

// Wir erlauben das Ausliefern von Dateien aus dem wwwroot-Ordner
app.UseStaticFiles();

// Wir binden den Hub an eine andere Adresse (Routing)
app.MapHub<BuzzerHub>("/buzzerHub");

app.Run();
