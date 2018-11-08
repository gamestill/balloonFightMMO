var SERVE_TYPE = {
    "static_files": 1,
    "app": 2
};
///data arrays for server deployment
var unused = ['198.58.103.82'];
var GAME_SERVERS_ASIA = ['172.104.176.152'];
var GAME_SERVERS_EU = ['172.104.237.77'];
var GAME_SERVERS_NA= ['198.58.105.106','96.126.102.16','198.58.103.82'];
var NGINX_SERVERS = ['198.58.105.106'];

var GAME_SERVERS_ALL = ['198.58.105.106','96.126.102.16','198.58.103.82','172.104.237.77','172.104.176.152'];

var GAME_SERVERS_KEYS = ['game_server_us_linode_1/id_rsa'];
var NGINX_SERVERS_KEYS = ['nginx_server/id_rsa'];
///data arrays for server deployment

var plan = require('flightplan');
var vers = require('./package.json').version;
var appName = 'karkio';
var PRIVATE_KEY_PATH = '/Users/gamestill/.ssh/id_rsa';
var username_game = 'tinygame';
var startFile = 'bin/www';
var VERSION = vers;
console.log('verions;' + VERSION);
var tmpDir = appName + '-' + VERSION;
var nginxName = appName + "_static";
var nginxTmpDir = appName + '_static' + '-' + VERSION;
var CURR_SERV_TYPE = SERVE_TYPE.static_files;

//game
var MY_GAME_SERVERS_ASIA = (function SERVERSLIST_P() {
    var ret = [];
    for (var i = 0; i < GAME_SERVERS_ASIA.length; i++) {
        ret.push({
            host: GAME_SERVERS_ASIA[i],
            username: username_game,
            privateKey: '' + PRIVATE_KEY_PATH,
            agent: process.env.SSH_AUTH_SOCK
        });
    }
    return ret;
})();
//europe servers
var MY_GAME_SERVERS_EU = (function SERVERSLIST_P() {
    var ret = [];
    for (var i = 0; i < GAME_SERVERS_EU.length; i++) {
        ret.push({
            host: GAME_SERVERS_EU[i],
            username: username_game,
            privateKey: '' + PRIVATE_KEY_PATH,
            agent: process.env.SSH_AUTH_SOCK
        });
    }
    return ret;
})();
// north america servers
var MY_GAME_SERVERS_NA = (function SERVERSLIST_P() {
    var ret = [];
    for (var i = 0; i < GAME_SERVERS_NA.length; i++) {
        ret.push({
            host: GAME_SERVERS_NA[i],
            username: username_game,
            privateKey: '' + PRIVATE_KEY_PATH,
            agent: process.env.SSH_AUTH_SOCK
        });
    }
    return ret;
})();
var MY_NGINX_SERVERS = (function SERVERSLIST_N() {
    var ret = [];
    for (var i = 0; i < NGINX_SERVERS.length; i++) {
        ret.push({
            host: NGINX_SERVERS[i],
            username: username_game,
            privateKey: '' + PRIVATE_KEY_PATH,
            agent: process.env.SSH_AUTH_SOCK
        });
    }
    return ret;
})();

MY_GAME_SERVERS_ALL = (function SERVERSLIST_N() {
    var ret = [];
    for (var i = 0; i < GAME_SERVERS_ALL.length; i++) {
        ret.push({
            host: GAME_SERVERS_ALL[i],
            username: username_game,
            privateKey: '' + PRIVATE_KEY_PATH,
            agent: process.env.SSH_AUTH_SOCK
        });
    }
    return ret;
})();

plan.target('us', MY_GAME_SERVERS_NA);
plan.target('asia', MY_GAME_SERVERS_ASIA);
plan.target('europe', MY_GAME_SERVERS_EU);

plan.target('nginx', MY_NGINX_SERVERS);
plan.target('all', MY_GAME_SERVERS_ALL);

// run commands on localhost

plan.local(function (local) {

    var input = local.prompt('Deployment type? static[s]/game[g]');

    if (input === 's' || input === 'S') {
        CURR_SERV_TYPE = SERVE_TYPE.static_files;
        //     // local.log('Run build');
        //     // local.exec('gulp build');
        local.log('Copy files to remote hosts');
        var filesToCopy = local.exec('git ls-files -- "public/"', {
            silent: true
        });

        local.transfer(filesToCopy, '/tmp/' + nginxTmpDir);
    } else if (input === 'g' || input === 'G') {
        CURR_SERV_TYPE = SERVE_TYPE.app;
        // local.log('Run build');
        // local.exec('gulp build');
        local.log('Copy files to remote hosts');
        var filesToCopy = local.exec('git ls-files', {
            silent: true
        });
        local.transfer(filesToCopy, '/tmp/' + tmpDir);
    } 
   
    else  {
        plan.abort("Plane crashed because the pilot don't know which button to press XOXO.");
    }
});

// run commands on remote hosts (destinations)
plan.remote(function (remote) {
    if (CURR_SERV_TYPE === SERVE_TYPE.static_files) {
        remote.log('Move folder to root');
        remote.sudo('cp -R /tmp/' + nginxTmpDir + ' ~', {
            user: username_game
        });
        remote.rm('-rf /tmp/' + nginxTmpDir);

        remote.sudo('ln -snf ~/' + nginxTmpDir + ' ~/' + nginxName, {
            user: username_game
        });

    } else  if (CURR_SERV_TYPE === SERVE_TYPE.app) {
        remote.log('Move folder to root');
        remote.sudo('cp -R /tmp/' + tmpDir + ' ~', {
            user: username_game
        });
        remote.rm('-rf /tmp/' + tmpDir);
        remote.log('Install dependencies');
        remote.sudo('npm --production --prefix ~/' + tmpDir + ' install ~/' + tmpDir, {
            user: username_game
        });
        remote.log('Reload application');
        remote.sudo('ln -snf ~/' + tmpDir + ' ~/' + appName, {
            user: username_game
        });
        // remote.sudo('pm2 stop ecosystem.config.js', { failsafe: true });
        //  remote.sudo('pm2 start ecosystem.config.js');
        // remote.exec('pm2 start ecosystem.config.js ~/' + appName + '/' + startFile + " -i 0");
    } else {
        plan.abort("Plane crashed because the pilot don't know which button to press. XOXO");
    }
});