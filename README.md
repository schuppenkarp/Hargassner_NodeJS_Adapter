# Hargassner_NodeJS_Adapter

Adapter zur Kommunikation mit einem Heizkessel des Herstellers `Hargassner` und dessen Steuerung `Touch Control` mittels der nicht (offiziell) dokumentierten und freigegebenen Telnet Schnittstelle direkt am LAN Anschluss des Touch-Panel der Steuerung.

Weitere Informationen zum Protokoll:

1. [Hargassner / Rennergy Touchtronic Netzwerkanbindung/Visualisierung](https://www.mikrocontroller.net/topic/267831)
2. [Hargassner Datenprotokoll 155 Datenpakete](https://www.mikrocontroller.net/attachment/345852/Hargassner_Datenprotokoll_155_Pakete.pdf)

Leider war von Seiten der Fa. Hargassner mittels Anfrage an deren Support keine Unterstützung möglich.
Ich wurde auf die freigegebene MODBUS Schnittstelle verwiesen, welche jedoch kostenplichtig ist.

## Dekodierte Parameter

- Puffer

  - TemperaturOben ...in Grad Celsius
  - TemperaturMitte ...in Grad Celsius
  - TemperaturUnten ...in Grad Celsius
  - Füllgrad ...in Prozent

- Außentemperatur

  - live ...aktuelle Außentemperatur
  - gemittelt ...zeitlich gemittelte Außentemperatur

- Allgemein
  - Betriebszustand ...aktuell ist die Bedeutung noch nicht komplett klar
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
  - Standby ...boolscher Wert
  - Füllstand ...boolscher Wert
- Kessel

  - IstTemp ...Temperatur in Grad
  - SollTemp ...Temperatur in Grad
  - Glutbett ...Temperatur in Grad
  - RücklaufanhebungIst
  - RücklaufanhebungSoll
  - Unterdruck ...in Pascal
  - O2Ist ...Ist Sauerstoffanteil im Abgas
  - O2Soll ...Soll Sauerstoffanteil im Abgas
  - RauchgasTemp ...Temperatur in Grad

- Boiler 1/2

  - Ist ...Temperatur in Grad
  - Soll ...Temperatur in Grad
  - Pumpe ...boolscher Wert Ein/Aus der Boilerpumpe

- Heizkreis 1/2/3/4
  - VorlaufSoll
  - VorlaufIst
  - RaumtemperaturSoll
  - RaumtemperaturIst
  - Pumpe ...boolscher Wert
  - Mischer Auf ...boolscher Wert
  - Mischer Zu ...boolscher Wert

## Installation

Um dieses Paket unter Linux basierten Betriebssystemen zu installieren reicht ein einfaches:

```bash
npm install hargassner_telnet
```

Um die Installation gleich mit der aktuellen Version in Ihrer `package.json` Datei als Required-Package einzutragen:

```bash
npm install hargassner_telnet --save
```

Um das Paket global zu installieren:

```bash
npm install hargassner_telnet -g
```

## Verwendung

Das Paket beinhaltet das Kommandozeilenprogramm `hgboiler` um den aktuellen Stand des Heizkessels abzurufen. Dieses kann dementsprechend zusammen mit den Parametern aufgerufen werden.
Im Testskript `test/hgboiler-cli-test.bash` wird dies über die CI-Pipeline auch automatisiert getestet.

```bash
hgboiler --ip <IP-Adresse> --port <Port>
./bin/hgboiler.js --ip 192.168.2.57 --once=1 --endpoint hof.moaxn.bayern/ofen --timestamps true --site allmoning
```

Im Ordner `./test` ist außerdem ein Beispielprojekt hinterlegt, welches dieses Paket nutzt und die dekodierten Daten mittels Express Webserver zur Verfügung stellt.
Hierzu wird eine Hargassner-Steuerung emuliert.
Der Express Webserver ist unter localhost:3000 und somit am Port 3000 zu erreichen.

Anzeige der empfangen RAW-Daten mittels http://localhost:3000/raw.
Die dekodierten Daten können direkt mittels http://localhost:3000/ angezeigt werden.

## API

### Beispiel

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

- **net**-Package, welches bereits in der Standardinstallation von NodeJS global installiert ist

- Für die Testversion ist weiter das **express**-Package notwendig.

## Entwicklung

### Lokal

Zum Ausführen der Tests auf lokaler Ebene sind die folgenden Befehle notwendig:

```bash
npm install eslint textlint
npm run lint
npx eslint index.js
npx textlint README.md
```

Die Tests sind in der Datei `test/hgboiler-test.js` hinterlegt und können mit dem Befehl `npm test` ausgeführt werden. Hier wurden diese unter `Ubuntu 20.04` getestet.

```bash
npm test
```

### CI

Die CI-Pipeline ist in der Datei `.github/workflows/ci.yaml` und wird bei jedem Push ausgeführt.

## Test

Um Änderungen am Program zu testen, ist es hilfreich einen `feature` Branch zu erstellen und diesen dann auf dem Zielsystem lokal ebenfalls auf dem `feature` Branch zu testen.
Ist dieser Test erfolgreich sind die folgenden Befehle notwending um ein `Node.js`-Paket zu erstellen und dieses dann ebenfalls auf dem Zielsystem zu testen. Erst dann sollte der `feature` Branch in den `master` Branch integriert werden.

```bash
```

## Unterstützung

Jegliches Interesse an der Unterstützung dieses Projektes ist jederzeit willkommen!
Einfach melden michael@grabenschweiger.com

## Lizenz
Diese Projekt wird unter der GPLv3-Lizenz veröffentlicht.
