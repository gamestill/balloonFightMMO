var Color = require('./common/colors.js');
var SKIN_BOT_CLR = '#a09e9e';
var SKIN_BOT_CLR_T = '#a09e9e00';

function cns(msg, clr, clr2) {
    var cl2 = clr2 || Color.WHITE;
    console.log('%c' + msg, 'color:' + clr + ';font-size:12px;background:' + cl2 + ';font-weight: bold;padding:5px');
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}
var POP_MATCH_TEXT = 'Play';

var IMG_SIZE = 172;
(function () {
    window.gver = 'GAMEVER_0.1.13990';
    var str = '' + window.gver;
    if (str.length < 10) {
        return;
    }
    var p1 = str.substr(8, str.length - 8);
    if (p1.length < 1) {
        return;
    }
    var chars = ('' + p1).split('.');
    var c3 = +chars[2];
    c3 = c3 + 1;
    window.gver = 'GAMEVER_' + c3;
    window.gv = '' + c3;
})();

var DISABLE_CONTEXT_MENU = true;
var pingRec = false;
// new

var SOCIAL_ENABLED = false;
var FPS = 60;
var dev = 1;
var RESTART_LOADING_TIME = 250;
var COINS_POP_HIDE_TIME = 1600;
var TTimer = require('./common/TinyTimer.js');
var LZStr = require("./lz-string.js");
var BW = require('./common/BinaryWriter.js');
var BR = require('./common/BinaryReader.js');
var FONT_SIZE_MED = '22px';
var FONT_LARGE1 = '25px';
var FONT_LARGE2 = '30px';
var FONT_NORMAL = '17px';
var yshift = 0;
var Player = require('./player.js');
var TWEEN = require('./tw.js');
var P = require('./pixinc.js');
// var Score = require('./score.js');
var K_SENS = 0.7;
var GAME_BACKGROUND = 'bg';
KEYBOARD_INIT_TIME = 500;
var SocialPage = require('./socialpage.js');
var Keys = require('./keyboard.js');
var JQuery = $ = require('jquery');
var http = require('http');
var commonFn = require('./commonfn.js');
var Leagues = require('./league.js');
var Quests = require('./quests.js');
var RendererObj = require('./renderer.js');
var League = require('./league.js');
var Skinner = require('./skinner.js');
var Social = require('./social.js');
var Conf = require('./gameConf.js');
var ComboBar = require('./combobar.js');
var CH_DATA = {
    NO_NAME: {
        'jqid': 'gname',
        'wid': 'wname',
        'sid': 's_name'
    },
    NO_SKIN: {
        'jqid': 'gskin',
        'wid': 'wskin',
        'sid': 's_skin'
    },
    NO_COLOR: {
        'jqid': 'gcolor',
        'wid': 'wcolor',
        'sid': 's_color'
    },
    NO_SOUND: {
        'jqid': 'gsound',
        'wid': 'wsound',
        'sid': 's_sound'
    },
    MUSIC: {
        'jqid': 'gmusic',
        'wid': 'wmusic',
        'sid': 's_music'
    },
}
var GameAds = require('./admanager.js');
//var SoundM = require('./SoundManager.js');
var SuperChat = require('./superchat.js');
var GameVer = require('./gamever.js');
var GameTips = require('./gametips.js');
var CD = Conf.CODES;
var port = 0;
var CONN_STR = "";
var ipadd = "";

Conf.MAIN_CONN = CONN_STR;
var FastMath = require('./fastmath.js');
var fMath = new FastMath();
var Tags = require('./tauntm.js');
var Leaderboard = require('./leaderboard.js');
var ReqServer = require('./reqserver.js');
var G_CON = require('./common/gconsole.js');
var OView = require('./common/oview.js');
var G_DEBUG = require('./common/debugview.js');
var ErrorHandler = require('./common/errorhandler.js');
var ClientBlocks = require('./clientBlocks.js');
var GameFood = require('./gamefood.js');
var roomId = 0;
var chartdata = [];
var tttt = 0;
var ctx;
var mmax = Math.max;
var mmin = Math.min;
var CURR_REND = {
    NONE: 0,
    WORLD: 1,
    GAME: 2,
};
var kkeys = Object.keys;
var TIP_INTERVAL = Conf.TIP_INTERVAL;
var TIP_RAND_START = Conf.TIP_RAND_START;
var TIP_RAND_DEL = Conf.TIP_RAND_DEL;
var TIP_DELTA = Conf.TIP_DELTA;
//var DELTA_DATA_TIME_SEC = 24*60*60;
var DELTA_DATA_TIME_SEC = 30;
var tinyscrollbar = require('./frogscroll.js');

function JQ_click(classname, id_class, cb) {
    $("" + id_class + classname).off('click').on('click', cb);
}



function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}



function getDiscData() {
    return Soulcrashers.Templates.disconnect();
}

function getSkinData() {


    var size = IMG_SIZE;
    var clrs = [];

    var data = Conf.SKINS_DATA;
    var keys = Object.keys(data);
    // for (var i = 0; i < data.length; i++) {
    //     clrs.push([data[i], Conf.SKIN_LOW]);
    // }
    var cats = [];
    var _catData = {};
    var catDataForAKey = [];
    for (var i = 0; i < keys.length; i++) {
        cats.push(keys[i]);
        catDataForAKey = data[keys[i]];
        _catData['' + keys[i]] = [];
        for (var j = 0; j < catDataForAKey.length; j++) {
            _catData['' + keys[i]].push({
                name: catDataForAKey[j],
                left: j * IMG_SIZE,
                size: 140
            });
        }
    }
    var bgclrs = [
        '#ff0000',
        '#00ff00',
        '#00ffff',
        '#ffff00',
        '#ff00ff',

    ];

    // var allW = clrs.length * size;
    var allW = 600;
    var skinData = {
        allwidth: allW,
        skinCats: [],
        skinCatData: [],
        bgclrs: []
    };
    var skinTemplate = Soulcrashers.Templates.skinclr;
    for (var i = 0; i < cats.length; i++) {
        skinData.skinCats.push({
            skinCatName: cats[i]
        });
        skinData.skinCatData.push({
            skinCatValue: cats[i],
            allwidth: 4000,
            singleWidth: 200,
            x: 140,
            catData: _catData[cats[i]]

        });
    }

    if (skinData.skinCats.length > 0) {
        return skinTemplate(skinData);
    }
}

function getTimeIssueData() {
    return Soulcrashers.Templates.timesettings();
}

function getOveloadedData() {
    return Soulcrashers.Templates.overload();
}

function houseKeeping_jq() {
    if ($ !== null) {
        $.extend($.easing, {
            customEasing: function (x, t, b, c, d) {
                t /= d;
                t--;
                return -c * (t * t * t * t - 1) + b;
            }
        });
        String.prototype.capitalizeFirstLetter = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        $.fn.extend({
            disableSelection: function () {
                this.each(function () {
                    if (typeof this.onselectstart != 'undefined') {
                        this.onselectstart = function () {
                            return false;
                        };
                    } else if (typeof this.style.MozUserSelect != 'undefined') {
                        this.style.MozUserSelect = 'none';
                    } else {
                        this.onmousedown = function () {
                            return false;
                        };
                    }
                });
            }
        });
    }
}

function appHouseKeeping(app) {
    $('.user-header-in img').attr("src", Conf.GUEST_IMG_URL);
    $("#debug_view").off('change paste keyup').on("change paste keyup", function () {
        if ($(this).val() == '`') {
            $(this).val('');
        }
    });
    $('.ol-debugview').off('contextmenu').on("contextmenu", "#canvas", function (e) {
        var bool = DISABLE_CONTEXT_MENU;
        return !bool;
    });
    $('.ol-debugview').off('click').on('click', function (e) {

        e.stopImmediatePropagation();
    });
    var h = $('.ol-debugview').outerHeight(true);
    var w = $('.ol-debugview').outerWidth(true);
    $('.debug-top').height(50).width(w - 20);
    $('.debugcontainer').height(h - 50);
}


function updateContScroll(cont) {
    var totalHeight = 0;
    var mainHeight = $('' + cont).outerHeight(true);
    $('' + cont).children().each(function () {
        totalHeight = totalHeight + $(this).outerHeight(true);
    });
    if (totalHeight > mainHeight) {
        $('' + cont).css('overflow-y', 'scroll');
    } else {
        $('' + cont).css('overflow-y', 'hidden');
    }
}

function clearText(name, type) {
    if (type === 'id') {
        $('' + name).val('');

    } else {
        $('' + name).text('');

    }
}

function mainFocus(name) {
    $('' + name).focus();
}

function getByteLen(normal_val) {
    // Force string type
    normal_val = String(normal_val);

    var byteLen = 0;
    for (var i = 0; i < normal_val.length; i++) {
        var c = normal_val.charCodeAt(i);
        byteLen += c < (1 << 7) ? 1 :
            c < (1 << 11) ? 2 :
            c < (1 << 16) ? 3 :
            c < (1 << 21) ? 4 :
            c < (1 << 26) ? 5 :
            c < (1 << 31) ? 6 : Number.NaN;
    }
    return byteLen;
}

function genId(count) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    var ret = '';
    for (var i = 0; i < count; i++) {
        ret += s4();
    }
    return ret;
};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
var GameClient = function () {

    // new data
    //timers
    this.myData = [];
    this.karkUpdate = function () {

    };
    this.karkRender = function () {

    };
    var rendererObj = null;
    var primus;
    var keyboard = null;
    var camera = null;
    this.allRegions = {};
    this.gameVer = null;
    // this.scoreManager = null;
    this.stime = 0;
    this.baseClock = 0;
    this.lastSTime = 0;
    this.waitingFlag = true;
    this.slowTimer = null;
    this.logoLoadTimer = null;
    this.lastServTime = 0;
    this.servTime = 0;
    this.musicOn = true;
    this.packDt = 0;
    this.appTime = 0;
    this.currLoopTime = 0;
    this.lastLoopTime = 0;
    this.lastInputTime = 0;
    this.lastLocalTime = performance.now();
    this.lastCurrTime = this.appStart = performance.now();
    this.player = null;
    this.lastPlayers = [];
    this.nextInput = 0;
    this.resultWindow = $('#od');
    this._coffset = 0;
    this.ctimeArr = [];
    this.packets = [];
    this._coffset_avg = 0;
    this.lastPackFromServ = 0;
    this.lastPackSize = 0;
    this.skinsData = [];
    this.roundTripTime = 0;
    this.cw = this.bw = window.innerWidth;
    this.ch = this.bh = window.innerHeight;
    //timers
    this.tipUpdateOn = true;
    this.latency = 0;
    this.alatency = 0;
    this.lastLatency = 0;
    this.lat_coll = [];
    this.gameOView = null;
    this.soundManager = null;
    this.packRec = 0;
    this.superChat = null;
    this.ticker = null;
    this.maxDel = 0;
    this.musicHighRate = false;
    this.clientBlocks = null;
    this.counter = 0;
    //new data endss
    this.currInputTime = 0;
    // private data
    this.combobar = null;
    this.canPrepareForNextGame = false;
    this.disableEnterKey =false;
    var PRIM_OBJ;

    var taunts = new Tags();

    var baseConnectDone = false;
    var lastRegion = "";

    var FIRE_DELTA = 30;

    var __newConn = true;
    var curr_render;
    var social = null;
    var DISCONNECT_TIME = Conf.DISCONNECT_TIME;
    var gameTimeout = false;
    this.application = null;
    this.gameMode = null;
    this.isInside = false;
    this.timespan = 0;
    this.xtoken = "";
    this.waitingTime = -1;
    this.canPlay = true;
    this.leagues = null;
    this.callTimes = 0;
    this.quests = null;
    this.cleaningDoneAt = 0;
    this.restart = false;
    this.quality = Conf.QUALITY.medium;
    this.playBtnReady = false;
    this.socialPage = null;
    this.lastTag = "";
    this.ingame = false;

    this.matchTime = 0;
    this.matchTimeFormatted = '0:00';
    this.matchOn = false;

    this.lastKAng = 0;
    this.playCount = 0;
    this.adShown = 0;
    this.tagsList = null;

    this.adsShown = 0;
    this.updateCoinsPopup = false;
    this.online = false;
    this.timeAlive = 0;
    this.playerStartTime = 0;
    this.user_name = "";
    this.guest_name = "";
    this.table = {};


    this.freeMouse = {
        x: 0,
        y: 0
    };

    this.uid = "";
    this.decisionHandle = null;
    this.toSendInput = {
        all: [],
        toSend: [],
        space: 0,
        ctrl: 0,
        zoom: 1,
        bot: 0,
        remove: 0,
        ball: 0,
        l: 0,
        r: 0
    };
    this.cinp = [0, 0];
    this.rewardIntervalHandle = null;
    this.pname = "";
    this.MAX_MATCHTIME = 100;
    this.loggedIn = false;
    this.fireDelta = 0;
    this.errorhandler = null;
    this.lastTime = Date.now();
    this.lastFireTime = Date.now();
    this.otherPlayers = {};
    this.timeSinceLastShake = 0;
    this.adManager = null;
    this.discData = [];
    this.otherPlayersKeys = {};
    this.choices = undefined;
    this.gd_load = false;
    curMode_element = null;
    lastMode_element = null;
    this.cur_m_str = "KNT";
    this.reqServer = new ReqServer(this);
    this.skinner = null;
    this.pressE_tween = null;
    this.canZoom = true;
    this.dbConnected = false
    this.changeToMenu = false;
    this.scrollInterval;
    this.lb = null;
    this.tb = undefined;
    this.secInt;
    var _intervals = [];
    this.startColorAni = (function () {

    })();

    this.getAppTime = function () {
        return this.appTime;
    }
    this.newRegion = function () {
        console.log('entering new region:' + window.priority);
    }
    this.showOverloadedMsg = function () {
        var self = this;
        // this.changePlayBtnState(2);
        this.showWindow(FONT_NORMAL, false, null, null, null, null, true, function () {
            self.showWindow(FONT_LARGE1, true, getOveloadedData, '.overloaded-panel', "Servers ares overloaded", [450, 450], false);
            $('.main-connect').off('click').on('click', function () {
                location.reload(true);
            });
        });
    };

    this.timeSettingsIssue = function () {
        var self = this;
        // this.changePlayBtnState(2);
        this.showWindow(FONT_NORMAL, false, null, null, null, null, true, function () {
            self.showWindow(FONT_LARGE1, true, getTimeIssueData, '.timesetting-panel', "Incorrect Clock Time", [450, 450], false);
            $('.main-connect').off('click').on('click', function () {
                location.reload(true);
            });
        });
    };



    this.disconnectGame = function () {
        var self = this;
        // var od = $('#od');
        // if (od.is(':visible')) {
        //     od.hide();
        //     if (this.pressE_tween) {
        //         this.pressE_tween.stop();
        //         this.pressE_tween = null;
        //     }
        // }
        $('.option-heading').css('font-size', FONT_LARGE2);
        if ($('#soul-login-play').is(":visible")) {
            this.changePlayBtnState(2);
            self.showWindow(FONT_NORMAL, false, null, null, null, null, true, function () {
                self.showWindow(FONT_LARGE1, true, getDiscData, '.disc-panel', "DISCONNECTED", [450, 450], false);
                $('.main-connect').off('click').on('click', function () {
                    location.reload(true);
                });
            });
        } else {
            self.showWindow(FONT_NORMAL, false, null, null, null, null, true, function () {
                self.showWindow(FONT_LARGE1, true, getDiscData, '.disc-panel', "DISCONNECTED", [450, 450], false);
                $('.main-connect').off('click').on('click', function () {
                    location.reload(true);
                });
            });
        }
    };

    this.addKeyboardEvents = function () {
        var currtime;
        var timeout;
        var $this = this;
        var startNo = 1;
        var endNo = 9;
        var i = 0;
        var self = this;
        var _cam = $this.getRenderer().camera;
        for (i = startNo; i <= endNo; i++) {
            keyboard.removeAllListeners('k:' + i).on('k:' + i, (function (key) {
                if (!$this.player && $this.ingame) {
                    return;
                }
                self.showChatMsg(key);
            }).bind(this));
        }

        keyboard.removeAllListeners('k:ret').on('k:ret', function () {
            // if ($('.ol-debugview').is(':visible')) {
            //     self.runDebugCommand();
            // }
        });
        keyboard.removeAllListeners('k:w').on('k:w', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.remove = 1;
                $this.player.lc();
                $this.splash(1, $this.player.position.x, $this.player.position.y);
            }

        });
        keyboard.removeAllListeners('k:w_').on('k:w_', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.remove = 6;
                $this.player.lc_up();
            }
        });
        keyboard.removeAllListeners('k:s').on('k:s', function () {


        });
        keyboard.removeAllListeners('k:s_').on('k:s_', function () {

        });
        keyboard.removeAllListeners('m:rc').on('m:rc', function () {

        });
        keyboard.removeAllListeners('m:rc_').on('m:rc_', function () {

        });
        keyboard.removeAllListeners('k:ctrl').on('k:ctrl', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.ctrl = 1;
            }
        });

        keyboard.removeAllListeners('k:rc').on('k:rc', function () {


        });
        keyboard.removeAllListeners('k:rc_').on('k:rc_', function () {

        });
        keyboard.removeAllListeners('k:up').on('k:up', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.remove = 1;
                $this.player.lc();
            }

        });
        keyboard.removeAllListeners('k:up_').on('k:up_', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.remove = 6;
                $this.player.lc_up();
                $this.splash(1, $this.player.position.x, $this.player.position.y);
            }
        });

        keyboard.removeAllListeners('k:space').on('k:space', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.ball = 1;
            }

        });
        keyboard.removeAllListeners('k:space_').on('k:space_', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.ball = 6;
            }
        });
        keyboard.removeAllListeners('k:a').on('k:a', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.l = 1;
                $this.player.leftC();
            }
        });
        keyboard.removeAllListeners('k:a_').on('k:a_', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.l = 6;
                $this.player.leftUp();
            }
        });


        keyboard.removeAllListeners('k:left').on('k:left', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.l = 1;
                $this.player.leftC();
            }
        });
        keyboard.removeAllListeners('k:left_').on('k:left_', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.l = 6;
                $this.player.leftUp();
            }
        });

        keyboard.removeAllListeners('k:d').on('k:d', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.r = 1;
                $this.player.rightC();
            }
        });
        keyboard.removeAllListeners('k:d_').on('k:d_', function () {
            if ($this.player) {
                $this.toSendInput.r = 6;
                $this.player.rightUp();
            }
        });

        keyboard.removeAllListeners('k:right').on('k:right', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.r = 1;
                $this.player.rightC();
            }

        });
        keyboard.removeAllListeners('k:right_').on('k:right_', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.r = 6;
                $this.player.rightUp();
            }

        });
        keyboard.removeAllListeners('m:lc').on('m:lc', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.remove = 1;
                $this.player.lc();
            }
        });
        keyboard.removeAllListeners('m:lc_').on('m:lc_', function () {
            if ($this.player && $this.ingame) {
                $this.toSendInput.remove = 6;
                $this.player.lc_up();
            }
        });



        keyboard.removeAllListeners('debug').on('debug', (function () {
            $('.ol-debugview').toggle();
            $('#debug_view').focus();
        }).bind(this));

        keyboard.removeAllListeners('mouseMove').on('mouseMove', (function (data) {
            var inp = [];
            if (!$this.player || $this.player.deadSpec || !$this.ingame) {
                return;
            }
            var currTime = Date.now();
            $this.timespan += currTime - $this.lastTime;
            $this.lastTime = currTime;
        }).bind(this));
    }

    this.getPrimus = function () {
        return primus;
    }

    this.clientStoreClosed = function (event, data) {
        console.log('xstation close');
    };
    this.clientStoreOpenWindow = function (event, data) {
        console.log('xstation window open');
    };
    this.clientStoreCloseWindow = function (event, data) {
        console.log('xstation window closed');
    };
    this.clientStoreLoaded = function (event, data) {
        console.log('xstation loaded');
    };

    this.clientStoreOpen = function (event, data) {
        console.log('xstation open');
    };

    this.clientStoreStatus = function (event, data) {
        console.log('xstation status');
    };

    this.clientStoreS_delivering = function (event, data) {
        console.log('xstation deliver');
    };

    this.clientStoreS_done = function (event, data) {
        console.log('xstation done');
    };

    this.clientStoreS_invoice = function (event, data) {
        console.log('xstation invoice');
    };

    this.clientStoreS_trouble = function (event, data) {
        console.log('xstation trouble');
    };
    this.splash = function (type, x, y) {
        this.getRenderer().splash(type, x, y);
    }
    this.showWindowTween = (function () {
        var hid_window = null;
        var sho_window = null;
        return function (_top, show, r, y, cb) {
            if (!TWEEN) {
                return;
            }
            if (show === false) {
                var win = $('.gen_window');
                if (hid_window && hid_window.isPlaying) {
                    return;
                }
                if (sho_window && sho_window.isPlaying) {
                    return;
                }
                if (!win.css('visibility') === 'hidden') {
                    return;
                }
                $('.darkness').hide();
                var _htop = -window.innerHeight / 2 - win.height();
                hid_window = new TWEEN.Tween({
                        x: 0,
                        y: 1
                    })
                    .to({
                        x: _htop,
                        y: 0
                    }, 600)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(function () {
                        win.css({
                            top: this.x + 'px',
                            opacity: this.y
                        });
                    })
                    .onComplete(function () {
                        win.hide();
                        win.css({
                            top: _htop + 'px',
                            opacity: 1
                        })
                        hid_window = null;
                        cb && cb(2);
                    })
                    .start(this.appTime);

                return;
            }

            if (r.css('visibility') === 'hidden') {
                return;
            }
            if (hid_window && hid_window.isPlaying) {
                return;
            }
            if (sho_window && sho_window.isPlaying) {
                return;
            }
            $('.darkness').show();
            var toPos = window.innerHeight / 2 + y;
            r.show();
            sho_window = new TWEEN.Tween({
                    x: -toPos,
                    y: 0
                })
                .to({
                    x: _top,
                    y: 1
                }, 320)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                    r.css({
                        top: this.x + 'px',
                        opacity: this.y
                    });
                })
                .onComplete(function () {
                    sho_window = null;
                    cb && cb(1);
                })
                .start(this.appTime);
        }

    })();

    this.showWindow = (function () {
        var showingWindow = null;
        var showingObj = null;
        return function (FONT_SIZE, val, handle, panelName, head, size, closeable, cb) {
            var htm = null;
            if (handle) {
                var htm = handle();
            }

            panelName = panelName || '';
            if (val && panelName === '') {
                return;
            }

            if (val) {
                window.sw = panelName;
                showingWindow = panelName;
                showingObj = $('' + showingWindow);


            }
            var r = $('.gen_window');
            var _top = 0;
            var scale = 0;
            if (!closeable) {
                r.find(".tag-header-close").hide();
            } else {
                r.find(".tag-header-close").show();
            }

            if (val) {

                if (handle) {
                    if (htm !== null) {
                        r.find('div.user-panel').first().height(size[1] - 40).html('').html('' + htm);
                    }
                } else {
                    r.find('div.user-panel').first().height(size[1] - 40).append(showingObj);
                }
                $('' + panelName).show();
                r.width(size[0]).height(size[1]);
                r.find('span.option-heading').text('' + head);
                $('.option-heading').css('font-size', FONT_SIZE);
                scale = Math.min(1, window.innerHeight / 800);
                _top = window.innerHeight / 2 - scale * r.outerHeight(true) / 2;
                this.showWindowTween(_top, true, r, size[1], cb);
                return;
            }
            if (showingWindow) {

                var handlebar = $('' + showingWindow).data('type') || '';
                if (handlebar === 'h') {
                    r.find('div.user-panel').find('' + showingWindow).first().remove();
                } else {
                    var toRem = r.find('div.user-panel').find('' + showingWindow).first().detach();
                    $('body').append(toRem);
                    toRem.hide();
                }
                $('.option-heading').css('font-size', FONT_NORMAL);
                this.showWindowTween(0, false, null, null, cb);
            } else {
                if (cb) {
                    cb(2);
                }
            }
        }

    })();


    this.showChatMsg = function (key) {
        if (!this.ingame) {
            return;
        }
        var chats = null;
        var found = false;
        if (this.superChat) {
            if (this.superChat) {
                chats = this.superChat.chats;
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i][1] === +key) {
                        found = true;
                        break;
                    }
                }
            }
        }
        if (!found) {
            this.getRenderer().showError('Message not set for key:' + key, '0xff0000', TWEEN, 0.3, 0.3, 10, 20);
            return;
        }

        var bw = new BW(1);
        bw.writeUInt8(key);

        primus && primus.send('31', bw.toBuffer());

        // var index = Math.max(0, Math.min(this.tagsList.length - 1, +key - 1));
        // var msg = this.tagsList[index].name;
        // var state = ('' + this.tagsList[index].tagstate).toLowerCase();
        // if ((+key) > this.tagsList.length) {

        //     this.getErrorHand().showError("Tag off or not set for key " + key, Color.DARK);
        //     return;
        // }
        // if (state && state === 'on') {}
    };

    this.showLoginDialog = (function () {
        return function (hide) {
            if (hide) {
                $('.help-t .helper').show();
                $('.help-t .ol-signup-main-blocked').hide();
            } else {
                $('.help-t .helper').toggle();
                $('.help-t .ol-signup-main-blocked').toggle();
            }
        }
    })();
    this.mainSkinLoaded = function () {
        console.log('main skin loaded');
    };
    this.getImageForSkin = function (arr) {
        var u_arr = fMath.unique(arr);
        var url_high = '';
        var img = null;
        var size = Conf.SKIN_LOW;
        var url = 'http://' + 'kark.io/skins/' + name + '.png';
        for (var i = 0; i < u_arr.length; i++) {
            img = $('img.clrspan[data-name="' + u_arr[i] + '"]');
            url = 'http://' + 'kark.io/skins/' + u_arr[i] + '.png';
            img.attr("src", "" + url);
            img.width(size);
        }
        // var img = $(element).children('img');


    };
    this.showProfile = function (member) {
        var $this = this;
        $('.ol-profile-main').show();
        $('.ol-profile-closebtn').off('click');
        $('.ol-profile-closebtn').on('click', function (e) {
            e.stopPropagation();
        });
    };
    this.windowResize = function () {
        $('.delTaunt').css('left', "260px");
        var rend = this.getRenderer();
        if (rend) {
            rend.winResize();
        }
        if (this.gameVer) {
            this.gameVer.resize(window.innerWidth, window.innerHeight);
        }
        // if (this.scoreManager) {
        //     this.scoreManager.resize(window.innerWidth, window.innerHeight);
        // }

        if (this.lb) {
            this.lb.resize(window.innerWidth, window.innerHeight);
        }
        if(this.combobar){
            this.combobar.resize();
        }
        this.cw = window.innerWidth;
        this.ch = window.innerHeight;
        var packet = new BW(4);
        packet.writeUInt16(window.innerWidth);
        packet.writeUInt16(window.innerHeight);
        var width = window.innerWidth;
        var height = window.innerHeight;
        var scale = Math.min(1, height / 800);
        var scaleval = "scale(" + scale + ")";
        var prop = scaleval;
        var dFac = 4;
        var od = $('#statsPanel');
        var rd = $("#rd");
        var rdH = rd.outerHeight() / 2;
        var odH = od.outerHeight() / 2;
        var gen = $('.gen_window');
        var allSec = $('.all_sections');
        var genH = gen.outerHeight() / 2;
        var allSecH = allSec.outerHeight();
        var statTop = 0,
            genTop = 0,
            respawnTop = 0,
            allSecTop = 0;
        respawnTop = Math.max(100, window.innerHeight / 2 - rdH / 2);
        statTop = 120 * scale;
        genTop = window.innerHeight / 2 - genH;

        allSecTop = Math.max(0, window.innerHeight / 2 - allSecH / 2 - allSecH / 10);
        if (scale < 1) {
            statTop = Math.max(100 * scale, window.innerHeight / 2 - odH - ((odH * 2) / dFac) * scale);
            genTop = (100) * scale;
            allSecTop = (1);
        }
        od.css({
            "transform": prop,
            'top': (120 * scale) + 'px'
        });
        $('#result-logo').css({
            "transform": prop
        });
        $('#result-esc').css({
            "transform": prop
        });
        rd.css({
            "transform": prop,
            "top": statTop + 'px'
        });
        gen.css({
            "transform": prop,
            "top": genTop + 'px'
        });
        allSec.css({
            "transform": prop,
            "top": allSecTop + 'px'
        });

        primus && primus.send('wr', packet.toBuffer());
    };

    this.tweenContainerShake = function (cont, page, factor, dir) {
        var from = +((-page) * (IMG_SIZE * factor));
        var to = from + 30 * dir;
        var self = this;
        var contToTween = $(cont);
        this.skinSelTween = new TWEEN.Tween({
                x: from
            })
            .to({
                x: to
            }, 130)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function () {
                contToTween.css({
                    "left": (this.x + 'px')
                });
            })
            .yoyo(true)
            .repeat(1)
            .onComplete(function () {
                self.skinSelTween = null;
            })
            .start(this.appTime);

    };
    this.shakeCam = function (t, int) {
        rendererObj.shakeCam(t, int);
    }
    this.tweenContainer = function (cont, pageTo, pagefrom, factor) {
        var from = +(-pagefrom) * (IMG_SIZE * factor);
        var to = +(-pageTo * (IMG_SIZE * factor));
        var self = this;
        var contToTween = $(cont);
        this.skinSelTween = new TWEEN.Tween({
                x: from
            })
            .to({
                x: to
            }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function () {
                contToTween.css({
                    "left": (this.x + 'px')
                });
            })
            .onComplete(function () {
                self.skinSelTween = null;
            })
            .start(this.appTime);

    };
    this.getSkins = function (catName, start, end, other) {
        if (!catName) {
            return;
        }
        var catData = [];
        var data = Conf.SKINS_DATA;
        if (other) {
            var keys = Object.keys(data);
            var skins = [];
            var skinsRet = [];
            for (var i = 0; i < keys.length; i++) {
                skins = data[keys[i]];
                for (var j = start; j < Math.min(skins.length, end); j++) {
                    skinsRet.push(skins[j]);
                }
            }
            return skinsRet;
        } else {
            catData = data['' + catName];
            if (end >= (catData.length)) {
                end = catData.length;
            }
            if (start < 0) {
                start = 0;
            }
            if (catData.length <= 0) {
                return [];
            }
            return catData.slice(start, end);
        }

    };
    this.addJQEvents_events = function () {
        var $this = this;

        $('.user-more').off('click').on('click', function () {
            $this.showWindow(FONT_NORMAL, true, null, '.adv-panel', "More Options", [400, 220], true, function () {});

        });

        $('.user-music').off('click').on('click', function () {
            var state = window.store.get(CH_DATA.MUSIC.sid);


            if (+state === 1) {
                $('.gmusic').fadeIn(200);
                window.store.set(CH_DATA.MUSIC.sid, Conf.STATE.OFF);
                window['' + CH_DATA.MUSIC.wid] = Conf.STATE.OFF;
                $this.musicOn = false;
            //   $this.soundManager.muteMusic();
            } else if (+state === 2) {
                $('.gmusic').fadeOut(200);
                window.store.set(CH_DATA.MUSIC.sid, Conf.STATE.ON);
                window['' + CH_DATA.MUSIC.wid] = Conf.STATE.ON;
           //     $this.soundManager.unMuteMusic();
                $this.musicOn = true;
            }
        });

        $('.user-skins').off('click').on('click', function () {
            if (!Conf.SKINS_DATA) {
                return;
            }
            var change = IMG_SIZE * 3;
            var self = this;
            $this.showWindow(FONT_SIZE_MED, true, getSkinData, '.skins-panel', "Select a balloon", [650, 520], true, function () {
                var lastSel_skincat = null;
                var maxVisible = 3;
                var catNameWithDataName = '';
                var firstElement = 'base';
                var sel_cat_name = '';
                var navBtnType = 0;
                var leftVal = 0;
                var curr_leftVal = 0;
                var totalPages = 0;
                var currPageSkins = [];
                var page1Skins = [];
                var page2Skins = [];
                var allTabsSkins = [];
                var catSkins = [];
                var containerMargin = null;
                var skinsInCont = 0;
                var lTurn = false;
                var rTurn = false;
                var currPageNo = 0;
                var scale = 0;
                var curr_sel_skin = window.store.get('facename');
                var preSelSkinBtn = null;
                var preSelSkinBox = null;
                if (curr_sel_skin) {
                    preSelSkinBtn = $('.skin-sel-btn[data-name="' + curr_sel_skin + '"]');
                    preSelSkinBox = $('.inner-clr-span[data-name="' + curr_sel_skin + '"]');
                    if (preSelSkinBtn) {
                        preSelSkinBtn.removeClass('skin-btn-off').addClass('skin-btn-on');
                        preSelSkinBtn.children('span').text('Active');
                    }
                    if (preSelSkinBox) {
                        preSelSkinBox.removeClass('inner-clr-span_off').addClass('inner-clr-span_on');
                    }
                }
                var currData = null; // data for the tab
                // highlight and show data first cat when window is shown 
                catNameWithDataName = $('.skin-cat[data-name="' + firstElement + '"]');
                currData = $('.skin-cat-data[data-name="' + firstElement + '"]');
                $('.skin-cat-data').hide();
                if (catNameWithDataName) {
                    sel_cat_name = firstElement;
                    lastSel_skincat = catNameWithDataName;
                    $(catNameWithDataName).removeClass('skin-cat-nsel').addClass('skin-cat-sel');
                    $('.skincat-selected').hide();
                    $(catNameWithDataName).children('.skincat-selected').show();
                    if (currData) {
                        $(currData).show();
                    }
                }

                allTabsSkins = $this.getSkins(sel_cat_name, currPageNo * maxVisible, currPageNo * maxVisible + maxVisible, true);

                $this.getImageForSkin(allTabsSkins);
                $('.skin-sel-btn').off('click').on('click', function () {
                    var name = $(this).data('name');
                    var _facename = window.store.get('facename');
                    //same name
                    if (_facename === ('' + name)) {
                        $(this).removeClass('skin-btn-on').addClass('skin-btn-off');
                        $(this).children('span').text('Select');
                        window.store.set('facename', 'empty');
                        $(this).closest('.inner-clr-span').removeClass('inner-clr-span_on').addClass('inner-clr-span_off');
                        curr_sel_skin = null;
                        //deselect
                    }
                    // no name
                    else if (_facename === '' || _facename === 'empty') {
                        window.store.set('facename', name);
                        $(this).removeClass('skin-btn-off').addClass('skin-btn-on');
                        $(this).children('span').text('Active');
                        curr_sel_skin = name;
                        $(this).closest('.inner-clr-span').removeClass('inner-clr-span_off').addClass('inner-clr-span_on');
                    }
                    // different name
                    else {
                        if (curr_sel_skin) {
                            preSelSkinBtn = $('.skin-sel-btn[data-name="' + curr_sel_skin + '"]');
                            preSelSkinBox = $('.inner-clr-span[data-name="' + curr_sel_skin + '"]');
                            if (preSelSkinBtn) {
                                preSelSkinBtn.removeClass('skin-btn-on').addClass('skin-btn-off');
                                preSelSkinBtn.children('span').text('Select');
                            }
                            if (preSelSkinBox) {
                                preSelSkinBox.removeClass('inner-clr-span_on').addClass('inner-clr-span_off');
                            }
                        }
                        curr_sel_skin = name;
                        $(this).removeClass('skin-btn-off').addClass('skin-btn-on');
                        $(this).children('span').text('Active');
                        $(this).closest('.inner-clr-span').removeClass('inner-clr-span_off').addClass('inner-clr-span_on');
                        window.store.set('facename', name);
                    }

                    // var sibl = $(this).get
                    // $this.getImageForSkin('low', firstChild, name);
                });

                // highlight  and show data  first cat when window is shown
                $('.skin-cat').off('click').on('click', function () {
                    if (lastSel_skincat) {
                        $(lastSel_skincat).removeClass('skin-cat-sel').addClass('skin-cat-nsel');
                    }

                    sel_cat_name = $(this).data('name');
                    $(this).removeClass('skin-cat-nsel').addClass('skin-cat-sel');
                    lastSel_skincat = this;
                    $('.skincat-selected').hide();
                    $(this).children('.skincat-selected').show();
                    currData = $('.skin-cat-data[data-name="' + sel_cat_name + '"]');
                    $('.skin-cat-data').hide();
                    if (currData) {
                        $(currData).show();
                        containerMargin = $('.skin-clrs[data-name="' + sel_cat_name + '"]');
                        skinsInCont = containerMargin.children().length;
                        totalPages = Math.ceil(skinsInCont / maxVisible);
                        scale = Math.min(1, window.innerHeight / 800);
                        curr_leftVal = Math.floor($(containerMargin).position().left * (1 / scale)) + 10;
                        currPageNo = Math.abs(Math.floor(curr_leftVal / (IMG_SIZE * maxVisible)));
                        var btnl = $('.skinbtn[data-type="l"]');
                        var btnr = $('.skinbtn[data-type="r"]');
                        if (currPageNo >= 1 && totalPages > 1) {
                            $this.tweenContainer(containerMargin, 0, currPageNo, 3);
                            currPageNo = 0;
                        }

                        if (totalPages <= 1) {
                            btnr.addClass('skinbtnstyled').removeClass('skinbtnstyle');
                            btnl.addClass('skinbtnstyled').removeClass('skinbtnstyle');
                        } else if (currPageNo >= (totalPages - 1)) {
                            btnr.addClass('skinbtnstyled').removeClass('skinbtnstyle');
                            btnl.addClass('skinbtnstyle').removeClass('skinbtnstyled');
                        } else if (currPageNo <= 0) {
                            btnl.addClass('skinbtnstyled').removeClass('skinbtnstyle');
                            btnr.addClass('skinbtnstyle').removeClass('skinbtnstyled');
                        } else {
                            btnr.addClass('skinbtnstyle').removeClass('skinbtnstyled');
                            btnl.addClass('skinbtnstyle').removeClass('skinbtnstyled');
                        }

                    }

                    currPageSkins = $this.getSkins(sel_cat_name, currPageNo * maxVisible, currPageNo * maxVisible + maxVisible, false);
                    page1Skins = $this.getSkins(sel_cat_name, (currPageNo + 1) * maxVisible, (currPageNo + 1) * maxVisible + maxVisible, false);
                    page2Skins = [];
                    $this.getImageForSkin(currPageSkins.concat(page1Skins, page2Skins));

                });

                $(".skinbtn").off('click').on('click', function () {
                    if ($this.skinSelTween || !$(this).hasClass('skinbtnstyle')) {
                        return;
                    }
                    lTurn = true;
                    rTurn = true;
                    scale = Math.min(1, window.innerHeight / 800);
                    navBtnType = $(this).data('type');
                    containerMargin = $('.skin-clrs[data-name="' + sel_cat_name + '"]');
                    skinsInCont = containerMargin.children().length;
                    totalPages = Math.ceil(skinsInCont / maxVisible);
                    curr_leftVal = Math.floor($(containerMargin).position().left * (1 / scale)) + 10;
                    currPageNo = Math.abs(Math.floor(curr_leftVal / (IMG_SIZE * maxVisible)));
                    if (currPageNo <= 0) {
                        lTurn = false;
                    }
                    if (currPageNo >= (totalPages - 1)) {
                        rTurn = false;
                    }

                    if (navBtnType === 'l' && lTurn) {
                        currPageSkins = [];
                        page1Skins = $this.getSkins(sel_cat_name, (currPageNo - 1) * maxVisible, (currPageNo - 1) * maxVisible + maxVisible, false);
                        page2Skins = $this.getSkins(sel_cat_name, (currPageNo - 2) * maxVisible, (currPageNo - 2) * maxVisible + maxVisible, false);
                        currPageNo--;
                        $this.tweenContainer(containerMargin, currPageNo, currPageNo + 1, maxVisible);
                        var otherBtn = $('.skinbtn[data-type="r"]');
                        if (currPageNo <= 0) {
                            $(this).addClass('skinbtnstyled').removeClass('skinbtnstyle');
                        }
                        if (!otherBtn.hasClass('skinbtnstyle')) {
                            otherBtn.removeClass('skinbtnstyled').addClass('skinbtnstyle');
                        }
                    } else if (navBtnType === 'r' && rTurn) {
                        currPageSkins = [];
                        page1Skins = $this.getSkins(sel_cat_name, (currPageNo + 1) * maxVisible, (currPageNo + 1) * maxVisible + maxVisible, false);
                        page2Skins = $this.getSkins(sel_cat_name, (currPageNo + 2) * maxVisible, (currPageNo + 2) * maxVisible + maxVisible, false);
                        currPageNo++;
                        $this.tweenContainer(containerMargin, currPageNo, currPageNo - 1, maxVisible);
                        var otherBtn = $('.skinbtn[data-type="l"]');
                        if (currPageNo >= (totalPages - 1)) {
                            $(this).addClass('skinbtnstyled').removeClass('skinbtnstyle');
                        }
                        if (!otherBtn.hasClass('skinbtnstyle')) {
                            otherBtn.removeClass('skinbtnstyled').addClass('skinbtnstyle');
                        }
                    }
                    $this.getImageForSkin(currPageSkins.concat(page1Skins, page2Skins));
                });
            });


        });

        // main tags button in the ui
        $('.user-tags').off('click').on('click', function () {
            $this.showWindow(FONT_NORMAL, true, null, '.tags-panel', "Quick Chat", [400, 380], true, function (val) {
                if (val === 1) {
                    clearText('#newtaunt', 'id');
                    $('.delTaunt').hide();
                    $('#newtaunt').focus();
                    updateContScroll('.taunts-scroll');
                }
            });

        });
        // close btn
        $('.tag-header-close').off('click').on('click', function () {
            $this.showWindow(FONT_NORMAL, false);
        });

        // game tips text div
        $('.helper').off('click').on('click', function () {
            $this.showWindow(FONT_NORMAL, true, $this.gameTips.getHelpData.bind($this.gameTips), '.help-panel', "Help", [400, 450], true);
        });

        $('#cl_all_tags').off('click').on('click', function () {
            var t = $this.getTags();
            t.removeAllTags();
            $this.addTagTemplates();
        });

        $('#taunt-box-add').off('click').on('click', function () {
            $this.addNewTag();
        });

        $("#newtaunt").off('change paste keyup"').on("change paste keyup", function () {
            if ($(this).val().length <= 0) {
                $('.delTaunt').fadeOut('fast');
            } else {
                $('.delTaunt').fadeIn('fast');
            }
        });
        $('#newtaunt').off('keypress').on('keypress', function (e) {
            var codes = Conf.SplKeyCodes;
            if (codes.indexOf(e.which) >= 0) {
                e.preventDefault();
            }
        });
        var nn = '#' + CH_DATA.NO_NAME.jqid;
        var nc = '#' + CH_DATA.NO_COLOR.jqid;
        var nsk = '#' + CH_DATA.NO_SKIN.jqid;
        var nso = '#' + CH_DATA.NO_SOUND.jqid;

        $('' + nso).off('change').change(function () {
            if (this.checked) {
                window.store.set(CH_DATA.NO_SOUND.sid, Conf.STATE.ON);
                window['' + CH_DATA.NO_SOUND.wid] = Conf.STATE.ON;
            } else {
                window.store.set(CH_DATA.NO_SOUND.sid, Conf.STATE.OFF);
                window['' + CH_DATA.NO_SOUND.wid] = Conf.STATE.OFF;
            }
        });
        $('' + nc).off('change').change(function () {
            if (this.checked) {
                window.store.set(CH_DATA.NO_COLOR.sid, Conf.STATE.ON);
                window['' + CH_DATA.NO_COLOR.wid] = Conf.STATE.ON;
            } else {
                window.store.set(CH_DATA.NO_COLOR.sid, Conf.STATE.OFF);
                window['' + CH_DATA.NO_COLOR.wid] = Conf.STATE.OFF;
            }
        });
        $('' + nsk).off('change').change(function () {
            if (this.checked) {
                window.store.set(CH_DATA.NO_SKIN.sid, Conf.STATE.ON);
                window['' + CH_DATA.NO_SKIN.wid] = Conf.STATE.ON;
            } else {
                window.store.set(CH_DATA.NO_SKIN.sid, Conf.STATE.OFF);
                window['' + CH_DATA.NO_SKIN.wid] = Conf.STATE.OFF;
            }
        });
        $('' + nn).off('change').change(function () {
            if (this.checked) {
                window.store.set(CH_DATA.NO_NAME.sid, Conf.STATE.ON);
                window['' + CH_DATA.NO_NAME.wid] = Conf.STATE.ON;
            } else {
                window.store.set(CH_DATA.NO_NAME.sid, Conf.STATE.OFF);
                window['' + CH_DATA.NO_NAME.wid] = Conf.STATE.OFF;
            }
        });


        $(window).off('resize').resize(function () {
            $this.windowResize();
        });
        $(document).off('contextmenu').on("contextmenu", "#canvas", function (e) {
            var bool = DISABLE_CONTEXT_MENU;
            return !bool;
        });
        JQ_click('soul-login-play', '#', function () {
            var text = $(this).children('span').text();
            text = ('' + text).toLowerCase();
            if (text === 'reconnect') {
                location.reload(true);
            }
            $this.playBtnClicked(false,$this, false, $(this).text(), $(this), false, false);
        });
        JQ_click('soul-s-play', '#', function () {
            $this.playBtnClicked(false,$this, true, $(this).text(), $(this), false, false);
        });


        $('.setting-tip').off('click');
    };
    this.addJQEvents = function (thisVal) {
        var $this = thisVal;
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;
        $(document).ready(function () {
            houseKeeping_jq();
            $this.changePlayBtnState(1);
            $this.playBtnReady = true;
            // main more button in the ui
            $this.addJQEvents_events();

        });
    };

    this.verf_capt = function (e, cb) {
        if (e) {
            if (cb) {
                cb();
            }
        }
    };
    this.showCapt = function () {
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset()
        }
        $('.gcaptcha').show();
    };
    this.cleanMem = function () {


        document.onkeydown = null;

    };



    this.freeMovement = function (pos) {
        var w = window.innerWidth / 2;
        var h = window.innerHeight / 2;
        var x = pos.x - w;
        var y = pos.y - h;
        x = map_range(x, -w, w, -100, 100);
        y = map_range(y, -h, h, -100, 100);
        x = x + window.ppx;
        y = y + window.ppy;
        this.freeMouse.x = x;
        this.freeMouse.y = y;
    };
    this.showIntEnd = function (stop) {

        $('#email').focus();

    };
    this.clearLoadingAni = function () {
        if (this.logoAni) {
            this.logoAni.stop();
            this.logoAni = null;
        }
    };
    this.hideInt = function () {
        $('.gsett').hide();

        var self = this;
        var rendererObj = self.getRenderer();
        var lays = $("#overlays");
        var sections = lays.children('.all_sections');
        $('.ui_elements').hide();
        rendererObj.showGame();
        lays.css("z-index", 0);
        lays.hide();
    };
    this.getTW = function () {
        return TWEEN;
    }
    this.showInt = function (primary) {
        var self = this;
        this.addEnterKeyEvent_menu();
        if (this.lb) {
            this.lb.showHide(false);
        }
        if (primary) {
            self.lb && self.lb.showHide(false);
            //    self.gameOView && self.gameOView.showHideLat(false);
            $('#soul-connection').hide();
            $('.all_sections').fadeIn(300);
            $('.ui_elements').fadeIn(300);
            $('.social-bar').fadeIn(200);
            $('.disc-small').hide();
            self.showIntEnd();
            return;
        }
        var lays = $("#overlays");
        lays.css("z-index", 2);
        $('.gsett').fadeIn(200);
        lays.fadeIn(200);
        $('.ui_elements').fadeIn(200);
        lays.css({
            opacity: 1
        });
        self.showIntEnd();
        self.enableOnGameEnd();
        this.startApp();
    };



    this.updateRewardTimeUI = (function ($this) {
        var toUpdate = $('#daily_reward span');
        var popupUpdate = $('.daily-coins-msg .coinsmsg');
        return (function () {

            var sec = $this.plRewardTs.seconds().zeroPad();
            var min = $this.plRewardTs.minutes().zeroPad();
            var hours = $this.plRewardTs.hours().zeroPad();
            if (min < 1) {
                toUpdate.text('Collect coins in ' + sec + " Sec");
                this.updateCoinsPopup && popupUpdate.text(sec + " Sec");
            } else if (hours < 1) {
                toUpdate.text('Collect coins in ' + min + ' M' + " " + sec + " S");
                this.updateCoinsPopup && popupUpdate.text(min + ' M' + " " + sec + " S");
            } else {
                toUpdate.text('Collect coins in ' + hours + ' H' + min + " M" + sec + " S");
                this.updateCoinsPopup && popupUpdate.text(min + ' M' + " " + sec + " S");
            }


            if ($this.plRewardTs.totalSeconds() < 1) {

                if (this.updateCoinsPopup) {
                    popupUpdate.hide();
                    $('.coinswaiting_msg').hide();
                    $('#daily_reward_pop_btn').show();
                }
                $('#daily_reward').removeClass('reward-pending').addClass('reward-available');
                toUpdate.text("Collect Coins");
                clearInterval(this.rewardIntervalHandle);
            }
        }).bind($this);
    })(this);

    this.startRewardInterVal = function (delta) {
        if (this.rewardIntervalHandle) {
            clearInterval(this.rewardIntervalHandle);
        }
        if (delta && this.plRewardTs && delta > 0) {
            var del = Math.floor((Date.now() - delta) / 1000);
            if (del < 18000) {
                this.plRewardTs.subtractSeconds(del);
                this.cleaningDoneAt = 0;
            }
        }
        var uiSecInterval = (function () {
            this.plRewardTs.subtractSeconds(1);
            this.updateRewardTimeUI();

        }).bind(this);

        // if (this.plRewardTs && this.available_bonuscoins) {
        //     $('#daily_reward').children('.loaderext').html('');
        //     $('#daily_reward').addClass('reward-pending').removeClass('reward-available').children('span').text('Bonus Coins');
        // }
    };
    this.dailyRewardSucc_pop = (function (time, value) {

        this.dailyRewardSucc(time, value);
        $('#daily_reward_pop_btn').hide();
        $('.daily-coins-msg span.coinswaiting_msg').show().text('Congratulations, you got');
        $('#coins_popup span.coinsmsg').hide();
    }).bind(this);

    this.dailyRewardSucc = (function (time, value) {
        var newtime = Number(time) / 1000;
        var showVal = '' + Number(value) + ' Coins';
        this.plRewardTs = new TimeSpan(0, newtime);
        $('#coins_popup div.coinshurray').show().children('span.reward_coinsvalue').text(showVal);
        this.startRewardInterVal();
    }).bind(this);


    this.failedSocial = function () {
        $('#daily_reward').children('.loaderext').html('');
        $('#daily_reward').removeClass('reward-available').addClass('reward-pending').children('span').text('Bonus Coins');

    };

    this.GS_fbConnect = function (token, name, uid, url, type) {};

    this.clearTauntsLocal = function () {
        taunts.clearTauntsLocal();

    };
    this.getTags = function () {
        return taunts;
    }
    // SHOP RELATED FUNCTIONS-------------------------------------------------------------------------------------------------------------------------------
    this.selectedItem = function (cat, name) {
        if (cat === 'styles') {
            window.ACTIVE_DEC = name;
        } else if (cat === 'skins') {
            window.ACTIVE_SKI = name;
        } else if (cat === 'weapons') {
            window.ACTIVE_WEA = name;
        } else if (cat === 'boosters') {
            window.ACTIVE_BOO = name;
        }

        window.store.set("active" + cat, name);
    };
    this.checkLocalForItem = function (cat, name) {
        var item = window.store.get("active" + cat);
        if (item) {
            return true;
        }
        return false;
    };

    this.setStoreTokenAndInit = function (token) {
        this.xtoken = token;
        if (token === '' || token === undefined) {
            return;
        }
        window.initStoreWindow(this.xtoken.token);
    };

    this.shopBuyReq = function (itemName) {
        this.rqServ().sendBuyReq(this.pname, this.uid, itemName, this.shopBuyCB);
    }
    this.shopUpgradeReq = function (item) {
        this.rqServ().sendUpgradeReq(this.pname, this.uid, item, this.shopUpgradeCB);
    }

    // SHOP RELATED FUNCTIONS-------------------------------------------------------------------------------------------------------------------------------

    this.addTagTemplates = function () {
        var $this = this;
        var tauntEData = {
            tags: []
        };
        var confTauntClr = Conf.TAUNT_STATUS;
        var borderClr = Conf.TAUNT_BORDER;
        var tauntsTemplate = Soulcrashers.Templates.taunt;
        var chatTemp = Soulcrashers.Templates.chatType;
        var arrD = {
            opt: [{
                data: 'Message when you pop someone'
            }]
        };
        var arrP = {
            opt: [{
                data: 'Message when someone pop you'
            }]
        }
        var chatOptions = [];
        var allTags = [];
        //get from local data
        tdataServ = taunts.getLocalTaunts();
        for (var i = 0; i < tdataServ.length; i++) {

            var tdata = tdataServ[i];
            var tno = "tag" + (i + 1);
            var stus = tdata.status.toLowerCase();
            tauntEData.tags.push({
                name: tdata.name,
                tagno: tno,
                tagstate: stus,
                bcolor: confTauntClr['' + stus],
                color: confTauntClr['' + stus],
                border: borderClr['' + stus]
            });
            if (stus === 'on') {
                chatOptions.push(tdata.name);
            }
        }
        this.tagsList = tauntEData.tags;
        this.superChat.updateTags(this.tagsList);
        for (var i = 0; i < chatOptions.length; i++) {
            arrD.opt.push({
                data: chatOptions[i]
            })
            arrP.opt.push({
                data: chatOptions[i]
            })
        }
        $('#default-death').html(chatTemp(arrD));
        $('#default-pop').html(chatTemp(arrP));
        if (tauntEData.tags.length > 0) {
            $('.taunts-scroll').html('');
            $('.taunts-scroll').append(tauntsTemplate(tauntEData));
        } else {
            $('.taunts-scroll').html(' <span class="t-unselectable empty-taunts abso">No Messages Found</span>');
        }



        $('.taunt-rem-btn').off('click').on('click', function () {
            $this.removeTag($(this).closest('.tau-div'));
        });

        $('.mm-taunt-btn').off('click').on('click', (function () {
            var tagState = {};
            var conf = Conf.TAUNT_TOGGLE;
            var confClr = Conf.TAUNT_TOGGLE_CLR;
            var border = Conf.TAUNT_BORDER_O;
            return function () {
                var no = $(this).data('taunt');
                var spa = $(this).children('.mm-btn').text().trim();
                tagState['' + no] = '' + conf['' + spa];
                $this.updateTag(('' + conf['' + spa]).trim(), $(this).closest('.tau-div').children('span.taunt-txt').attr('title').trim());
                $(this).css('background-color', Conf.TAUNT_STATUS['' + conf['' + spa]]).css('border', '2px solid' + confClr['' + spa]).css('border-bottom', '4px solid' + border['' + spa])
                    .children('.mm-btn').text(conf['' + spa]);
                var tt = $(this).parent('.tau-div').children('span.taunt-txt').text();
                if (tt && tt.length > 0) {
                    $('.user-taunts .taunts-header i.tstatus').css('color', 'yellow');
                }
            };
        })());
        $('.delTaunt').off('click').on('click', function () {
            $('#newtaunt').val('').focus();
            $(this).hide();
        });
        $('.delTaunt').css('left', "260px");

    };

    this.removeLastTag = function () {
        var tdiv = $('.taunts-scroll').children().last();
        var tt = tdiv.children('.taunt-txt').text() || '';
        var state = tdiv.find('span.mm-btn').text().trim();
        if (tt.length > 0) {
            tt = tt.trim();
        }
        $this.removeTaunt(tt, state, 'local');
        $this.addTagTemplates();
        $('#tauntlocaldialog').hide();
    };
    this.updateTag = function (newState, tag) {
        taunts.toggleTaunt(tag, newState);
        this.addTagTemplates();
    };

    this.removeTag = function (element) {
        if (!element) {
            this.getErrorHand().showError('Cannot remove the tag at this time.');
            return;
        }
        var tag = element.children('span.taunt-txt').attr('title').trim();
        var status = element.find('span.mm-btn').text().trim();
        var ret = taunts.removeTag(tag, status);
        if (ret) {
            taunts.updateCount(-1);
            this.addTagTemplates();
            updateContScroll('.taunts-scroll');

        } else {
            this.getErrorHand().showError("Tag cannot be deleted. Try again later.");
        }
    };
    this.addTag = function () {
        var $this = this;
        if (window.atag) {

            taunts.addTag(window.atag, function () {
                window.atag = null;

                clearText('#newtaunt');
                $this.addTagTemplates();
                mainFocus('#newTaunt');
                updateContScroll('.taunts-scroll');
            });
        }
    }
    this.addNewTag = function () {
        var val = $('#newtaunt').val().trim(),
            i = 0,
            baseTaunt = LZStr.decompressFromBase64(window.store.get("tags")) || '';
        var index = ('').getIndicesOf(val + '@', '' + baseTaunt, false),
            currIndex = 0,
            blen = 0,
            tcount = 0;
        if (index.length > 0) {
            for (i = 0; i < index.length; i++) {
                currIndex = index[i];
                blen = ('' + val).length;
                if (baseTaunt.charAt(currIndex + blen) === '@' && (baseTaunt.charAt(Math.max(0, currIndex - 1)) === '_')) {
                    this.getErrorHand().showError('' + Conf.Taunt_CB_RES.alreadyfound, Color.DARK);
                    return;
                }
            }
        } else {
            if (val.length <= 1 || val.length > 41) {
                this.getErrorHand().showError('' + Conf.Taunt_CB_RES.length, Color.DARK);
                return;
            }
        }
        window.atag = val;
        tcount = taunts.countTags(), bw = new BW(1);

        bw.writeUInt8(tcount + 1);
        primus.send('ts', bw.toBuffer());
    }

    this.invalidDebugCommand_01 = function (key, cont) {
        if (Conf.DEBUG_COMMANDS_01.indexOf(key) < 0) {
            cont.append('<div class= "dcomm cl-fatal">' + key + ': INVALID COMMAND </div>');
            return true;
        }
        return false;
    }
    this.invalidDebugCommand = function (key, cont) {
        cont.append('<div class= "dcomm cl-fatal">' + key + ': INVALUD COMMAND </div>');
        cont.append('<div class= "dcomm cl-fatal">' + 'TIP: Please use the flag with the command - (0 or 1) </div>');
    }
    this.runDebugCommand = function () {
        var cont = $('.debugcontainer');
        var text = $('#debug_view').val();
        $('#debug_view').val('');
        var vars = text.trim().toLowerCase().split(' ');
        var key = vars[0];
        var attr = vars[1];
        var success = false;
        var keyIndex = Conf.DEBUG_COMMANDS.indexOf(key);
        var text = '';
        if (keyIndex < 0) {
            cont.append('<div class= "dcomm cl-fatal">' + key + ': INVALID COMMAND </div>');
            return;
        }
        if ((attr == '' || attr == undefined || attr == null)) {
            if (Conf.DEBUG_COMMANDS_01.indexOf(key) >= 0) {
                this.invalidDebugCommand(key, cont);
                return;
            }
            var comm = '';
            text = 'COMMAND SUCCESSFUL';
            if (key === Conf.DEBUG.commands) {
                cont.append('<div class= "dcomm cl-warn" >' + '-------------------USER COMMANDS LIST-----------------' + '</div>');
                for (var i = 0; i < Conf.DEBUG_COMMANDS.length; i++) {
                    cont.append('<div class= "dcomm cl-warn" >' + Conf.DEBUG_COMMANDS[i] + '</div>');
                }
                cont.append('<div class= "dcomm cl-warn" >' + '-------------------USER COMMANDS LIST-----------------' + '</div>');
            } else if (key === Conf.DEBUG.clear) {
                text = '';
                cont.html('');
            }
        } else {
            if ((attr == '0' || attr == '1')) {
                if (this.invalidDebugCommand_01(key, cont)) {
                    return;
                }
                cont.append('<div class= "dcomm cl-success" > Running Command - ' + key + ' : ' + attr + '</div>');

                if (key === Conf.DEBUG.fps) {
                    this.gameOView && this.gameOView.FPS_STATE(+attr);
                } else if (key === Conf.DEBUG.version) {
                    this.gameOView && this.gameVer.VER_STATE(+attr);
                } else if (key === Conf.DEBUG.overlay) {
                    this.gameOView && this.gameOView.FPS_STATE(+attr);
                    this.gameOView && this.gameOView.VER_STATE(+attr);
                }

                text = 'COMMAND SUCCESSFUL';
            } else {
                cont.append('<div class= "dcomm cl-fatal">' + key + ': INVALID COMMAND </div>');
                text = 'failed to run command :' + key;
            }
        }

        if (text === '') {
            return;
        }
        if (text.indexOf('failed') >= 0) {
            cont.append('<div class= "dcomm cl-fatal" >' + text + '</div>');
        } else {
            cont.append('<div class= "dcomm cl-success" >' + text + '</div>');
        }


    };

    this.goBackToMenuCheck = function (rd) {
        if (!rd || !rd.is(':visible') || this.disableEnterKey) {
            return;
        }
        $('#od').hide();
        var typeD = new BW(1);
        if (primus) {
            typeD.writeUInt8(2);
            primus.send('96', typeD.toBuffer());
        }

    };

    this.reSpawnKeyCheck = function (type, rd) {
        if (!rd || !rd.is(':visible') || this.disableEnterKey) {
            return;
        }
      
        var typeD = new BW(1);

        if (type === 'enter') {

            if (primus) {
                typeD.writeUInt8(1);
                primus.send('56', typeD.toBuffer());
            }
        } else if (type === 'esc') {
            if (primus) {
                typeD.writeUInt8(2);
                primus.send('56', typeD.toBuffer());
            }
        }
    };
    this.EscKeyPressed = function (od, rd) {
        this.reSpawnKeyCheck('esc', rd);
        this.goBackToMenuCheck(od);
    }
    this.enterKeyEvent_menu = function (od, rd) {
        var ol = $('#overlays');
        var loginPlay = $('#soul-login-play');
        var gen_window = $('.gen_window');
        this.reSpawnKeyCheck('enter', rd);
        var olVis = ol.is(":visible");
        if (!this.ingame) {
            if (gen_window.is(":visible") && olVis) {
                if (gen_window.find('.panel').first().hasClass('tags-panel')) {
                    this.addNewTag();
                }
                return;
            }
            var text = loginPlay.children('span').text();
            text = ('' + text).toLowerCase();
            if (text == 'reconnect') {
                location.reload(true);
            } else {
                this.playBtnClicked(false,this, false, loginPlay.text(), loginPlay, false, false);

            }

        }
    };
    this.addEnterKeyEvent_menu = function () {
        var $this = this;
        var od = $('#od');
        var rd = $('#rd');
        $(document).off('keyup').on('keyup', function (evt) {

            evt.keyCode == 27 && $this.EscKeyPressed(od, rd);
            evt.keyCode == 13 && $this.enterKeyEvent_menu(od, rd);

        });
    };

    /// DAILY REWARD AND RELATED FUNCTIONS---------------------------------------------------------------------------------------------------------------------------
    this.showDialog_rewardHour = function () {
        // $('.coinswaiting_msg').show();
        // $('#coins_popup').show();
        // if (this.plRewardTs.totalSeconds() > 0) {
        //     this.updateCoinsPopup = true;
        //     $('#coins_popup span.coinsmsg').show();
        //     $('#coins_popup div.coinshurray').hide();
        //     $('.daily-coins-msg span.coinswaiting_msg').text('Collect coins in:');
        // } else {
        //     $('.daily-coins-msg span.coinswaiting_msg').text('Congratulations, you got');
        //     $('#coins_popup span.coinsmsg').hide();
        //     this.updateCoinsPopup = false;
        // }

    };

    this.getCurrMode = function () {
        return this.gameMode;
    };
    this.getCurrQua = function () {
        return this.gameGraphics;
    };
    this.neverLoggedSocial = function () {
        $('#daily_reward').children('.loaderext').html('');
        $('#daily_reward').children('span').text('Bonus Coins');
    };
    this.gameReady = function () {
        var $this = this;
        var res = {
            x: canvas.width,
            y: canvas.height
        };
        var foodLayer = $this.getRenderer().getPlayerTopLayer();
        var foodStage = $this.getRenderer().getBackgroundStage();
        var deadStage = $this.getRenderer().getDeadStage();
        social && social.init(this.neverLoggedSocial);
        this.gameFood = new GameFood(Conf.MAX_FOOD_PER_CONTAINER, foodStage, foodLayer, Conf.FOOD_CONT_COUNT, this);

        this.addJQEvents($this);
        var sstage = $this.getRenderer().getShopStage();
        if (this.adManager === null) {
            var adsData = Conf.AD_DATA;
            this.adManager = new GameAds(this, TWEEN, 5000);
            this.adManager.init(adsData);
        }
        if ($this.gameVer === null) {
            this.gameVer = new GameVer();
            var smLayer = $this.getRenderer().getSuperMiddleLayer();
            var overlay = $this.getRenderer().getOverlayStage();
            this.gameVer.init('V - ' + Conf.GAME_VER, Conf.GAME_STAGE, window.innerWidth, window.innerHeight, overlay, smLayer);
        }
        // if ($this.scoreManager === null) {
        //     this.scoreManager = new Score();
        //     var smLayer = $this.getRenderer().getSuperMiddleLayer();
        //     var overlay = $this.getRenderer().getOverlayStage();
        //     this.scoreManager.init(Conf.GAME_STAGE, window.innerWidth, window.innerHeight, overlay, smLayer);
        // }
        if ($this.lb === null) {
            $this.createLB();
            this.superChat = new SuperChat(rendererObj);
            $this.addTagTemplates();
        }
        $this.getRenderer().setLb($this.lb);

    };

    this.gLogin = function (data) {
        social.gLogin(data);
    };
    this.directServFn = function (loc) {
        // var locc = ('' + loc).replace(/-/g, "_").toUpperCase().trim();
        // locc = Conf.LOC_SHORT['' + locc];
        // locc = ('' + locc).toLowerCase();
        // this.reqServer.getDirectData(locc, function (reg, ip) {
        //     Conf.MAIN_CONN = '' + ip;
        //     Conf.MAIN_REG = '' + reg;
        //     gameClient.startApp(reg, ip);
        // });
    }
    this.serverFn = function (priority, cb) {
        this.reqServer = this.reqServer || '';
        if (this.reqServer !== '') {
            this.reqServer.getMData(priority, function (server, type,regCode) {
                cb(server, type,regCode);
            });
        } else {
            return;
        }
    };

    this.setSocial = function () {
        social = new Social(this);
    }
    this.showBlockedPage = function (country) {
        $('#soul-connection').hide();
        $('#notavailable').show();
        var text = '';
            if (country) { 
                text = 'Currently Karkio\u2122 is not available in ' + country + ' at the moment.';
            } else {
                text = 'Karkio\u2122 is not available at the moment.';
            }
        
        $('div.na span').text(text);
    };

    this.showMaintenancePage = function () {
        $('#soul-connection').hide();
        $('#notavailable').show();
        var text = 'Karkio\u2122 is under maintenance.Please try again later.';
        $('div.na span').text(text);
    };
    this.showErrorPage = function () {
        $('#soul-connection').hide();
        $('#notavailable').show();
        var text = 'Error connecting to the game. Try again later.';
        $('div.na span').text(text);
    };
    this.startApp = function (restart, cb) {

        this.disableEnterKey = false;
        var servUrl = Conf.MAIN_CONN;
        var servReg = Conf.MAIN_REG;
        var toConn = 'http://' + servUrl;
        var $this = this;
        var toSend = new BW(1);
        if (window.appStarted) {
            toSend.writeUInt8(23);
        } else {
            toSend.writeUInt8(21);
        }

        $this.reqServer.init(servUrl);
        if (!restart) {
            cns('connecting to server', Color.WHITE, Color.RED);
        }
        Primus.prototype.pathname = '/kark.live2222' ;
        console.log('conn:' + toConn);
        primus = Primus.connect(toConn, {
            reconnect: {
                max: Infinity,
                min: 1000,
                retries: 10
            },
            timeout: 10000
        });
        primus.off('open').on('open', function () {
            $this.windowResize();

            primus.off('44').on('44', function () {
                window.maint = true;
            });
            primus.off('11').on('11', function (data) {
                var _d = new BR(data);
                var _now = $this.getCurrTimeC();
                Conf.VER_PACK = _d.readUInt16();
                var aa = new BW(1);
                aa.writeUInt8(11);
                primus.send('12', aa.toBuffer());
                primus.on(Conf.VER_PACK, function (data) {
                    $this.addBasePrimusEvents(cb);
                    primus.send(Conf.VER_PACK, toSend.toBuffer());
                });
            });
        });

        window.appStarted = true;
    }

// 1 success
    // 2 blocked
    // 3 maintenance
    // 4 default
    // 5 time-error
    // 6 local
    this.basicSetup = function (server,type,regCode,country) {
        var $this = this;
        if(!type){
            return;
        }
        if (type == 5) {
            this.timeSettingsIssue();
            return;
        }
        if (type == 2) {
            this.showBlockedPage();
            return;
        }
        else if(type== 2 && country){
            this.showBlockedPage(country);
            return;
        }
        else if (type== 3) {
            this.showMaintenancePage();
        }
        if (('' + server).length <= 1) {
            this.showErrorPage();
            return;
        }    
        console.log(server + "," + regCode);
        Conf.MAIN_CONN = '' + server;
        Conf.MAIN_REG = '' + regCode;
        this.startApp();
    };




    this.getLocalData = function () {
        var quality_set = window.store.get('graphic');
        window.kgraphic = quality_set;
        this.playCount = window.store.get('playcount') || 0;
        this.adShown = window.store.get('adshown') || 0;
        window.ACTIVE_DEC = window.store.get('activestyles');
        window.ACTIVE_SKI = window.store.get('activeskins');
        window.ACTIVE_WEA = window.store.get('activeweapons');
        window.ACTIVE_BOO = window.store.get('activeboosters');
        var val = this.getLastTimeName();
        var val = this.getLastTimeName();
        $('#email').val('' + val);
        var myOpts = document.getElementById('graphic').options;
        var list = [];
        var curr = '';
        var gra = '';
        var opt = '';
        if (window.kgraphic) {
            gra = ('' + window.kgraphic).toLowerCase().trim();
            for (var i = 0; i < myOpts.length; i++) {
                curr = ('' + myOpts[i].value).toLowerCase().trim();
                if (curr === gra) {
                    opt = '' + i + ')';
                    $('#graphic option:eq(' + opt).prop('selected', true);
                    break;
                }
            }
        } else {
            $("#graphic").val(Conf.QUALITY.high);
        }
        var conceptName = $('#graphic').find(":selected").text();
        this.quality = ('' + conceptName).toLowerCase();
    }
    this.setMusicState = function (windowid, jqid, storeid) {
        window['' + windowid] = window.store.get(storeid) || '';
        if (window['' + windowid] === '') {
            $('.' + jqid).fadeOut(200);
            window['' + windowid] = Conf.STATE.ON;
            window.store.set(storeid, Conf.STATE.ON);
        } else {
            if (window['' + windowid] == Conf.STATE.ON) {
                $('.' + jqid).fadeOut(200);
            } else {
                $('.' + jqid).fadeIn(200);
            }
        }
    };
    this.setCheckBoxState = function (windowid, jqid, storeid) {
        window['' + windowid] = window.store.get(storeid) || '';
        if (window['' + windowid] === '') {
            $('#' + jqid).prop('checked', false);
            window['' + windowid] = Conf.STATE.DEFAULT;
            window.store.set(storeid, Conf.STATE.DEFAULT);
        } else {
            if (window['' + windowid] == Conf.STATE.ON) {
                $('#' + jqid).prop('checked', true);
            } else {
                $('#' + jqid).prop('checked', false);
            }
        }
    }

    this.kUpdate = function (dt) {
        var ms = this.ticker.elapsedMS;
        if (!pingRec) {
            return;
        }
        this.karkUpdate(dt, ms);
        this.karkRender(this.player, dt, ms);
    }

    this.disableOnGameStart = function () {
        this.tipUpdateOn = false;
    }
    this.enableOnGameEnd = function () {
        this.tipUpdateOn = true;
    };
    this.getCurrTimeC = function () {
        return (performance.now() - this.appStart);
    }
    this.getCurrTimeAvg = function () {
        var curr = performance.now() + this._coffset_avg;
        // if ((curr - this.lastCurrTime) > this.maxDel) {
        //     this.appStart += curr - this.lastCurrTime - this.maxDel;
        // }
        this.lastCurrTime = curr;
        return (curr - this.appStart);
    }
    this.getCurrTime = function () {
        var curr = performance.now() + this._coffset;
        // if ((curr - this.lastCurrTime) > this.maxDel) {
        //     this.appStart += curr - this.lastCurrTime - this.maxDel;
        // }
        this.lastCurrTime = curr;
        return (curr - this.appStart);
    }
    this.gameInput = (function (rend) {
        if (!this.player) {
            return;
        }
        var inp = this.toSendInput,
            toSend = null,
            bw = new BW(10),
            len = inp.length;

        var _now = this.getCurrTimeC();
        bw.writeUInt32(_now);
        if (inp.ctrl !== 0) {
            bw.writeUInt8(inp.ctrl);
        } else {
            bw.writeUInt8(2);
        }

        if (inp.ball !== 0) {
            bw.writeUInt8(inp.ball);
        } else {
            bw.writeUInt8(2);
        }

        // left
        if (inp.l !== 0) {
            bw.writeUInt8(inp.l);
        } else {
            bw.writeUInt8(2);
        }

        // right
        if (inp.r !== 0) {
            bw.writeUInt8(inp.r);
        } else {
            bw.writeUInt8(2);
        }


        // boost
        if (inp.remove !== 0) {
            bw.writeUInt8(inp.remove);
        } else {
            bw.writeUInt8(2);
        }

        toSend = bw.toBuffer();
        primus.send('i', toSend);
        inp.all = [];
        inp.ctrl = 0;
        inp.bot = 0;
        inp.remove = 0;
        inp.ball = 0;
        inp.l = 0;
        inp.r = 0;
    }).bind(this);

    this.getTimer = function () {
        return this.ttimer;
    }


    this.init = function (ws, nb, qq, ge_size, ge_scale, cb) {
        if (rendererObj) {
            return;
        }
        window.canShowAds ? console.log('ads on') : console.log('ads off');
        if (!window.canShowAds || true) {
            $('#adcont').css('background-image', 'url(../images/jpg/sx.jpg)')
            $('#restart-ad').css('background-image', 'url(../images/jpg/sx.jpg)')

            $('#adsBottInner').hide();

        }
     //   this.soundManager = new SoundM();
        var $this = this;
        var back = GAME_BACKGROUND;
        this.getLocalData();
        this.changePlayBtnState(0);
        this.showInt(true);
        this.ttimer = new TTimer();
        this.clientBlocks = new ClientBlocks(ws, Conf.SERVER_BLOCKS_COUNT, window.innerWidth, window.innerHeight);

        this.slowTimer = this.ttimer.addTimer(Conf.SLOW_LOOP_TIME, this.slowLoop, true, []);

        var appConfig = {
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true,
            backgroundColor: 0x000000,
            forceFXAA: true
        };
        this.application = new P.App(appConfig);
        rendererObj = new RendererObj($this, ws, nb, qq, ge_size, ge_scale, TWEEN);

        this.ticker = this.application.ticker;
        this.ticker.add(this.kUpdate.bind(this));
        this.maxDel = this.ticker.FPS * 0.1;
        this.maxDel = (this.ticker.FPS + 1e-3) * 0.1 * 1000;
        this.gameTips = new GameTips(TWEEN);
        var ret = rendererObj.setupRenderer(this.filesLoadedCB.bind(this, back, cb));
        if (!ret) {
            return;
        }
        keyboard = new Keys(this, Math.abs(window.outerHeight - window.innerHeight));
        this.errorhandler = new ErrorHandler(TWEEN, this);
        if (Conf.Debug) {
            //  this.gameOView = new OView(rendererObj);
            //  this.gameDebug = new G_DEBUG(rendererObj);
        }
        this.combobar = new ComboBar(this);
        this.combobar.init(rendererObj.getOverlayStage(), rendererObj.getUILayer());

        this.setCheckBoxState(CH_DATA.NO_SOUND.wid, CH_DATA.NO_SOUND.jqid, CH_DATA.NO_SOUND.sid);
        this.setCheckBoxState(CH_DATA.NO_NAME.wid, CH_DATA.NO_NAME.jqid, CH_DATA.NO_NAME.sid);
        this.setCheckBoxState(CH_DATA.NO_COLOR.wid, CH_DATA.NO_COLOR.jqid, CH_DATA.NO_COLOR.sid);
        this.setCheckBoxState(CH_DATA.NO_SKIN.wid, CH_DATA.NO_SKIN.jqid, CH_DATA.NO_SKIN.sid);
        this.setMusicState(CH_DATA.MUSIC.wid, CH_DATA.MUSIC.jqid, CH_DATA.MUSIC.sid);
    };
    this.regionSwitch = function (newRegion) {

    };
    this.setSelectedGraphic = function () {

    };

    this.addDropdownEvents = function () {
        var $this = this;

        $("#graphic").change(function () {
            var end = this.value;
            var firstDropVal = $('#graphic').val();
            $this.quality = ('' + firstDropVal).toLowerCase();
            window.store.set('graphic', $this.quality);
            window.kgraphic = $this.quality;
            $this.gameFood.updateTex();
        });
        $("#server").change(function () {
            var firstDropVal = $('#server').val();
            var qq = ('' + firstDropVal).toLowerCase();
            var find = ('' + qq).indexOf('(');
            var newLoc = '' + qq;
            if (find > 0) {
                newLoc = ('' + qq).substring(0, find).trim();
            }
            window.priority = newLoc;
            //    $this.directServFn(newLoc);

        });

    };
    this.playSoundDamageBar = function () {
        //  this.soundManager.playSoundCollide('collide');
    };
    this.playSoundBulletFire = function () {
        //  this.soundManager.playSoundCollide('collide');
    };
    this.playSoundFly = function () {
      //  if (this.player && !this.player.popped)
        //   this.soundManager.playSoundFly('fly');
    };

    this.playDeadSound = function () {
       // this.soundManager.playSoundCollide('collide');
    };

    this.playFallSound = function () {
      //  this.soundManager.playSoundCollide('fall');
    };

    this.showResultScreen = function (data) {
        var self = this;
        $('#od').show();
        var width = window.innerWidth;
        var height = window.innerHeight;
        var scale = Math.min(1, height / 800);
        var scaleval = "scale(" + scale + ")";

        var basStart = 0;
        var prop = scaleval;
        var od = document.getElementById('statsPanel');
        $('#result-logo').css({
            "transform": prop
        });
        $('#result-esc').css({
            "transform": prop
        });
        var resultTop = 120 * scale;
        od.style.display = 'block';
        od.style.top = resultTop + 'px';
        od.style.opacity = 1;
        od.style.transform = prop;
        new TWEEN.Tween({
                x: basStart,
                y: 0
            })
            .to({
                x: resultTop,
                y: 1
            }, 400)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function () {
                od.style.top = this.x + 'px';
                od.style.opacity = this.y;
            })
            .onComplete(function () {
                od.style.top = resultTop + 'px';
                od.style.opacity = 1;
            })
            .start(self.appTime);

        return true;
    };


    this.showRespawnScreen = function (data) {
        var self = this;
        var dFac = 4;
        this.packRec = 0;
        if (this.combobar) {
            this.combobar.reset();
        }
        $('.rdarkness').fadeIn('100');
        rendererObj.hideShowSpeedBar(false);
        var width = window.innerWidth;
        var height = window.innerHeight;
        var scale = Math.min(1, height / 800);
        var scaleval = "scale(" + scale + ")";

        var basStart = window.innerHeight / 2;
        var prop = scaleval;
        var rd = document.getElementById('rd');
        var respawnText = document.getElementById('respawnText');
        //  var statsDiv = document.getElementsByClassName('statsdiv')[0];
        // var od__ = $('#od').outerHeight(true);
        var textH = $('#respawnText').outerHeight(true);
        // var odH = od__ / 2;
        var statTop = Math.max(100, window.innerHeight / 2 - textH / 2);

        if (scale < 1) {
            statTop = Math.max(100 * scale, window.innerHeight / 2 - textH / 2 - (textH / dFac) * scale);
        }
        if (data) {
            if (('' + data[1]).toLowerCase().indexOf('god') !== -1) {
                $('#killer_respawn').css('color', 'lime').text('' + data[1]);
            } else {
                $('#killer_respawn').css('color', 'red').text('' + data[1]);
            }
            //     $('#dd-kills').text('' + data[0]);
            //     $('#dd-lb').text('' + data[1]);
            //     $('#dd-xp').text('' + data[2]);
            //     $('#stat-bks').text('' + data[3]);
            //     $('#dd-top').text('' + data[4]);
            //     $('#dd-ta').text('' + data[5] + ' sec');
        }


        setTimeout(function () {
            rd.style.display = 'block';
            rd.style.top = statTop + 'px';
            rd.style.opacity = 1;
            rd.style.transform = prop;
            new TWEEN.Tween({
                    x: basStart,
                    y: 0,
                    z: 1.5
                })
                .to({
                    x: statTop,
                    y: 1,
                    z: 1
                }, 400)
                .easing(TWEEN.Easing.Cubic.Out)
                .onUpdate(function () {
                    rd.style.top = this.x + 'px';
                    rd.style.opacity = this.y;
                    rd.style.transform = 'scale(' + this.z + ')';
                })
                .onComplete(function () {
                    rd.style.top = statTop + 'px';
                    rd.style.transform = 'scale(1)';
                    rd.style.opacity = 1;
                })
                .start(self.appTime);


            this.pressE_tween = new TWEEN.Tween({
                    x: 0.97
                })
                .to({
                    x: 1.03

                }, 450)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                    respawnText.style.transform = 'scale(' + this.x + ')';
                })
                .yoyo(true)
                .repeat(Infinity)
                .start(self.appTime);
        }, 250);
        return true;
    };

    this.slowLoop = (function () {
        var counter = 0;
        return (function () {
            counter++;
            var tex = '';
            var ret = null;
                var mt = Math.max(0, this.matchTime);
                var min = 0;
                var rend = this.getRenderer();
                var sec = 0;
                min = pad(Math.floor(mt / 60), 2);
                sec = pad(mt % 60, 2);
            
            if (this.tipUpdateOn) {
                if (counter % 3 == 0) {
                    this.gameTips.update(this.appTime);
                }
            }
        }).bind(this);

    }).bind(this)();

    this.gameFinish_prepareForNextGame = function () {
        $('.darkness').fadeOut(100);
        $('.rdarkness').fadeOut(100);
        var self = this;
        this.toSendInput = {
            all: [],
            toSend: [],
            space: 0,
            ctrl: 0,
            zoom: 1,
            bot: 0,
            remove: 0,
            ball: 0,
            l: 0,
            r: 0
        };
        this.lastPlayers = [];
        this.gameFood && this.gameFood.reset();
        this.player && this.player.disconnect();
        var keys = Object.keys(this.otherPlayers);
        for (var i = 0; i < keys.length; i++) {
            this.otherPlayers['' + keys[i]].disconnect();
            delete this.otherPlayers['' + keys[i]];
        }
        self.appStart = performance.now();
        self.lastInputTime = 0;
        self.packets = [];
        self.canPlay = true;
        self.discData = [];
        window.lset = false;
        self.idleCounter = 0;
        self.restart = true;
        self.otherPlayersKeys = [];
       
    };
    this.startNextGame_auto = function () {
        var vis = $('#overlays').is(':visible');
        if (vis) {
            return;
        }
        var self = this;
        $('#od').hide();
        rendererObj.powerLevelChange(0);
        this.startApp(true, function () {
            self.getRenderer().showInGameUI();
            var name = self.getLastTimeName();
            self.playBtnClicked(true,self, false, name, null, false, false);

        });
    };
    this.backToMenuFromRespawnMenu = function () {
        if (this.pressE_tween) {
            this.pressE_tween.stop();
            this.pressE_tween = null;
        }
        this.musicHighRate = false;
  //      this.soundManager.changeMusicRate(1);
        
        this.disableEnterKey = false;
        $('.top-block').hide();
        $('.darkness').fadeOut(100);
        $('.rdarkness').fadeOut(100);
        $('#rd').fadeOut(100);
        rendererObj.hideGame();
        var self = this;
        this.toSendInput = {
            all: [],
            toSend: [],
            space: 0,
            ctrl: 0,
            zoom: 1,
            bot: 0,
            remove: 0,
            ball: 0,
            l: 0,
            r: 0
        };
        this.lastPlayers = [];
        this.gameFood && this.gameFood.reset();

        this.player.disconnect();
        var keys = Object.keys(this.otherPlayers);
        for (var i = 0; i < keys.length; i++) {
            this.otherPlayers['' + keys[i]].disconnect();
            delete this.otherPlayers['' + keys[i]];
        }
        var name = this.getLastTimeName();
        self.appStart = performance.now();
        self.lastInputTime = 0;
        self.canPlay = false;
        self.packets = [];
        self.changePlayBtnState(0);
        setTimeout(function () {
            self.canPlay = true;
            self.changePlayBtnState(4);

        }, RESTART_LOADING_TIME);
        self.discData = [];
        window.lset = false;
        self.idleCounter = 0;
        self.restart = true;
        self.otherPlayersKeys = [];
        self.showInt();

        this.ingame = false;
    };


    this.backToGame = function () {
        $('.rdarkness').fadeOut(60);
        $('darkness').hide();
        $('#rd').fadeOut(60);
        if (this.pressE_tween) {
            this.pressE_tween.stop();
            this.pressE_tween = null;
        }
        this.toSendInput = {
            all: [],
            toSend: [],
            space: 0,
            ctrl: 0,
            zoom: 1,
            bot: 0,
            remove: 0,
            ball: 0,
            l: 0,
            r: 0
        };
        this.player.hideShow(true);
        this.player.respawn();
        rendererObj.hideShowSpeedBar(true);
        primus.send('bk');
    };

    this.disc = function (pid, val, br) {
        if (!this.player) {
            return;
        }
        var data = new Array(6);
        var len = 0;
        if (val === 2) {
            data[0] = br.readUInt16();
            len = br.readUInt16();
            data[1] = br.readStringUnicode(len);
            data[2] = br.readUInt16();
            data[3] = br.readUInt16();
            data[4] = br.readUInt16();
            data[5] = br.readUInt16();
        }
        if (pid == this.player.id) {
            if (val == 1) {
                this.disconnectGame();
            } else if (val == 4) {
                this.newRegion();
            }
            // dead disconnect
            else if (val == 2) {
                this.player.deadSpec = true;
                this.player.hideShow(false);
                this.showRespawnScreen(data);
            }

        } else if (this.otherPlayers['' + pid]) {
            this.otherPlayers['' + pid].disconnect();
            delete this.otherPlayers['' + pid];
        }


    };
    this.addBasePrimusEvents = function (cb) {
        var $this = this;
        primus.on('zzz', function (data) {
            var data = new BR(data);
            var time = (+data.readUInt16()) * 1000;
            console.log('shutting down server in:' + time);
        });

        primus.on('t0', function () {

            $this.getErrorHand().showError("Tag limit reached. Please remove a tag to continue.");
        });
        primus.on('t1', function () {
            $this.addTag();
            $('.delTaunt').hide();
            $('#newtaunt').focus().val('');
        });
        primus.on('x0', function (errorCode) {
            $this.showBlockedPage();
        });
        primus.on('x1', function (errorCode) {
            $this.showMaintenancePage();
        });
        primus.on('x2', function (errorCode) {
            $this.showMaintenancePage();
        });

        primus.on('dc', function (data) {
            var br = new BR(data);
            dc_count = br.readUInt8();
            for (var z = 0; z < dc_count; z++) {
                dc_pid = br.readUInt16();
                dc_reason = br.readUInt8();
                $this.disc(dc_pid, dc_reason, br);
            }
        });
        primus.on('66', function (data) {
            $this.backToMenuFromRespawnMenu();
        });

        // msg rec for request '86' 
        // socket disconnected from server
        primus.on('85', function (data) {
            $this.gameFinish_prepareForNextGame();
        });
        primus.on('76', function (data) {
            $this.backToGame();
        });

 
        // servers
        primus.on('4', function (data) {
            var br = new BR(data);
            var allRegionKeys = {};
            var count = br.readUInt16();
            var regCount = 0;
            var total = 0;
            var servReg = 0;
            var area = '';
            var codes = Conf.LOC_CODES;
            var map = Conf.SERVERS_LIST_MAP;
            for (var i = 0; i < count; i++) {
                servReg = Math.max(1,Math.min(6,br.readUInt8()));
                area =  map[''+ codes[''+ servReg]];
                regCount = br.readUInt8();    
                $this.allRegions[''+ area] = regCount;          
            }
            window.total = total;
         //   console.log($this.allRegions);
            $this.updateRegVals($this.allRegions);
        });

        primus.on('b1', function (br) {
            var data = new BR(br);
            var skin_low = data.readUInt16();
            var skin_high = data.readUInt16();
            var catCount = data.readUInt8();
            Conf.SKIN_HIGH = skin_high;
            Conf.SKIN_LOW = skin_low;
            var catName = '';
            var catDataLen = 0;
            var catNameLen = 0;
            var skLen = 0;
            var skName = '';

            Conf.SKINS_DATA = [];
            var cat = null;
            for (var i = 0; i < catCount; i++) {
                catNameLen = data.readUInt8();
                catName = data.readStringUtf8(catNameLen);
                catDataLen = data.readUInt16();
                Conf.SKINS_DATA['' + catName] = [];
                cat = Conf.SKINS_DATA['' + catName];
                for (var j = 0; j < catDataLen; j++) {
                    skLen = data.readUInt8();
                    skName = data.readStringUtf8(skLen);
                    cat.push(skName);
                }
            }
        });

        primus.on('z11', function (data) {
            var br = new BR(data);
            Conf.COMBO_TIME = br.readUInt8();
            Conf.TIME_GAP_BETWEEN_COMP = br.readUInt8();
            Conf.SERVER_BLOCKS_COUNT = br.readUInt8();
            Conf.MAP_FACE_VALUE = br.readUInt16();
            Conf.MIN_MASS_FOR_HELPER = br.readUInt16();
            Conf.MASS_TO_WEIGHT = br.readFloat();
            Conf.CAM_DEFAULT_ZOOM = br.readFloat();
            Conf.CAM_MAX_ZOOM = br.readFloat();
            Conf.MAX_WINGS = br.readUInt8();
            Conf.BABY_WING_LEN_COUNT = br.readUInt8();
            Conf.WING_LEN_FOR_COOL_WINGS = br.readUInt8();
            var lowRate = 1000 / br.readUInt16();
            var lMax = br.readUInt8();
            Conf.LEADERBOARD_MAX = lMax;
            Conf.INPUT_LOOP_TIME = lowRate;

            $this.playerStartTime = $this.getKDate();
            pingRec = true;
            $this.gameUpdate(null, null);
        });

        primus.on('z2', function (data) {
            var arr = {
                opt: []
            };
            var bpacket = new BR(data);
            var count = bpacket.readUInt8();
            var servLen = 0;
            var currServ = '';
            var servTemp = Soulcrashers.Templates.server;
            var servList = [];
            var servList2= [];
            $this.allRegions = {};
            var mapper = {};
            var LOC_CODES = {};
            Conf.LOC_CODES = {};
            for (var i = 0; i < count; i++) {
                servLen = bpacket.readUInt8();
                currServ = '' + bpacket.readStringUtf8(servLen);
                currServ = currServ.replace(/_/g, "-");
                $this.allRegions['' + currServ] = 0;
                servList.push(currServ);
            }
            Conf.SERVERS_LIST_LONG = servList;
            for (var i = 0; i < count; i++) {
                servLen = bpacket.readUInt8();
                currServ = '' + bpacket.readStringUtf8(servLen);
                servList2.push(currServ);
                mapper['' + currServ ] =servList[i];
                LOC_CODES['' + (i+1)] ='' + currServ;
            }
            Conf.LOC_CODES = LOC_CODES;
            Conf.SERVERS_LIST_SHORT = servList2;
            Conf.SERVERS_LIST_MAP = mapper;
            for (var i = 0; i < Conf.SERVERS_LIST_LONG.length; i++) {
                arr.opt.push({
                    data:Conf.SERVERS_LIST_LONG[i]
                })
            }
            var htm = servTemp(arr);
            $('#server').html(htm);
        });

        //graphics
        primus.on('z3', function (data) {
            var bpacket = new BR(data);
            var count = bpacket.readUInt8();
            var servLen = 0;
            var currServ = '';
            var servTemp = Soulcrashers.Templates.graphic;
            var servList = [];
            for (var i = 0; i < count; i++) {
                servLen = bpacket.readUInt8();
                currServ = '' + bpacket.readStringUtf8(servLen);
                servList.push(currServ);
            }

            var arr = {
                opt: []
            };
            for (var i = 0; i < servList.length; i++) {
                arr.opt.push({
                    data: servList[i]
                })
            }
            var htm = servTemp(arr);
            $('#graphic').html(htm);
            $this.addDropdownEvents();
        });

        primus.on('z0', function (data) {
            var bpacket = new BR(data);
            var modesCount = bpacket.readUInt8();
            var defMode = bpacket.readUInt8();
            var currMode = '';
            var modeLen = 0;
            var modes = [];
            for (var i = 0; i < modesCount; i++) {
                modeLen = bpacket.readUInt8();
                currMode = bpacket.readStringUtf8(modeLen);
                modes.push(currMode);
            }
            Conf.GAME_MODE_DEFAULT = modes[Math.max(0, defMode - 1)];
            Conf.GAME_MODES = modes;
            $this.gameMode = Conf.GAME_MODE_DEFAULT;
        });

        primus.on('z1', function (data) {
            var bpacket = new BR(data);
            var modesCount = bpacket.readUInt8();
            var currVal = '';
            var typeLen = 0;
            for (var i = 0; i < modesCount; i++) {
                typeLen = bpacket.readUInt8();
                currVal = bpacket.readStringUtf8(typeLen);
                Conf.MODE_TO_LB['' + Conf.GAME_MODES[i]] = currVal;
            }
        });

        primus.on('a0', function (data) {
            var C_AD_DATA = [];
            var bpacket = new BR(data);
            var noOfAds = bpacket.readUInt8();
            var b2read = [];
            var i = 0,
                j = 0;
            for (i = 0; i < noOfAds; i++) {
                b2read.push(bpacket.readUInt8());
            }
            for (i = 0; i < b2read.length / 2; i++) {
                C_AD_DATA.push({
                    url: bpacket.readStringUtf8(b2read[i])
                });
            }
            for (i = b2read.length / 2, j = 0; j < b2read.length / 2, i < b2read.length; j++, i++) {
                C_AD_DATA[j]['link'] = 'http://' + bpacket.readStringUtf8(b2read[i])
            }
            Conf.AD_DATA = C_AD_DATA;
        });
        primus.on('pi0', function (data) {
            // console.log('total count:' + data);
        });
        primus.on('a1', function (data) {
            //2 byte msgs
            var bpacket = new BR(data);
            $this.MAX_MATCHTIME = bpacket.readUInt16();
            DISCONNECT_TIME = bpacket.readUInt16() * 1000;
            Conf.DEFAULT_MAX_TAGS = bpacket.readUInt16();
            var count = bpacket.readUInt16();
            Conf.POWER_BAR_MAX = [];
            for (var i = 0; i < count; i++) {
                Conf.POWER_BAR_MAX.push(bpacket.readUInt16());
            }
            var invalidTime = bpacket.readUInt16();
            Conf.DOUBLE_MODE_TIME = bpacket.readUInt16();
            Conf.POP_MATCH_INVALID_TIME = invalidTime;
        });

        primus.on('a2', function (data) {
            var bpacket = new BR(data);
            var def_name_len = bpacket.readUInt8();
            var def_name = bpacket.readStringUnicode(def_name_len);
            Conf.DEFAULT_NAME = def_name;
            var verLen = bpacket.readUInt8();
            var stateLen = bpacket.readUInt8();
            var ver = bpacket.readStringUtf8(verLen);
            var state = bpacket.readStringUtf8(stateLen);
            Conf.GAME_VER = ver;
            Conf.GAME_STAGE = state;
        });

        primus.on('a4', function (data) {
            var bpacket = new BR(data);
            Conf.DEL_SCALE_EAT = bpacket.readFloat();
            Conf.DEL_SCALE_PARK = bpacket.readFloat();
        });
        primus.on('a5', function (data) {
            var bpacket = new BR(data);
            var p_len = bpacket.readUInt8();
            var sp_len = bpacket.readUInt8();
            var ext_len = bpacket.readUInt8();
            Conf.FILES_PARENT = bpacket.readStringUtf8(p_len);
            Conf.FILES_SPARENT = bpacket.readStringUtf8(sp_len);
            Conf.FILES_EXT = bpacket.readStringUtf8(ext_len);

            Conf.DOT_COLOR_SCALES = {};
            Conf.DOT_COLOR_NUM = {};

            var dot_dd = ('' + Conf.DOT_CHART).split(',');
            var toFind = ('' + 100);
            var middle = dot_dd.indexOf(toFind);
            var currIndex = 0;
            for (var i = 0; i < middle; i++) {
                Conf.DOT_COLOR_NUM['' + currIndex] = '0x' + dot_dd[i];
                currIndex++;
            }
            currIndex = 0;
            for (var i = middle + 1; i < dot_dd.length; i++) {
                Conf.DOT_COLOR_SCALES['' + currIndex] = Number(dot_dd[i]) / 10;
                currIndex++;
            }
        });
        primus.on('a6', function (data) {
            var bpacket = new BR(data);
            var count = bpacket.readUInt8();
            var read = null;
            for (var i = 0; i < count; i++) {
                read = bpacket.readFloat();
                Conf.RING_DEF_TIME.push(read);
            }

        });
        primus.on('a7', function (data) {
            var bp = new BR(data);
            Conf.DOT_CHART = [];
            var toPush = Conf.DOT_CHART;
            var count = bp.readUInt8();
            var i = 0;
            for (i = 0; i < count; i++) {
                toPush.push(bp.readStringUtf8(6));
            }
            toPush.push(100);
            for (i = 0; i < count; i++) {
                toPush.push(bp.readUInt8());
            }
            Conf.DOT_CHART = toPush;
            primus.send('a9');
        });
        // files packet starts
        primus.on('fgj', function (data) {
            Conf.JPG_FILES = Conf.JPG_FILES || [];
            var bp = new BR(data);
            var noOfFiles = bp.readUInt8();
            var i = 0;
            var itemBytes = [];
            var fileNames = [];
            for (i = 0; i < noOfFiles; i++) {
                itemBytes.push(bp.readUInt8());
            }
            for (i = 0; i < itemBytes.length; i++) {
                fileNames.push('images/jpg/' + bp.readStringUtf8(itemBytes[i]) + '.jpg');
            }
            Conf.JPG_FILES = fileNames;
        });
        primus.on('fgpo', function (data) {
            Conf.PNG_OBJ_FILES = Conf.PNG_OBJ_FILES || [];
            var bp = new BR(data);
            var noOfFiles = bp.readUInt8();
            var eleSize = bp.readUInt8();
            var i = 0;
            var fileNames = [];
            var el = '';
            for (i = 0; i < noOfFiles; i++) {
                el = bp.readStringUtf8(eleSize);
                if (el.indexOf('d') >= 0) {
                    var char1 = el.charAt(0);
                    var isNum = ('0123456789'.indexOf(el.charAt(1)) !== -1);
                    if (isNum) {
                        var numVal = +el.charAt(1);
                        for (var j = 1; j <= numVal; j++) {
                            fileNames.push('images/obj/' + char1 + '' + j + '.png');
                        }
                    }
                } else {
                    fileNames.push('images/obj/' + el + '.png');
                }

            }
            Conf.PNG_OBJ_FILES = fileNames;

        });

        primus.on('fgpst', function (data) {
            Conf.PNG_STYLES_FILES = Conf.PNG_STYLES_FILES || [];
            var bp = new BR(data);
            var sCount = bp.readUInt8();
            var eleSize = bp.readUInt8();
            var i = 0;
            var fileNames = [];
            var name = bp.readStringUtf8(eleSize);
            for (i = 1; i <= sCount; i++) {
                fileNames.push('images/styles/' + name + '' + i + '.png');
            }
            Conf.PNG_STYLES_FILES = fileNames;
        });

        primus.on('fgpsk', function (data) {
            var bp = new BR(data);
        });

        primus.on('fgpg', function (data) {
            Conf.PNG_GEMS_FILES = Conf.PNG_GEMS_FILES || [];
            var bp = new BR(data);
            var gemsCount = bp.readUInt8();
            var eleSize = bp.readUInt8();
            var i = 0;
            var fileNames = [];
            var name = bp.readStringUtf8(eleSize);
            for (i = 1; i <= gemsCount; i++) {
                fileNames.push('images/gems/' + name + '' + i + '.png');
            }
            Conf.PNG_GEMS_FILES = fileNames;

        });
        primus.on('fgpa', function (data) {
            if (!data) {
                return;
            }
            Conf.PNG_ANI_FILES = Conf.PNG_ANI_FILES || [];
            var bp = new BR(data);
            var noOfFiles = bp.readUInt8();
            var eleSize = bp.readUInt8();
            var i = 0;
            var fileNames = [];
            for (i = 0; i < noOfFiles; i++) {
                fileNames.push('images/ani/' + bp.readStringUtf8(eleSize) + '.png');
            }
            Conf.PNG_ANI_FILES = fileNames;
        });
        primus.on('fgpso', function (data) {
            Conf.PNG_SOCIAL_FILES = Conf.PNG_SOCIAL_FILES || [];
            var bp = new BR(data);
            var noOfFiles = bp.readUInt8();
            var eleSize = bp.readUInt8();
            var i = 0;
            var fileNames = [];
            for (i = 0; i < noOfFiles; i++) {
                fileNames.push('images/social/' + bp.readStringUtf8(eleSize) + '.png');
            }
            Conf.PNG_SOCIAL_FILES = fileNames;

        });


        primus.on('rg', function (data) {
            var br = new BR(data);
            var bit = br.readUInt8();

            if (cb) {
                cb();
            }
            primus.send('rfr');
        });
        primus.on('fgpsh', function (data) {
            Conf.PNG_SHOP_FILES = Conf.PNG_SHOP_FILES || [];
            var bp = new BR(data);
            var noOfFiles = bp.readUInt8();
            var eleSize = bp.readUInt8();
            var i = 0;
            var fileNames = [];
            for (i = 0; i < noOfFiles; i++) {
                fileNames.push('images/shop/' + bp.readStringUtf8(eleSize) + '.png');
            }
            Conf.PNG_SHOP_FILES = fileNames;
            primus.send('fr'); // send all iles rec msg

        })
        primus.on('fset', function (data) {

            var br = new BR(data);
            var ws = br.readUInt32();
            var nb = br.readUInt32();
            var qq = br.readUInt16();
            var ge_size = br.readUInt16();
            var ge_scale = br.readFloat();
            var f3 = Conf.PNG_OBJ_FILES;
            var f5 = Conf.PNG_SHOP_FILES;
            var f6 = Conf.PNG_SOCIAL_FILES;
            var f10 = Conf.JPG_FILES;
            var files = [].concat(f3, f5, f6, f10);
            Conf.FILES = files;
            Conf.FILESI = [];

            var fi = Conf.FILESI;
            var item = '';
            var index = -1;
            var sIndex = -1;
            for (var i = 0; i < files.length; i++) {

                item = files[i];

                sIndex = item.lastIndexOf('/');
                lIndex = item.lastIndexOf('.');
                fi['' + item.substring(sIndex + 1, lIndex)] = i;
            }
            if (cb) {
                cb();
            }
            $this.init(ws, nb, qq, ge_size, ge_scale, $this.gameReady.bind($this));
        });

        primus.on('p2', function (data) {

            var rend = $this.getRenderer();
            var br = new BR(data);
            var posX = br.readInt16();
            var posY = br.readInt16();
            $this.player.initPlayer(0, 0, posX, posY);
            $this.hideInt();
            $this.disableOnGameStart();
        });

        primus.on('pn', function (data) {
            if (!$this.player) {
                return;
            }
            var br = new BR(data);
            var plId = br.readUInt16();
            if ($this.otherPlayers['' + plId]) {
                return;
            }
            var nameLen = br.readUInt8();
            var name = br.readStringUnicode(nameLen);
            var skinLen = br.readUInt8();
            var skinName = br.readStringUtf8(skinLen);

            var faceLen = br.readUInt8();
            var faceName = br.readStringUtf8(faceLen);
            var weaponLen = br.readUInt8();
            var weaponColor = br.readStringUtf8(weaponLen);
            var data = [plId, name, faceName, skinName, weaponColor];
            $this.addOtherPlayer($this, data);

        });
        primus.on('21', function (data) {
            var br = new BR(data);
            var mode = br.readUInt8();
            if (mode === 8) {
                var rend = $this.getRenderer();
                rend && rend.showError('Exit the attack mode to continue!!!!', '0xffff00', TWEEN, 1, 1, 10, 20);
            } else {
                if ($this.player) {
                    $this.player.setMode(mode);
                }
            }
        });
        // files packet ends
        primus.on('p0', function (data) {

            var br = new BR(data);
            var pid = br.readUInt16();
            var pNameLen = br.readUInt8();
            var pColorlen = br.readUInt8();
            var faceLen = br.readUInt8();
            var weaponLen = br.readUInt8();
            var pName = br.readStringUnicode(pNameLen);
            var pColor = br.readStringUtf8(pColorlen);
            var faceName = br.readStringUtf8(faceLen);
            var weaponColor = br.readStringUtf8(weaponLen);
            var opCount = 0 || +(br.haveMore() && br.readUInt16());
            var oplayersData = [];
            var _other_id = 0;
            var _other_name_len = 0;
            var rotdata = 0;
            var otherFaceLen = 0;
            var otherColorLen = 0;
            var otherWeaponLen = 0;
            var otherFaceName = '';
            var otherWeaponColor = '';
            var otherColor = '';
            for (var i = 0; i < opCount; i++) {
                _other_id = br.readUInt16();
                _other_name_len = br.readUInt8();
                _other_name = br.readStringUnicode(_other_name_len);
                otherColorLen = br.readUInt8();
                otherColor = br.readStringUtf8(otherColorLen);
                otherFaceLen = br.readUInt8();
                otherFaceName = br.readStringUtf8(otherFaceLen);
                otherWeaponLen = br.readUInt8();
                otherWeaponColor = br.readStringUtf8(otherWeaponLen);
                oplayersData.push([_other_id, _other_name, otherFaceName, otherColor, otherWeaponColor]);
            }
            $this.initClient(oplayersData, pid, pName, pColor, faceName, weaponColor);
        });

        //error code listener
        primus.on('e0', function (data) {
            var br = new BR(data);
            var errorCode = br.readUInt8();
            if (errorCode === 'full') {
                console.log('full room error');
            }
        });

        // food enter range
        primus.on('f0', function (data) {
            var br = new BR(data);
            var dots = [];
            var count = br.readUInt16();
            var x = 0;
            var y = 0;
            for (var i = 0; i < count; i++) {
                x = br.readUInt16();
                y = br.readUInt16();
                dots.push([x, y]);
            }

        });
        primus.on('f1', function (data) {
            var br = new BR(data);

        });
        primus.on('f2', function (data) {
            var br = new BR(data);

        });
        primus.on('en', function (binary) {
            var br = new BR(binary);
            var pl = br.readUInt16();
            var x = br.readUInt16();
            var y = br.readUInt16();
            var bl = br.readUInt16();
            var pla = null;

        });

        primus.on('8', function (data) {
            var br = new BR(data);
            var pid = br.readUInt16();
            var switchTo = null;
            if (+this.player.id === +pid) {
                switchTo = this.player;

            } else {
                switchTo = $this.otherPlayers['' + pid];
            }
            if (switchTo) {
                this.switchCamToPlayer(switchTo);
            }
        });

        primus.on('l', function (binary) {
            var br = new BR(binary),
                pid = -1,
                all = [],
                myrank = -1,
                total = br.readUInt8(),
                toRead = total;
            // i am not in top N

            if (+total === +(Conf.LEADERBOARD_MAX + 1)) {
                toRead = Conf.LEADERBOARD_MAX;
            }
            for (var i = 0; i < toRead; i++) {
                // total 10 if i am in top 10
                pid = br.readUInt16();
                if (pid == $this.player.id) {
                    all.push([$this.player.name, i + 1, 1]);
                }
                $this.otherPlayers['' + pid] && all.push([$this.otherPlayers['' + pid].name, i + 1, 0]);
            }
            if (total === Conf.LEADERBOARD_MAX + 1) {
                all.push([$this.player.name, br.readUInt8(), 1]);
            }
            $this.lb.lbUpdate("ranking", all);
        });
        primus.on('c', function (data) {
            var br = new BR(data);
            var pid = br.readUInt16();
            var ckills = br.readUInt8();
            //  var pl = (pid === $this.player.id);
            // // if(pl){
            // //     pl.comboKills(ckills);
            // // }
            $this.combobar.combo(ckills);

        });
      
        // waiting period start now
        primus.on('tw', function (binary) {
            if (!$this.ingame || !$this.player) {
                return;
            }
            var br = new BR(binary);
            var rank = br.readUInt8();
            var count = br.readUInt8();
            var data = [];
            var pl = null;
            var pid = null;
            var deaths = 0;
            var kills = 0;
            var name = '';
            for (var i = 0; i < count; i++) {
                pid = br.readUInt16();
                name = br.readStringUnicode(pid);
                kills = br.readUInt16();
                deaths = br.readUInt16();
                data.push([name, kills, deaths]);
            }
          
                var arr = {
                    rank: 0,
                    items: []
                };
                var servTemp = Soulcrashers.Templates.result_pop;

                arr.rank = rank || 'N/A';

                for (var i = 0; i < data.length; i++) {
                    arr.items.push({
                        name: data[i][0],   
                        pops: data[i][1],
                        deaths: data[i][2]
                    })
                }
                var htm = servTemp(arr);
                $('#od').html(htm);
                $this.getRenderer().hidePlayers(true);
             
                var rd = $("#rd");
                if (rd.is(':visible')) {
                    rd.hide();
                    $('.darkness').hide();
                    $('.rdarkness').hide();
                }
                $this.getRenderer().hideShowSpeedBar(false);
                if ($this.ingame) {
                    $this.showResultScreen();
                }
                $this.canPrepareForNextGame = true;   
        });
        primus.on('o', function (binary) {
            var br = new BR(binary);
            var playerDebugData = {};
            var allCount = br.readUInt8(); // no of players visible to the player
            var rend = $this.getRenderer();
            var flags = 0,
                flags2 = 0,
                count_exdata = 0,
                count_endata = 0,
                currPlayers = [],
                myNewBlock = -1,
                killerLen = 0,
                playersNewFoodData = [],
                foodData = [],
                foodLen = 0,
                faceLen = 0,
                faceLen2 = 0,
                faceData = [],
                faceLen_ex = 0,
                ballonPopFlag = false,
                faceData_ex = [],
                pl_ex_data = [],
                chatPid = -1,

                bulletDataR = [],
                bulletCountR = 0,
                newplFood = false,
                pl_en_data = [],
                pdata = null,
                clTime1 = 0,
                servTime1 = 0,
                servTime2 = 0,
                bulletCount = 0,
                bulletData = [],
                eatCount = 0,
                childCount = 0,
                ret = null,
                pla = null,
                dc_count = 0,
                powerOnFlag = false,
                powerOffFlag = false,
                chatLen,
                chatMsg = '',
                dc_pid = -1,
                zoom = 1,
                killerName = null,
                playersNewFood = false,
                zoomLevel = 0,
                dc_reason = '',
                cp2 = $this.getCurrTimeC(),
                eatArr = new Array(6),
                childArr = [],
                leftArrRec = false,
                rightArrRec = false;

            clTime1 = br.readUInt32() || (cp2 - 27);
            servTime1 = br.readUInt32();
            servTime2 = br.readUInt32();
            var __rrr = [];
            ret = $this.processLatency(cp2, clTime1, servTime1, servTime2, br._buffer.byteLength);
            // move via all the players currently visible
            for (var i = 0; i < +allCount; i++) {
                pl_ex_data = [];
                childArr = [];
                eatCount = 0;
                bulletData = [];
                bulletDataR = [];
                bulletCount = 0;
                bulletCountR = 0;
                killerLen = 0;
                killerName = null;
                childCount = 0;
                pdata = new Array(4);
                newplFood = false;
                powerOnFlag = false;
                powerOffFlag = false;
                myNewBlock = -1;
                foodData = {};
                chatLen = 0;
                chatPid = -1;
                ballonPopFlag = false;
                chatMsg = null;
                foodLen = 0;
                leftArrRec = false;
                rightArrRec = false;
                faceLen = 0;
                faceLen2 = 0;
                faceLen_ex = 0;
                playersNewFoodData = [];
                faceData_ex = [];
                faceData = [];
                eatArr = new Array(6);
                flags = 0;
                flags2 = 0;
                punctured = false;
                flags = (br.readUInt8()).toString(2);
                flags2 = (br.readUInt8()).toString(2);
                flags = Array(8 - flags.length + 1).join("0") + flags;
                flags2 = Array(8 - flags2.length + 1).join("0") + flags2;
                if (+flags[1]) {
                    rend.powerLevelChange(br.readUInt8());
                }
                if (+flags[2]) {

                    bulletCount = br.readUInt16();
                    
                    for (var k = 0; k < bulletCount; k++) {
                        bulletData.push(br.readUInt16());
                    }
                }
                if (+flags2[7]) {
                    bulletCountR = br.readUInt16();
                    for (var k = 0; k < bulletCountR; k++) {
                        bulletDataR.push(br.readUInt16());
                    }
                }

                if (+flags[3]) {
                    rend.speedBoostLevel(br.readUInt16());
                }
                // re
                if (+flags2[3]) {
                    leftArrRec = true;
                }
                if (+flags2[4]) {
                    powerOnFlag = true;
                }
                if (+flags2[0]) {
                    powerOffFlag = true;
                }
                if (+flags2[2]) {
                    rightArrRec = true;
                }
                if (+flags[4]) {
                    killerLen = br.readUInt16();
                    killerName = br.readStringUnicode(killerLen);
                }
                if (+flags2[1]) {
                    ballonPopFlag = true;
                }
                if (+flags2[5]) {

                    chatLen = br.readUInt8();
                    chatMsg = br.readStringUnicode(chatLen);
                }

                if (+flags2[6]) {
                    newplFood = true
                    $this.gameFood.newFoodFromServer(br);
                }
                //eat data
                if (+flags[5]) {
                    eatCount = br.readUInt16();
                    for (var z = 0; z < eatCount; z++) {
                        eatArr[0] = br.readUInt16();
                        eatArr[1] = br.readUInt16();
                        eatArr[2] = br.readUInt16();
                        eatArr[3] = br.readUInt8();
                        eatArr[4] = br.readUInt8();
                        eatArr[5] = br.readUInt16();
                        if (eatCount < 5) {
                          //  $this.soundManager.playSoundEat('eat');
                        }
                        if ($this.player.id === eatArr[0]) {
                            pla = $this.player;

                        } else {
                            pla = $this.otherPlayers['' + eatArr[0]];
                        }

                        $this.gameFood.eat(TWEEN, $this.appTime, eatArr[1], eatArr[2], eatArr[3], eatArr[4], eatArr[5], pla);

                    }
                }

                pdata[0] = br.readUInt16();
                pdata[1] = br.readUInt16();
                pdata[2] = br.readUInt16();
                pdata[3] = br.readUInt16();

                currPlayers.push(pdata[0]);
                var boosSoundPl = null;

                if ($this.player.id === pdata[0]) {
                    boosSoundPl = $this.player;

                } else {
                    boosSoundPl = $this.otherPlayers['' + pdata[0]];
                }
                if (boosSoundPl && boosSoundPl.lcs && boosSoundPl.happyFacesSaved > 1) {
                  //  $this.soundManager.playSoundBoost('boost');
                }

                // new block rec
                if (+flags[0]) {
                    myNewBlock = br.readUInt16();
                }

                if (+flags[7]) {
                    count_endata = br.readUInt8();
                    for (var j = 0; j < count_endata; j++) {
                        var pushRegion = br.readUInt16();
                        pl_en_data.push(pushRegion);
                    }
                    for (var j = 0; j < count_endata; j++) {
                        foodData['' + pl_en_data[j]] = [];
                        foodLen = br.readUInt16();
                        for (var k = 0; k < foodLen; k++) {
                            foodData['' + pl_en_data[j]].push([br.readUInt16(), br.readUInt16(), br.readUInt8(), br.readUInt8()]);
                        }
                    }
                } else if (+flags[6]) {
                    count_exdata = br.readUInt8();
                    for (var j = 0; j < count_exdata; j++) {
                        var exitData = br.readUInt16();
                        pl_ex_data.push(exitData);
                    }
                } else if (+flags[6] && +flags[7]) {
                    count_endata = br.readUInt8();
                    count_exdata = br.readUInt8();

                    for (var j = 0; j < count_endata; j++) {
                        pl_en_data.push(br.readUInt16());
                    }
                    for (var j = 0; j < count_exdata; j++) {
                        pl_ex_data.push(br.readUInt16());
                    }
                }

                if (Object.keys(foodData).length > 0) {
                    $this.gameFood.dataPush(foodData);
                }
                if (count_exdata > 0) {
                    $this.gameFood.dataPop(pl_ex_data);
                }

                $this.packets.push([ret[0], ret[1], pdata, childArr, pl_en_data,
                    pl_ex_data, myNewBlock, $this.packDt, chatMsg, killerName,
                    leftArrRec, rightArrRec, ballonPopFlag, powerOnFlag, powerOffFlag,
                    bulletData, bulletDataR
                ]);
            }
            $this.hideShowPl(currPlayers.slice());
            $this.lastPlayers = currPlayers;
        });
    };
    this.prepareForNextGame = function () {
        var vis = $('#overlays').is(':visible');
        if(vis){
            return;
        }
        if (this.canPrepareForNextGame) {
            this.canPrepareForNextGame = false;
            var primus = this.getPrimus();
            if (primus) {
                var bw = new BW(1);
                bw.writeUInt8(2);
                primus.send('86', bw.toBuffer());
            }

        }
    }
    this.switchCamToPlayer = function (pl) {};
    this.updateRegVals = function (data) {
        var dropdown = $('#server');
        var keys = Object.keys(data);
        dropdown.empty();
        var keyVal = '';

        var toReplace = '';
        for (var i = 0; i < keys.length; i++) {
            keyVal = keys[i];
            if (+data[keys[i]] > 0) {
                toReplace = keyVal + '(' + data[keys[i]] + ')';
            } else {
                toReplace = keyVal;
            }
            dropdown.append(
                $('<option>', {
                    value: toReplace,
                    text: toReplace
                }, '<option/>')
            );
        }
    };

    this.processLatency = function (cp2, clTime1, servTime1, servTime2, lastSize) {

        // cap the rtt to 2s
        this.lastServTime = this.servTime;
        this.servTime = servTime2;
        this.packDt = this.servTime - this.lastServTime;
        var rtt = this.roundTripTime = cp2 - clTime1; // rtt will vary depending on loop game between server and client
        var spp = servTime2 - servTime1;
        /// more than 100s with no input
        this.latency = (rtt - spp) / 2;
        this.lat_coll.push(this.latency);
        this.alatency = Math.floor(this.lat_coll.reduce(function (a, b) {
            return a + b;
        }) / this.lat_coll.length);
        if (this.packRec % 19 === 0) {
            this._coffset = ((servTime2 + this.alatency - cp2) + (servTime1 - this.alatency - clTime1)) * 0.5;
        }
        this.packRec++;
        this.ctimeArr.length > 10 && this.ctimeArr.splice(0, 1);
        this.ctimeArr.push(this._coffset);
        this._coffset_avg = Math.floor(this.ctimeArr.reduce(function (a, b) {
            return a + b;
        }) / this.ctimeArr.length);
        this.lat_coll.length > Conf.LAT_SIZE && this.lat_coll.splice(0, 1);
        this.lastPackFromServ = this.getCurrTime();
        this.lastPackSize = lastSize;
        return [servTime2 + this.latency, servTime2];
    };
    this.hideShowPl = function (cP) {
        var ind = -1,
            pid = this.player.id,
            opl = this.otherPlayers,
            lp = this.lastPlayers;

        for (var i = 0; i < lp.length; i++) {
            ind = cP.indexOf(lp[i]);
            if (ind < 0) {
                (pid === lp[i]) && this.player.hidePl();
                (opl['' + lp[i]]) && opl['' + lp[i]].hidePl();
            } else {
                cP.splice(ind, 1);
            }
        }

        for (var i = 0; i < cP.length; i++) {
            (pid === cP[i]) && this.player.showPl();
            (opl['' + cP[i]]) && opl['' + cP[i]].showPl();
        }
    };

    this.commonUpdate = function (ms) {
        this.ttimer.update(ms);
        this.appTime += ms;
    };

    this.pktUpdate = function (now) {
        var pack = null;
        while (this.packets.length > 0) {
            pack = this.packets[0];
            if (pack[0] < now) {
                if (this.player.id === pack[2][0]) {
                    if (pack[12]) {
                        this.player.camDisable = true;
                    }
                    this.player.pushSnapshots(this.appTime, pack[1], now, pack[3], pack[2][1], pack[2][2], 0, pack[2][3], pack[4], pack[5],
                        pack[6], pack[7], pack[8], pack[9], pack[10], pack[11], pack[12], pack[13], pack[14], pack[15], pack[16]);
                } else {
                    if (this.otherPlayers['' + pack[2][0]]) {
                        this.otherPlayers['' + pack[2][0]].pushSnapshots(this.appTime, pack[1], now, pack[3], pack[2][1], pack[2][2], 0,
                            pack[2][3], pack[4], pack[5], pack[6], pack[7], pack[8], pack[9], pack[10], pack[11], pack[12], pack[13], pack[14], pack[15], pack[16]);
                    }
                }
                this.packets.splice(0, 1);
            } else {
                //  console.log('packet error:' + pack[0] + "," + now + "," + this._coffset);
                break;
            }
        }
    };

    this.setDeadData = function (totalTime) {
        var alltimePlay = 0;
        var totalTimeData = window.store.get('totaltime') || 0;
        if (totalTimeData <= 0) {
            window.store.set('totaltime', totalTime);
            alltimePlay = totalTime;
        } else {
            alltimePlay = Number(totalTimeData) + Number(totalTime);
            window.store.set('totaltime', alltimePlay);
        }

        var playtime1 = window.store.get('playtime1') || 0;
        var del = (Date.now() - playtime1) / 1000;
        if (del > DELTA_DATA_TIME_SEC) {
            var less_24 = window.store.get('24less') || 0;
            if (less_24 <= 0) {
                window.store.set('24less', 0);
            } else {
                var last24hr = Number(alltimePlay) - Number(less_24);
                window.store.set('24less', last24hr);
            }
        }
    }

    this.initClient = function (op_data, pid, name, color, faceName, weaponColor) {
        ctx = rendererObj.ctx;
        this.ingame = true;
        this.player = undefined;
        var soundState = window.store.get('s_sound');
        var musicState = window.store.get("s_music");
        var colorState = window.store.get('s_color');
        if (this.soundManager) {
            if (soundState == 1) {
            //    this.soundManager.mute(true);
            }
            if (musicState == 2) {
                this.musicOn = false;
            //    this.soundManager.muteMusic();
            }
            this.musicHighRate = false;
          //  this.soundManager.changeMusicRate(1);
        }

        rendererObj.showPlayerStage();
        this.player = new Player(faceName, this, name, color, pid, weaponColor, TWEEN, 10, keyboard, rendererObj, true);
        for (var i = 0; i < op_data.length; i++) {
            this.addOtherPlayer(this, op_data[i]);
        }
        rendererObj.setCamera(this.player, this.freeMouse);
        this.gameUpdate(this.player, rendererObj);
        this.gameRender(this.player, rendererObj, ctx);
        var pdata = {
            n: 'NoName',
            c: 0x33aa99
        };

        var cdata = this.getRenderer().getCanvasData();
        var res = {
            x: canvas.width,
            y: canvas.height
        };

        this.gd_load = true;
        curr_render = CURR_REND.GAME;

        if (keyboard) {
            keyboard.removeEvents();
            keyboard.setMouseEvents(this.mouseScroll);
            this.addKeyboardEvents.call(this);
        }
        var _now = this.getCurrTimeC();
        var bw = new BW(4);
        bw.writeUInt32(_now);
        primus.send('p1', bw.toBuffer());

    };
    this.addOtherPlayer = function ($this, data) {
        $this.otherPlayers['' + data[0]] = new Player(data[2], $this, data[1], data[3], data[0], data[4], TWEEN, 10, null, $this.getRenderer(), false, null);
        $this.otherPlayers['' + data[0]].initOther();
    };
    this.getRenderer = function () {
        return rendererObj;
    };
    this.gkeyboard = function () {
        return keyboard;
    };
    this.showWelcomeScreen = function () {
        if ($('#canvas').css('display') != 'none') {
            this.reset();
        }
    };
    this.getMyself = function () {
        return this.player;
    };

    this.updateXP = function (xp) {
        if (this.tb) {
            if (xp != this.tb.xp) {
                this.tb.updateXP(xp);
            }
        }
    };

    this.createLB = function () {
        var mode = ('' + this.gameMode).toLowerCase().trim();
        var lbType = Conf.MODE_TO_LB['' + mode];
        if (!lbType) {
            return;
        }

        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;
        this.lb = new Leaderboard(rendererObj, lbType, winWidth, winHeight);
    };

    this.addSocketEvents = function () {
        var $this = this;

        primus.on('disconnected', function () {
            console.log('disconnected');
        });

        primus.on('disconnect', function () {
            console.log('disconnect');
        });

        primus.on('online', function () {
            console.log('online');
        });

        primus.on('end', function () {
            console.log('ended');
        });

        primus.on('close', function () {
            console.log('clised');
        });

        primus.on('offline', function () {
            console.log('offline');
        });
    };

    this.showAd = function (cb) {
        cb();
    };

    this.updateLastDayData = function (count) {
        if (count > 200 || count <= 0) {
            return;
        }
    };

    this.startLoadingAni = function (element) {
        var loadingDots = ['.', '..', '...', '....'];
        var count = 0;
        if (window.pbtnLoading) {
            return;
        }
        var dots = 'Loading' + loadingDots[((count++) % loadingDots.length)];
        if (window.stillLoading) {
            dots = 'Still Loading';
            window.stillLoading = null;
        }
        element.text(dots);

    }
    this.changePlayBtnState = function (state) {
        // play btn click loading game
        if (window.maint) {
            $('#soul-login-play span').text("Under Maintenance").removeClass('play-text');
            $('#soul-login-play').removeClass('gameplaybtn-green wrongBtn gameplaybtn-dis').addClass('boombtn gameplaybtn-red');
            return;
        }
        if (state === 0) {
            $('#soul-login-play span').text("Loading");
            $('#soul-login-play').removeClass('gameplaybtn-red').addClass('gameplaybtn-dis').removeClass('boombtn').addClass('wrongBtn');
            this.startLoadingAni($('#soul-login-play span'));
            $('#email').prop('readonly', true);

        } else if (state === 1) {
            this.clearLoadingAni();
            $('#soul-login-play span').text(POP_MATCH_TEXT);
            $('#soul-login-play').removeClass('gameplaybtn-red wrongBtn gameplaybtn-dis').addClass('boombtn gameplaybtn-green');
            $('#email').prop('readonly', false);
        }
        // player disconnected timeout
        else if (state === 2) {
            this.clearLoadingAni();
            $('#soul-login-play span').text("Reconnect").removeClass('play-text');
            $('#soul-login-play').removeClass('gameplaybtn-green wrongBtn gameplaybtn-dis').addClass('boombtn gameplaybtn-red');
        } else if (state === 3) {
            $('#soul-login-play').removeClass('btn_invalidH gameplaybtn-red wrongBtn').addClass('btn_invalidH');
        }
        //game restarted
        else if (state === 4) {
            $("#soul-login-play span").text("Play again");
            $('#soul-login-play').removeClass('gameplaybtn-red wrongBtn gameplaybtn-dis').addClass('boombtn gameplaybtn-green');
            $('#email').prop('readonly', false);
        }
    }
    this.playBtnClicked = function (auto,thisval, s, val, pbtn, justRestart, superFast, fastRestart) { 
        var self = this;
        if (!superFast) {
            if (!thisval.canPlay){
                return;
            }
            if (!thisval.playBtnReady) {
                this.getErrorHand().showError('Please try again later.', Color.DARK);
                return;
            }
        }

        var val2 = window.store.get('playcount') || 0;
        if (val2 > 0) {
            var playtime1 = window.store.get('playtime1');
            if (!playtime1) {
                window.store.set('playtime1', Date.now());
            } else {
                var del = (Date.now() - playtime1) / 1000;
                if (del > (DELTA_DATA_TIME_SEC)) {
                    self.updateLastDayData(val2);
                    window.store.set('playcount', 1);
                    val2 = 0;
                }
            }
        } else {
            window.store.set('playtime1', Date.now());
        }
        val2++;
        this.playCount = val2;

        window.store.set('playcount', val2);
        if (this.adsShown > 5) {
            this.addPlayerToGame(thisval, s, val, pbtn, justRestart, fastRestart);
            return;
        } else {
            if (this.playCount > 2) {
                this.showAd(function (done) {
                    if (done) {
                        var adShownVal = window.store.get('adshown') || 0;
                        adShownVal++;
                        self.adShown = adShownVal;
                        window.store.set('adshown', adShownVal);
                        self.addPlayerToGame(thisval, s, val, pbtn, justRestart, fastRestart);
                    } else {
                        self.addPlayerToGame(thisval, s, val, pbtn, justRestart, fastRestart);
                    }
                });
            } else {
                self.addPlayerToGame(thisval, s, val, pbtn, justRestart, fastRestart);
            }
        }

    };
    this.fStatus = function (res) {
        if (social) {
            social.fResponse(res);
        }
    };
    this.getLastTimeName = function () {
        return window.store.get(Conf.lasttimename) || '';
    };
    this.savePlayerName = function (name) {
        window.store.set(Conf.lasttimename, name);
    };
    this.addWatchPlToGame = function () {
        if (window.maint) {
            return;
        }
        var bw = new BW(2);
        var _now = this.getCurrTimeC();
        bw.writeUInt32(_now);
        bw.writeUInt16(window.innerWidth);
        bw.writeUInt16(window.innerHeight);
        this._coffset = 0;
        primus.send('g1', bw.toBuffer());
    };

    this.addPlayerToGame = function (thisval, spectate, val, pbtn, justRestart, fastRestart) {
        if (window.maint) {
            return;
        }
      
        var item = null;
        var bw = new BW(30),
            _name = $('#email').val().trim();
        thisval.savePlayerName(_name);
        thisval.showWindow(FONT_NORMAL, false);
        _name = _name.replace(/[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g, '');
        this.changePlayBtnState(0);
        var _now = this.getCurrTimeC();
        bw.writeUInt32(_now);
        bw.writeUInt8(254);
        bw.writeUInt16(window.innerWidth);
        bw.writeUInt16(window.innerHeight);
        var _name_len = Buffer.byteLength(_name, 'ucs2');
        bw.writeUInt8(_name_len);
        bw.writeStringUnicode(_name);
        var faceName = window.store.get('facename') || 'empty';
        var clr = window.store.get('skin') || '#ffe0bd';
        bw.writeUInt8(clr.length);
        bw.writeStringUtf8(clr);
        bw.writeUInt8(faceName.length);
        bw.writeStringUtf8(faceName);
        if (!thisval.superChat) {
            bw.writeUInt8(1);
        } else {
            bw.writeUInt8(2);
            bw.writeUInt8(thisval.superChat.chats.length);
            for (var i = 0; i < thisval.superChat.chats.length; i++) {
                item = thisval.superChat.chats[i];
                bw.writeUInt8(item[1]);
                bw.writeUInt8(Buffer.byteLength(item[0], 'ucs2'));
                bw.writeStringUnicode(item[0]);
            }
        }
        this._coffset = 0;
        primus.send('g', bw.toBuffer());
        if (!fastRestart) {
            this.updateQualityInGame();
        }

        if (this.musicOn) {
        //    this.soundManager.playMusic(1);
        }
    };

    this.updateQualityInGame = function () {
        if (this.gameFood) {
            this.gameFood.updateQuaity(this.quality);
        }
    };

    this.worldUpdate = function (dt) {

    };

    this.evilDead = function () {

    };

    this.killLoops = function () {
        if (keyboard) {
            keyboard.kill();
        }
    };

    this.gameRender = function (player, rendererObj, ctx) {
        var self = this;
        if (!this.ingame) {
            this.karkRender = (function (pl, dt, ms) {
                rendererObj && rendererObj.renderMenu(ms, null, self.leagues);
            }).bind(this);
        } else {
            this.karkRender = (function (pl, dt, ms) {
                this.counter++;
                rendererObj.renderWorld(pl, this.otherPlayers, ms, dt);
                this.gameFood.update_high(rendererObj.camera._width / 2, rendererObj.camera._height / 2, rendererObj.camera.center);
            }).bind(this);
        }
    };

    this.karkProcess = function (delta, currtime) {
        var keys = Object.keys(this.otherPlayers);
        if (this.player && this.player.initialized) {
            TWEEN.update(this.appTime);
            this.player.update(currtime, delta);
            for (var i = 0; i < keys.length; i++) {
                this.otherPlayers[keys[i]] && this.otherPlayers[keys[i]].update(currtime,delta);
            }
        }
    }

    this.gameUpdate = function (player, rendererObj) {
        if (!this.ingame) {
            this.karkUpdate = (function (delta, ms) {
                this.commonUpdate(ms);
                TWEEN.update(this.appTime);
            }).bind(this);
        } else {
            this.karkUpdate = (function (delta, ms) {
                this.currLoopTime = this.getCurrTime();
                var currtime_avg = this.getCurrTimeAvg();
                var curr_cli = this.getCurrTimeC();
                this.commonUpdate(ms);
                this.pktUpdate(this.currLoopTime);
                this.karkProcess(ms, this.currLoopTime);
                if ((curr_cli - this.lastInputTime) >= Conf.INPUT_LOOP_TIME) {
                    this.gameInput(rendererObj);
                    this.lastInputTime = curr_cli;
                }
                this.lastLoopTime = this.currLoopTime;
            }).bind(this);
        }
    };

    this.setUniqueId = function () {
        var randomlyGeneratedUID = Math.random().toString(36).substring(3, 16) + new Date();
        window.store.set('gameUniqueId', guid());
    };

    this.mouseScroll = function (e) {
        return false;
    };

    this.getServer = function () {
        return this.gameSparkServer;
    };

    this.filesLoadedCB = function (back, cb) {
        this.getRenderer().worldSetup(back, this.restart);
        rendererObj.hideGame();
        cb();
    };


    this.playerLoggedOut = function () {
        $('.secrow').show();
        $('#daily_reward').children('.loaderext').html('');
        $('#daily_reward').removeClass('reward-available').addClass('reward-pending').children('span').text('Bonus Coins');
        $('.secrow-logged').hide();
        $('.user-header-in img').attr("src", '');
        $('.mm-mode-outer').hide();
        this.user_name = this.guest_name;
        $('.user-header-in span.user-heading').text(this.user_name);
        $('.user-header-in img').attr("src", Conf.GUEST_IMG_URL);
    };
    this.loginSucc = function (type, data) {
        this.loggedIn = true;
        this.loginType = type;
        this.logoutText();
        $('.mm-log-btn').show();
        $('.secrow').hide();
        $('.secrow-logged').show();
        this.user_name = data.name_;
        this.showLoginDialog('hide');
        if (type === 'fb') {
            $('.user-heading').text(data.name_);
            $('.user-header-in img').attr("src", data.url_);
            $('.user-header-in span.user-heading').prop('title', data.name_);

        } else if (type === 'goo') {
            $('.user-heading').text(data.name_);
            $('.user-header-in img').attr("src", data.url_);
            $('.user-header-in span.user-heading').prop('title', data.name_);

        }
    };
    this.rqServ = function () {
        return this.reqServer;
    }
    this.getErrorHand = function () {
        return this.errorhandler;
    }

};
window.gameClient = undefined;
$(document).add('*').off();
var gameClient = new GameClient();
(function () {
    var top = 0;
    var allSec = $('.all_sections');
    var endSec = $('.end_section');
    var adCont = $('#adcont');

    var width = window.innerWidth;
    var height = window.innerHeight;
    var scale;

    scale = Math.min(1, height / 800);
    var scaleval = "scale(" + scale + ")";
    var prop = scaleval;
    var allSecH = allSec.outerHeight();
    endSec.height(300);
    allSecH = allSec.outerHeight();
    var upperMax = Math.max(0, window.innerHeight / 2 - allSecH / 2 - allSecH / 10);
    top = upperMax;
    allSec.css('top', top + 'px');
    adCont.height(250).width(300);

})();

window.gameClient = gameClient;
GameClient.prototype.getKDate = function () {
    return Date.now();
}
appHouseKeeping(gameClient);

// SOCIAL_ENABLED && gameClient.setSocial();
gameClient.serverFn(window.priority, function (server,type,regCode,country) {
    gameClient.basicSetup(server,type,regCode,country);
});

// CONNECTS  with social network and other stuff
window.initStoreWindow = (function (token) {
    if (token === null || token === undefined) {
        alert('token not defined');
    } else {

    }
    var options = {
        access_token: token, //TODO use access token, received on previous step
        sandbox: true, //TODO please do not forget to remove this setting when going live
        lightbox: {
            zIndex: 99999,
            closeByClick: true,
            closeByKeyboard: true,
            spinner: 'round',
            spinnerColor: '#ffffff',
            spinnerRotationPeriod: 2
        }
    };
    var s = document.createElement('script');
    s.type = "text/javascript";
    s.async = true;
    s.src = "https://static.xsolla.com/embed/paystation/1.0.7/widget.min.js";
    s.addEventListener('load', function (e) {
        XPayStationWidget.init(options);
        XPayStationWidget.on(XPayStationWidget.eventTypes.OPEN_WINDOW, function (event, data) {
            gameClient.clientStoreOpenWindow(event, data);
        });
        XPayStationWidget.on(XPayStationWidget.eventTypes.CLOSE_WINDOW, function (event, data) {
            gameClient.clientStoreCloseWindow(event, data);
        });
        XPayStationWidget.on(XPayStationWidget.eventTypes.LOAD, function (event, data) {
            gameClient.clientStoreLoaded(event, data);
        });
        XPayStationWidget.on(XPayStationWidget.eventTypes.OPEN, function (event, data) {
            console.log('wow' + JSON.stringify(XPayStationWidget));
            gameClient.clientStoreOpen(event, data);
        });
        XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS, function (event, data) {
            gameClient.clientStoreStatus(event, data);
        });
        XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS_INVOICE, function (event, data) {
            gameClient.clientStoreS_invoice(event, data);
        });
        XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS_DELIVERING, function (event, data) {
            gameClient.clientStoreS_delivering(event, data);
        });
        XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS_DONE, function (event, data) {
            gameClient.clientStoreS_done(event, data);
        });
        XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS_TROUBLED, function (event, data) {
            gameClient.clientStoreS_trouble(event, data);
        });
    }, false);
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(s);
}).bind(window);

window.captCallback = function (e) {
    gameClient.verf_capt(true, function () {
        grecaptcha.reset();
    });
};
window.auth2 = null;
window.googleUser = null;

window.gready = false;
window.gloggedin = false;
window.fStatus = function (response) {
    gameClient.fStatus(response);
}
window.appReadyToStart = function () {
    if (!gameClient) {
        console.error("cannot start game!!!");
        return;
    }
    gameClient.startApp();
}
window.gameLoaded1 = function () {

}

window.gapiInit = function () {
    if (!gameClient.getSocial()) {
        return;
    }
    if (!gapi) {

        return;
    }
    gapi.load('auth2', function () {
        window.auth2 = gapi.auth2.init({
            client_id: '880217176157-4c7va4dmdlau1uov5mh5rdtua2gabs9p.apps.googleusercontent.com',
            scope: 'profile'
        });
        gapi.auth2.getAuthInstance().isSignedIn.listen(function (val) {
            if (val) {
                gameClient.getSocial().gSignedIn(auth2.currentUser.get());
            }
        });
        auth2.attachClickHandler(document.getElementById('btn-google-plus-glo'), {}, gameClient.getSocial().gResponse.bind(gameClient), gameClient.getSocial().gResponseErr.bind(gameClient));
    });
};

window.onGoogleYoloLoad = function (googleyolo) {
    window.gready = true;
};
window.lset = false;
window.already_conn = false;
window.captECallback = function (e) {
    gameClient.verf_capt(false);
};

(function () {
    window.ww = window.innerWidth;
    window.wh = window.innerHeight;
    window.ppx = 0;
    window.ppy = 0;

})();

window.appCl_loaded = true;