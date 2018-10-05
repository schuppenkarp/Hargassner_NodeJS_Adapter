var net = require('net');

function HargassnerTelnet(options) {
    this.data = {};
    this.raw = [];
    this._on = [];

    this._ip = "localhost";
    this._port = 23;

    if (options && options.IP) this._ip = options.IP;
    if (options && options.PORT) this._port = options.PORT;

};

HargassnerTelnet.prototype.connect = function() {
    var me = this;
    me._client = new net.Socket();

    me._client.connect(me._port, me._ip, function() {
        console.log('Connected to ', me._ip, ":", me._port);
    });
    me._client.on('close', function() {
        me.disconnect();
        me.connect();
    });
    me._client.on('data', function(str) {
        if (str.length > 100) {
            me.raw = str.toString().split(' ')
            me.data = me._parse(me.raw);
            me._on.forEach((elem) => {
                if (typeof(elem) === "function") elem(me.data);
            });
        } else console.log(data.toString());
    });
};

HargassnerTelnet.prototype.on = function(name, callback) {
    if (name && name == "data") {
        this._on.push(callback);
    }
}

HargassnerTelnet.prototype.disconnect = function() {
    this._client.destroy();
};

HargassnerTelnet.prototype._parse = function(arr) {
    var Heizung = {};
    Heizung.Puffer = {
        TemperaturOben: arr[23],
        TemperaturMitte: arr[24],
        TemperaturUnten: arr[25],
        Fuellgrad: arr[201]
    };

    Heizung.Aussentemperatur = {
        live: arr[21],
        gemittelt: arr[22]
    }

    Heizung.Allgemein = {
        Betriebszustand: arr[1],
        Betriebsstunden: {
            Steuerung: arr[157],
            Heizung: arr[158],
            Zuendung: arr[159],
            Saugzug: arr[160],
            Einschub: arr[113],
            Austragung: arr[161]
        },
        Entaschung: {
            AnzahlKlein: arr[166],
            AnzahlGross: arr[167],
            LaufzeitSeitEntaschung: arr[138] // Eventuell PRÜFEN!!!
        },
        Standby: ((parseInt(arr[206], 16) & 0x0001) > 0) ? true : false,
        FuellstandOK: ((parseInt(arr[206], 16) & 0x0002) > 0) ? true : false,
    };

    Heizung.Kessel = {
        IstTemp: arr[4],
        SollTemp: arr[5],
        Glutbett: arr[15],
        RuecklaufAnhebungIst: arr[27],
        RuecklaufAnhebungSoll: arr[28],
        RuecklaufPumpe: arr[29], // Nicht Sicher
        Unterdruck: arr[14],
        O2Ist: arr[2],
        O2Soll: arr[3],
        RauchgasTemp: arr[6]
    };

    Heizung.Boiler1 = {
        Ist: arr[42],
        Soll: arr[43],
        Pumpe: ((parseInt(arr[208], 16) & 0x0002) > 0) ? true : false
    };

    Heizung.Boiler2 = {
        Ist: arr[50],
        Soll: arr[51],
        Pumpe: ((parseInt(arr[208], 16) & 0x0004) > 0) ? true : false
    };

    Heizung.Heizkreis1 = {
        VorlaufSoll: arr[38],
        VorlaufIst: arr[36],
        RaumtemperaturIst: arr[128],
        RaumtemperaturSoll: arr[40],
        Pumpe: ((parseInt(arr[206], 16) & 0x0080) > 0) ? true : false,
        Mischer: {
            Auf: ((parseInt(arr[206], 16) & 0x0100) > 0) ? true : false,
            Zu: ((parseInt(arr[206], 16) & 0x0200) > 0) ? true : false
        }
    };
    Heizung.Heizkreis2 = {
        VorlaufSoll: arr[39],
        VorlaufIst: arr[37],
        RaumtemperaturIst: arr[129],
        RaumtemperaturSoll: arr[41],
        Pumpe: ((parseInt(arr[206], 16) & 0x0400) > 0) ? true : false,
        Mischer: {
            Auf: ((parseInt(arr[206], 16) & 0x0800) > 0) ? true : false,
            Zu: ((parseInt(arr[206], 16) & 0x1000) > 0) ? true : false
        }
    };
    Heizung.Heizkreis3 = {
        VorlaufSoll: arr[46],
        VorlaufIst: arr[44],
        RaumtemperaturIst: arr[130],
        Pumpe: ((parseInt(arr[209], 16) & 0x0001) > 0) ? true : false,
        Mischer: {
            Auf: ((parseInt(arr[209], 16) & 0x0002) > 0) ? true : false,
            Zu: ((parseInt(arr[209], 16) & 0x0004) > 0) ? true : false
        }
    };
    Heizung.Heizkreis4 = {
        VorlaufSoll: arr[47],
        VorlaufIst: arr[45],
        Pumpe: ((parseInt(arr[209], 16) & 0x0008) > 0) ? true : false,
        Mischer: {
            Auf: ((parseInt(arr[209], 16) & 0x0010) > 0) ? true : false,
            Zu: ((parseInt(arr[209], 16) & 0x0020) > 0) ? true : false
        }
    };

    return Heizung;
};


module.exports = HargassnerTelnet;