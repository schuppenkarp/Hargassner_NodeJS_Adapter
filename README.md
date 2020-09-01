# Hargassner_NodeJS_Adapter

Adapter zur Kommunikation mit einem Heizkessel des Herstellers 'Hargassner' und dessen Steuerung 'Touch Control' mittels der nicht (offiziell) dokumentierten und freigegebenen Telnet Schnittstelle direkt am Lan Anschluss des Touch-Panel der Steuerung.

Weiter Informationen zum Protokoll:

1. https://www.mikrocontroller.net/topic/267831
2. https://www.mikrocontroller.net/attachment/345852/Hargassner_Datenprotokoll_155_Pakete.pdf

Leider war von Seiten der Fa. Hargassner mittels Anfrage an deren Support keine Unterstützung möglich.
Ich wurde auf die freigegeben MODBUS Schnittstelle verwiesen, welche jedoch kostenplichtig ist.

## Dekodierte Parameter

- Puffer

  - TemperaturOben ...in Grad Celsius
  - TemperaturMitte ...in Grad Celsius
  - TemperaturUnten ...in Grad Celsius
  - Füllgrad ...in Prozen

- Außentemperatur

  - live ...aktuelle Außentemperatur
  - gemittelt ...zeitlich gemittelte Außentemperatur

- Allgemein
  - Betriebszustand ... aktuell ist die Bedeutung noch nicht komplett klar
  - Betriebsstunden
    - Steuerung
    - Heizung
    - Zündung
    - Saugzug
    - Einschub
    - Austragung
  - Entaschung
    - AnzahlKlein ...Anzahl der bereits durchgeführten kleinen Entaschungen
    - AnzahlGroß ...Anzahl der bereits durchgeführten großen Entaschungen
    - LaufzeitSeitEntaschung
  - Standby ... boolscher Wert
  - Füllstand ... boolscher Wert
- Kessel

  - IstTemp ... Temperatur in Grad
  - SollTemp ... Temperatur in Grad
  - Glutbett ... Temperatur in Grad
  - RücklaufanhebungIst
  - RücklaufanhebungSoll
  - Unterdruck ... in Pascal
  - O2Ist ... Ist Sauerstoffanteil im Abgas
  - O2Soll ... Soll Sauerstoffanteil im Abgas
  - RauchgasTemp ... Temperatur in Grad

- Boiler 1/2

  - Ist ... Temperatur in Grad
  - Soll ... Temperatur in Grad
  - Pumpe ... boolscher Wert Ein/Aus der Boilerpumpe

- Heizkreis 1/2/3/4
  - VorlaufSoll
  - VorlaufIst
  - RaumtemperaturSoll
  - RaumtemperaturIst
  - Pumpe ... boolscher Wert
  - Mischer Auf ... boolscher Wert
  - Mischer Zu ... boolscher Wert

## Installation

Um dieses Packet zu Installieren reicht ein einfaches

```
npm install hargassner_telnet
```

Um die Installation gleich mit der aktuellen Version in ihrer package.json Datei als Required-Package einzutragen:

```
npm install hargassner_telnet --save
```

Um das Packet Global zu installieren

```
npm install hargassner_telnet -g
```

## Verwendung

Das Paket beinhaltet das Kommandozeilenprogramm `hgboiler` um den aktuellen Stand des Heizkessels abzurufen.

Im Ordern `./test` ist außerdem ein Beispielsprojekt hinterlegt, welches dieses Paket nutzt und die Dekodierten Daten mittels Express Server zur Verfügung stellt.
Hierzu wird eine Hargassner-Steuerung Emuliert.
Der Express Webserver ist unter localhost:3000 und somit am Port 3000 zu erreichen.

Anzeige der empfangen RAW-Daten mittels http://localhost:3000/raw.
Die Dekodierten Daten können direkt mittels http://localhost:3000/ angezeigt werden.

## API

### Example

```javascript
var Hargassner = require("hargassner_telnet");
var Zentralheizung = new Hargassner({
  IP: "localhost",
  PORT: 23
});

Zentralheizung.connect();

Zentralheizung.on("data", data => {
  console.log(data);
});

var DataObject = Zentralheizung.data; //Liefert die aktuellen Daten welche aus dem Datensatz extrahiert wurden.
```

### Methode connect(options)

Für die Methode `Hargassner.connect(options)` kann das Objekt `options` angegeben werden, wobei hier die beiden Subobjekte `IP` sowie `PORT` relevant sind.
Die IP-Adresse `options.IP` wird falls nicht explizit angegeben standardmässig mittels `localhost` angenommen.
Der TCP-Port `options.PORT` wird falls nicht explizit angegeben standardmässig mittels `23` angenommen was dem Port für TELNET entspricht.

### Methode disconnect()

Beendet die Verbindung mit der Heizungssteuerung.

### Methode parse(array)

Parst eine von der Heizung gelieferte Zeile Rohdaten und liefert dekodierte Parameter.

### Event Hargassner.on

```javascript
Zentralheizung.on("data", data => {});
```

Erstellt einen Eventlistener auf das Event "on" welches bei dem neuen Empfangen Datensatz gefeuert wird.
im Object data ist das bereits geparste Datenpaket der Heizungssteuerung enthalten.

## Abhängigkeiten

- net-Package, welche bereits in der Standardinstallation von NodeJS global installiert ist

Für die Testversion ist weiters das Paket

- Express
  notwendig.

## Unterstützung

Jegliches Interesse an der Unterstützung dieses Projektes ist jederzeit willkommen!
Einfach melden michael@grabenschweiger.com

## Lizenz
Diese Projekt wird under der GPLv3-Lizenz veröffentlicht.
