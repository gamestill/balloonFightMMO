var Conf = require('./gameConf.js');
var P = require('./pixinc.js');
var X_GAP = 10;
var MAX_PLAYERS = Conf.LEADERBOARD_MAX;
var LB_WIDTH = 220 - X_GAP;
var REC_PADDING_HEAD_X = 10;
var REC_PADDING_HEAD_Y = 5;
var C_X = window.innerWidth - LB_WIDTH;
var C_Y = 10;
var REC_PADDING_X = 22;
var REC_PADDING_Y = 10;
var LB_HEIGHT = 300;
var CLR = 0x111111;
var OPACITY = 0.1;

var styleHead = {
    fill: 0x99ff33,
    fontSize: 24,
    fontWeight: 'bold'
};

var style = [{
        fill: 0xff0000,
        fontSize: 16,
        fontWeight: 'bold'
    },
    {
        fill: 0x00ff30,
        fontSize: 16,
        fontWeight: 'bold'
    },
    {
        fill: 0x00a2ff,
        fontSize: 16,
        fontWeight: 'bold'
    },
    {
        fill: 0xff7b7b,
        fontSize: 16
    },
    {
        fill: 0xffc27b,
        fontSize: 16
    },

    {
        fill: 0xd7ff78,
        fontSize: 16
    },
    {
        fill: 0x76ffd0,
        fontSize: 16
    },
    {
        fill: 0xc573ff,
        fontSize: 16
    },
    {
        fill: 0x6c8bff,
        fontSize: 16
    },
    {
        fill: 0x9ac2ff,
        fontSize: 16
    },
    {
        fill: 0xeeeeee,
        fontSize: 16,
        fontWeight: 'bold'
    },

];
var arrowStyle = {
    fill: 0xdd2200,
    fontSize: 15
};

var Leaderboard = function (rend, type, winwidth, winHeight) {
    MAX_PLAYERS = Conf.LEADERBOARD_MAX;
    this.type = type;
    this.renderer = rend;
    this.winwidth = winwidth;
    this.winHeight = winHeight;
    this.lbData = {};
    this.container = new P.Container();
    this.container.visible = false;
    this.container.pivot.y = 0;
    this.myPos = 0;
    this.container.pivot.x = 0;
    this.texts = [];
    this.arrow = null;

    this.lbUpdate = function (type, servLeaderboard) {
        if(!this.texts){
            return;
        }
        if (type === 'ranking') {
            this.container.visible = true;
            this.myPos = 0;
            var _i = 0;
            for (var i = 0; i < servLeaderboard.length; i++) {
                _i = Math.min(10,Math.max(0, i));
                this.texts[_i].text = "" + (_i + 1) + ". " + servLeaderboard[_i][0];
                this.texts[_i].style = style[_i];
                (+servLeaderboard[_i][2] === 1) && (this.myPos = _i);
            }

            // if the data rec is for less players than the max players hide the remaining player for which data not rec. or the total
            // number of players are currently not enough
            for (var i = servLeaderboard.length; i < MAX_PLAYERS; i++) {
                _i = Math.min(10,Math.max(0, i));
                this.texts[i].text = "";
            }

            // data recieved for n+1 players because i am not in top MAX i.e may be 10
            if (servLeaderboard.length === (MAX_PLAYERS + 1)) {
                this.myPos = MAX_PLAYERS;
                myRank = servLeaderboard[Math.min(servLeaderboard.length - 1, MAX_PLAYERS)][1];
                this.texts[MAX_PLAYERS].text = '' + myRank + ". " + servLeaderboard[Math.min(servLeaderboard.length - 1, MAX_PLAYERS)][0];
                this.texts[MAX_PLAYERS].style = style[MAX_PLAYERS];
            } else {
                this.texts[MAX_PLAYERS].text = "";
            }
            this.arrow.position.y = this.texts[this.myPos].position.y;
        }
    };
    this.resize = function (w, h) {
        this.container.position.x = w - LB_WIDTH;
        this.container.position.y = C_Y;
    }
    this.createRanking = function () {
        var w = LB_WIDTH,
            h = LB_HEIGHT,
            tex = null,
            tex_height = 0,
            headerH = 0,
            heading = new PIXI.Text("Top Players", styleHead),
            rect = new P.Graphics();
        rect.beginFill(CLR, OPACITY);
        rect.drawRect(0, 0, w - X_GAP, h);  
        rect.endFill();
        heading.anchor.x = heading.anchor.y = 0;
        heading.position.x = LB_WIDTH / 2 - heading.width / 2 - X_GAP;
        heading.position.y = REC_PADDING_HEAD_Y;
        headerH = heading.height;
        this.container.addChild(rect, heading);

        for (var i = 0; i < MAX_PLAYERS + 1; i++) {
            tex = new PIXI.Text("", style[0]);
            tex.anchor.x = tex.anchor.y = 0;
            this.texts.push(tex);
            tex_height = tex.height;
            tex.position.x = REC_PADDING_X;
            tex.position.y = heading.position.y + headerH * 1.3 + i * tex_height * 1.3;
            this.container.addChild(tex);
        }

        this.arrow = new PIXI.Text("\u25B6", arrowStyle);
        this.arrow.position.x = 10;
        this.container.addChild(this.arrow);
        this.texts[this.texts.length - 1].style = style[0];
    };
    this.showHide = function (val) {
        this.container.visible = val;
    };
    this.init = function (type) {
        this.container.position.x = C_X;
        this.container.position.y = C_Y;
        this.container.visible = false;
        var layer = this.renderer.getUILayer();
        var overlay = this.renderer.getOverlayStage();
        overlay.addChild(this.container);

        this.container.displayGroup = layer;
        if (type === 'ranking') {
            this.createRanking();
        }
    };

    this.init(this.type);
};

module.exports = Leaderboard;