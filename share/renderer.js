var P = require('./pixinc.js');
var WorldBoundary = require('./WorldBoundary.js');
var $ = require('jquery');
var Camera = require('./Viewport.js');
var pixilayers = require('pixi-display');
var jQuery = $;
var FastMath = require('./fastmath.js');
var fMath = new FastMath();
var Conf = require('./gameConf.js');
var waterHeight = Conf.WaterHeight;
var mmax = Math.max;
var mmin = Math.min;
var abs = Math.abs;

var SpeedBar = require('./speedbar.js');

var GRID_RECT_SPRITE_P_BLOCK;
////RENDERER CLASS//////////////////////////
var gridEleScale = 0;
var gridEleSize = 0;
var Renderer = function (ap_, ws, nb, qq, ge_size, ge_scale, _tw, defaultTheme, _application) {
    var worldSize = ws;
    var TW = _tw;
    TweenEngine = TW;
    NO_OF_WBLOCKS = nb;
    gridEleSize = ge_size;
    gridEleScale = ge_scale;
    Conf.worldSize = worldSize;
    Conf.GRID_SIZE = Math.floor((gridEleScale * gridEleSize * qq) / 100) * 100;
    Conf.GRID_SIZE_1D = worldSize / Conf.GRID_SIZE;
    Conf.GRID_RECT_SPRITE_P_BLOCK = qq;
    GRID_RECT_SPRITE_P_BLOCK = qq;
    var IMAGES_TO_LOAD = Conf.FILES;
    var worldGridBlockSize = worldSize / NO_OF_WBLOCKS
    var percent = 10;
    //aliases   
    this.client = ap_;
    this.application = ap_.application;
    this.renderer = ap_.application.renderer;
    var mainMenuStage;
    var shopStage;
    var gameStage;
    var backgroundStage;
    var deadStage;
    var overlayStage;
    var playerStage;
    var wingStage;
    var camStage;
    var count = 0;
    var char;
    var calls = 0;
    this.tiledBackground;
    var worldGridBlocks = [];
    var worldBoundary;
    var speedbar;
    var shootBar = {};
    var worldGridBlocksYSearch = [];
    var BOTTOM_LAYER = new PIXI.DisplayGroup(1, false);
    var gridSpriteBLayer = new PIXI.DisplayGroup(2, false);
    var gridSpriteLayer = new PIXI.DisplayGroup(3, false);
    var gridSpriteTLayer = new PIXI.DisplayGroup(4, false);
    var gridSpriteVTLayer = new PIXI.DisplayGroup(5, false);
    var playerGridCommonLayerBottom = new PIXI.DisplayGroup(6, false);
    var playerGridCommonLayerTop = new PIXI.DisplayGroup(7, false);
    var playerBottomLayer = new PIXI.DisplayGroup(8, false);
    var playerTopLayer = new PIXI.DisplayGroup(10, false);
    var SUPER_LAYER_MIDDLE = new PIXI.DisplayGroup(13, false);
    var SUPER_LAYER_BOTTOM = new PIXI.DisplayGroup(11, false);
    var SUPER_LAYER_TOP = new PIXI.DisplayGroup(15, false);
    var uiLayer = new PIXI.DisplayGroup(20, false);
    this.camera = null;
    this.lb = null;
    this.cameraV = null;
    this.theme = defaultTheme;
    this.winWidth = 0;
    this.winHeight = 0;
    this.counter = 0;
    this.errorTween = null;
    this.deadText = null;
    this.resetBtn = null;
    this.backBtn = null;
    this.errorTxt = null;
    this.deadBackground = null;
    this.view = null;
    this.zoomLevel = 1;
    this.gridSet = false;
    this.freemouse = undefined;
    this.spritesLoaded = false;
    this.playerColorTable = {};

    this.getPlayerStage = function () {
        return playerStage;
    };
    this.getWingStage = function () {
        return wingStage;
    };
    this.getUILayer = function () {
        return uiLayer;
    }

    this.changeBackgroundColor = function (color) {
        this.application.backgroundColor = color;
    };
    this.getClient = function () {
        return this.client;
    };

    this.getCanvasData = function () {
        var canvas = this.application.view;
        return {
            x: canvas.width,
            y: canvas.height
        };
    };
    this.winResize = function () {
        var iw = window.innerWidth;
        var ih = window.innerHeight;
        var canvas = this.application.renderer.view;
        canvas.style.width = iw + 'px';
        canvas.style.height = ih + 'px';
        if (this.application) {
            this.application.renderer.resize(iw, ih);
            if (this.camera) {
                this.camera.resize();
            }

        }
        if (speedbar) {
            speedbar.resize();
        }
    };

    this.getSuperStage = function () {
        return this.application.stage;
    };

    this.getShopStage = function () {
        return shopStage;
    };

    this.loadFont = function (cb) {
        window.mainFont = 'Arial';
        cb();
    };

    this.setupRenderer = function (cb) {
        var $this = this;
        if (this.spritesLoaded) {
            return false;
        }
        this.view = this.renderer.view;
        document.body.appendChild(this.view);
        this.application.view.id = "canvas";
        $(this.renderer.view).attr('id', 'canvas');

        mainMenuStage = mainMenuStage || new P.Container();
        camStage = camStage || new P.Container();
        shopStage = shopStage || new P.Container();
        deadStage = deadStage || new P.Container();
        gameStage = gameStage || new P.Container();
        playerStage = playerStage || new P.Container();
        wingStage = wingStage || new P.Container();

        backgroundStage = backgroundStage || new P.Container();
        overlayStage = overlayStage || new P.Container();
        shopStage.displayList = new P.DisplayList();
        this.application.stage.displayList = new P.DisplayList();
        gameStage.displayList = new P.DisplayList();
        shopStage.displayGroup = SUPER_LAYER_BOTTOM;
        camStage.pivot.x = shopStage.pivot.x = mainMenuStage.pivot.x = backgroundStage.pivot.x = gameStage.pivot.x = overlayStage.pivot.x = this.application.stage.pivot.x = backgroundStage.pivot.x = playerStage.pivot.x = 0.5;
        shopStage.pivot.y = camStage.pivot.y = backgroundStage.pivot.y = backgroundStage.pivot.y = mainMenuStage.pivot.y = overlayStage.pivot.y = playerStage.pivot.y = 0.5;
        this.application.stage.pivot.y = gameStage.pivot.y = 0.5;
        // mainMenuStage.addChild(shopStage);
        gameStage.addChild(backgroundStage, wingStage, playerStage);
        camStage.addChild(gameStage);
        this.application.stage.addChild(deadStage, overlayStage);
        deadStage.displayGroup = SUPER_LAYER_TOP;
        backgroundStage.displayGroup = gridSpriteLayer;
        playerStage.displayGroup = playerBottomLayer;

        wingStage.displayGroup = playerBottomLayer;
        this.loadSprites(function () {
            $this.spritesLoaded = true;
            cb();
        });
        mainMenuStage.visible = false;

        this.errorTxt = new PIXI.Text('', {
            stroke: 0x444444,
            strokeThickness: 2,
            fontFamily: 'Do Hyeon',
            fill: 0xffffff,
            fontSize: 20
        });
        this.errorTxt.visible = false;
        this.errorTxt.anchor.x = 0.5;
        this.errorTxt.anchor.y = 0;
        this.errorTxt.displayGroup = uiLayer;
        this.errorTxt.position.x = window.innerWidth / 2;
        this.errorTxt.position.y = window.innerHeight - window.innerHeight / 20;
        overlayStage.addChild(this.errorTxt);

        return true;
    };

    this.setCamera = function (player, freemouse) {
        this.reset();
        this.freemouse = freemouse;
        var graphic = player.getGraphic();
        this.application.stage.addChild(camStage);
        this.camera = new Camera(this.client, TweenEngine, this.renderer, window.innerWidth, window.innerHeight, camStage, graphic);
        camStage.displayGroup = BOTTOM_LAYER;
        //  this.winResize();
    };

    this.loadImg = function (imgfiles, cb) {
        var animFiles = Conf.PNG_ANI_FILES;
        P.loader.add(imgfiles);
        if (animFiles && animFiles.length > 0) {
            for (var i = 0; i < animFiles.length; i++) {
                var item = ('' + animFiles[i]).substring(0, animFiles[i].length - 3) + 'json';
                P.loader.add("spritesheet", item);
            }
        }
        P.loader.load(cb);
    };

    this.loadM_Img = function (imgfiles, cb) {
        var arr = [];
        var count = 0;
        for (var i = 0, len = imgfiles.length; i < len; i++) {
            if (imgfiles[i].length > 0) {
                arr[count++] = "" + imgfiles[i];
            }
        }
        count = 0;
        P.loader.add(arr).load(cb);
    };

    this.loadSprites = function (cb) {
        this.loadImg(IMAGES_TO_LOAD, this.loadSpritesCallback.bind(this, cb));
    };
    this.loadSpriteImg = function (file, cb) {
        this.loadImg([file], this.loadSpritesCallback.bind(this, cb));
    };

    this.loadSpritesCallback = function (cb) {
        cb();
    };

    this.showGame = function () {
        var time = this.client.appTime;
        var self = this;
        var canv = document.getElementById('canvas');
        canv.style.display = 'block';
        self.application.stage.visible = true;
        new TW.Tween({
                x: 0
            })
            .to({
                x: 1
            }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.Out)
            .onUpdate(function () {
                canv.style.opacity = this.x;
                self.application.stage.alpha = this.x;
                self.application.stage.scale.set(this.x, this.x);
            })
            .onComplete(function () {
                canv.style.opacity = 1;
                self.application.stage.alpha = 1;
                self.application.stage.scale.set(1, 1);
                self.application.stage.visible = true;
            })
            .start(time);

    };

    this.hideGame = function () {
        this.application.stage.visible = false;
        $('#canvas').hide();
    }

    // };
    this.getDeadStage = function () {
        return deadStage;
    }

    this.setupFpsBlock = function (cont) {
        // this.errorTxt = new PIXI.Text('',{
        //     stroke: 0x444444,
        //     strokeThickness: 2,
        //     fontFamily: 'Do Hyeon',
        //     fill: 0xffffff,
        //     fontSize: 20
        // });
        // this.errorTxt.visible = false;
        // this.errorTxt.anchor.x = 0.5;
        //  this.errorTxt.anchor.y = 1;
        // this.errorTxt.position.x =   0;
        // this.errorTxt.position.y = window.innerHeight - window.innerHeight/20;      
        // overlayStage.addChild(this.errorTxt);
    };

    this.setupDebugBlock_grid = function (cont) {
        if (Object.prototype.toString.call(cont) === '[object Array]') {
            for (var i = 0; i < cont.length; i++) {
                overlayStage.addChild(cont[i]);
            }
        }
        // just a container
        else {
            overlayStage.addChild(cont);
        }
    };
    this.getSuperMiddleLayer = function () {
        return SUPER_LAYER_MIDDLE;
    };
    this.showGrayScale = function () {
        // var f = new PIXI.filters.ColorMatrixFilter();
        // gameStage.filters = [f];
        // f.greyscale(0.5, true);
    };
    this.hideShowSpeedBar = function (val) {
        speedbar.hideShow(val);
    };
    this.speedBoostLevel = function (level) {
        speedbar.update(level);
    };
    this.powerLevelChange = function (level) {
        speedbar.powerLevelChange(level);
    };

    this.setLb = function (lb) {
        this.lb = lb;
    };

    this.showKillMessage = function (msg) {
        var time = this.client.appTime;
        var txt = new PIXI.Text('' + msg, {
            fontFamily: 'Do Hyeon',
            fill: 0xff0000,
            fontSize: 28
        });
        txt.visible = true;
        txt.anchor.x = 0.5;
        txt.anchor.y = 0;
        txt.displayGroup = uiLayer;
        overlayStage.addChild(txt);
        this.shakeCam(200);
        var x = window.innerWidth / 2;
        var sy = window.innerHeight / 2 - window.innerHeight / 3;
        var ey = window.innerHeight / 2 - window.innerHeight / 8;
        txt.position.x = x;
        new TweenEngine.Tween({
                x: 1,
                y: sy
            })
            .to({
                x: 0.5,
                y: ey
            }, 4200)
            .easing(TWEEN.Easing.Sinusoidal.Out)
            .onUpdate(function () {
                txt.alpha = this.x;
                txt.position.y = this.y;
            })
            .onComplete(function () {
                overlayStage.removeChild(txt);
            })
            .start(time);



    };
    this.showOKillMessage = function (msg) {
        var time = this.client.appTime;
        var txt = new PIXI.Text('' + msg, {
            fontFamily: 'Do Hyeon',
            fill: 0x00ff00,
            fontSize: 18
        });
        txt.visible = true;
        txt.anchor.x = 0.5;
        txt.anchor.y = 0;
        txt.displayGroup = uiLayer;
        overlayStage.addChild(txt);
        var x = window.innerWidth / 2;
        var sy = window.innerHeight / 20;
        txt.position.x = x;
        txt.position.y = sy;
        new TweenEngine.Tween({
                x: 1
            })
            .to({
                x: 0
            }, 2500)
            .easing(TWEEN.Easing.Sinusoidal.Out)
            .onUpdate(function () {
                txt.alpha = this.x;
            })
            .onComplete(function () {
                overlayStage.removeChild(txt);
            })
            .start(time);
    }
    this.showError = function (txt, tint, TweenEngine, fromScale, toScale, fromY, toY) {
        console.log('showing error');
        var self = this;
        var fromScale = 1.3 || fromScale;
        var toScale = toScale || 1;
        var time = this.client.appTime;
        var fromY = fromY || 10;
        var toY = toY || window.innerHeight / 6;
        var message = this.errorTxt;
        message.text = txt;
        message.tint = tint || 0xffffff;
        message.visible = true;
        if (this.errorTween) {
            this.errorTween.stop();
            message.visible = false;
            this.errorTween = null;
        }
        message.visible = true;
        message.scale.set(fromScale, fromScale);
        this.errorTween = new TweenEngine.Tween({
                x: 1,
                y: fromY,
                z: fromScale
            })
            .to({
                x: 0,
                y: toY,
                z: toScale
            }, 3400)
            .easing(TWEEN.Easing.Sinusoidal.Out)
            .onUpdate(function () {
                message.alpha = this.x;
                message.position.y = this.y;
                message.scale.set(this.z, this.z);
            })
            .onComplete(function () {
                message.visible = false;
                message.y = 0;
                message.scale.set(1, 1);
                self.errorTween = null;
            })
            .start(time);
    };
    this.clearContainer = (function () {
        var depth = 0;
        return function (cont) {
            while (cont.children.length > 0) {
                depth++;
                this.clearContainer(cont.children[0]);
            }
            depth = 0;
            cont.parent.removeChild(cont);
            cont = undefined;
        };

    })();
    this.reset = function () {
        if (this.camera) {
            this.camera = undefined;
            this.application.stage.removeChild(camStage);
        }
    };

    this.clearPlContainers = function (cb) {
        this.clearContainer(playerStage);
        this.clearContainer(wingStage);
        gameStage.addChild(wingStage, playerStage);
        if (cb) {
            cb();
        }
    };

    this.getDebugBlock = function () {
        var wblocks = worldGridBlocks;
        var size = wblocks.length;
        var debugBlock = {
            sx: wblocks[0].startX,
            sy: wblocks[0].startY,
            dim: wblocks[0].dim,
            count: size
        };
        return debugBlock;

    };

    this.killUpdate = function (id, by, killed) {
        var pl = this.getClient().player;
        var myid = pl.id;
        var myname = pl.name;
        if (myid == id) {
            this.getClient().playDeadSound();
            this.showKillMessage('you popped ' + killed);
        } else {
            if (killed == myname) {
                this.getClient().playDeadSound();
                this.getClient().playFallSound();
            }
            this.showOKillMessage('' + by + ' popped ' + killed);
        }
    };

    this.getBackgroundStage = function () {
        return backgroundStage;
    };

    this.getOverlayStage = function () {
        return overlayStage;
    };

    this.shakeCam = function (time, int) {
        this.camera && this.camera.shake(time, int);
    };

    this.getPlayerTopLayer = function () {
        return playerGridCommonLayerTop;
    };

    this.worldSetup = function (back, restart, cb) {
        var tex = P.Resources[Conf.FILES[Conf.FILESI['' + back]]].texture;;
        window.gridSpriteLayer = gridSpriteLayer;
        width = gridEleSize * gridEleScale;
        this.blockPadding = (worldGridBlockSize - GRID_RECT_SPRITE_P_BLOCK * width) / GRID_RECT_SPRITE_P_BLOCK;
        var oneTileSize = this.blockPadding + gridEleSize * gridEleScale;
        worldBoundary = new WorldBoundary(0, 0, worldSize, oneTileSize, tex);
        speedbar = new SpeedBar();
        worldBoundary.setWorld(backgroundStage, tex, worldGridBlockSize, gridEleSize, playerGridCommonLayerBottom, gameStage, uiLayer);
        speedbar.init(overlayStage, uiLayer);
      
    };

    this.renderMenu = function (dt, shop, league) {
        return;
        if (shop) {
            shop.update(dt);
        }
        if (league) {
            league.update(dt);
        }
    };

    this.splash = function (type, x, y) {
        worldBoundary.water.splash(type, x, y);
    };
  


    this.hidePlayers = function () {
        playerStage.visible = false;
    };

    this.showPlayerStage = function () {
        this.showInGameUI();
        playerStage.visible = true;
    };

    this.showInGameUI = function () {
        speedbar.hideShow(true);
    };




    //renders the game for the client to see
    this.renderWorld = function (player, otherplayers, dt, dt2) {
        if (!this.camera || !worldBoundary) {
            return;
        }
        this.counter++;
        player.updateGraphic(dt, dt2);
        var keys = Object.keys(otherplayers);
        for (var i = 0; i < keys.length; i++) {
            otherplayers[keys[i]] && otherplayers[keys[i]].updateGraphic(dt, dt2);
        }
        worldBoundary.update(dt, player.position.x, player.position.y);
        !player.camDisable && this.camera.update(dt);
        this.application.render();
    };
};

module.exports = Renderer;