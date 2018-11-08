module.exports = function (PRIMUS_LOCAL, GAME_STATUS, DEFAULT_COUNTRY) {
    var Conf = require('./server/gameConf.js');
    var IS_NGINX = process.env.NGINX;
    var crypto = require('crypto');
    var path = require('path');
    var favicon = require('serve-favicon');
    var url = require('url');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    });
    var BinHelper = require('./server/binhelper.js');
    var exphbs = require('express-handlebars');

    var authParser = require('basic-auth-parser');
    var servPort = process.env.PORT || '';
    var express = require('express'),
        Primus = require('primus'),
        app = express();
    var Emitter = require('primus-emitter');
    var server = require('http').createServer(app),
        primus = new Primus(server, {
            pathname: '/kark.live' + process.env.REGION,
            transformer: 'uws',
            parser: 'binary',
            pingInterval: false,
            strategy: 'online, disconnect'
        });
    primus.plugin('emitter', Emitter);
    var router = express.Router();
    var router2 = express.Router();
    var Socket = Primus.createSocket({
        transformer: 'uws',
        parser: 'binary',
        plugin: {
            'Emitter': require('primus-emitter')
        }
    });

    var debugData = require('./debugmode.js');
    app.set('views', path.join(__dirname, 'views'));

    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: __dirname + "/views/layouts/"
    }));
    app.set('view engine', 'handlebars');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(favicon(__dirname + '/public/images/favicon.ico'));
    app.use(('/', router));

    var ServerBlocks = null;
    var ItemManager = null;
    var serverBlocks = null;

    if (!IS_NGINX) {
        var ServerBlocks = require('./server/serverBlocks.js');
        var ItemManager = require('./server/ItemManager.js');
        var serverBlocks = new ServerBlocks(0);

    }


    require('./serverconf.js');
    require('./server/apprequests.js')(app);
    require('./server/req/payments.js')(app);
    require('./server/req/tagdb.js')(app);
    require('./server/req/dailyrewards.js')(app);
    require('./server/servercheck.js')(app);

    if (!IS_NGINX) {
        require('./server/primushandler')(app, primus, GAME_STATUS, serverBlocks);
    }



    /* GET home page. */
    router.get('/', function (req, res, next) {

        res.render('home', {
            mode: debugData.mode,
            dir: debugData.fileDir,
            port: debugData.port
        });
    });

    router.get('/changelog', function (req, res, next) {

        res.render('changelog');
    });
    router.get('/terms', function (req, res, next) {
        res.render('terms', {
            title: 'BOO'
        });
    });

    router.get('/privacy', function (req, res, next) {
        res.render('privacy');
    });




    if (GAME_STATUS === Conf.GAME_STATUS_N.local) {
        require('./server/baseReqs')(app, servPort, DEFAULT_COUNTRY, GAME_STATUS);

    } else if (GAME_STATUS == Conf.GAME_STATUS_N.live) {
        require('./server/baseReqs')(app, servPort, DEFAULT_COUNTRY, GAME_STATUS);
        require('./routes/locations')(app, servPort, bodyParser, GAME_STATUS);
    } else if (GAME_STATUS == Conf.GAME_STATUS_N.maintenance) {
        require('./server/baseReqs')(app, servPort, DEFAULT_COUNTRY, GAME_STATUS);
        require('./routes/locations')(app, servPort, bodyParser, GAME_STATUS);
    } else if (GAME_STATUS == Conf.GAME_STATUS_N.blocked) {
        require('./server/baseReqs')(app, servPort, DEFAULT_COUNTRY, GAME_STATUS);
        require('./routes/locations')(app, servPort, bodyParser, GAME_STATUS);
    }
    if (PRIMUS_LOCAL) {
        primus.library();
        primus.save(__dirname + '/jsdata/primus.js');

    }

    require('./routes/errors.js')(app);
    return server;
};