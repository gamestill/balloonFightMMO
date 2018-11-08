var Conf = require('./gameConf.js');
var P = require('./pixinc.js');
var MAIN_UI_Container = '.all_sections';
var MAIN_SHOP_BTN = '.mm-sett-league';
var wheel = require('./wheel.js')($);
var NO_OF_LEAGUES = 20;
var TABLE_PADDING = 20;
var ITEMS_PER_ROW = 5;
DEFAULT_LEAGUE = 3;
TEXT_V_PADDING = 35;
var maskPadding = 5;
var scrollWidth = 10;
var scrollHeight = 20;
var count = 0;
var txtstyleData = {
    fill: ['#ffffff'],
    fontSize: 14,
};
var DATA = {
    'l1': [
    ],

    'l2': [

    ],
    'l4': [
    ],
    'l5': [
    ]
};

var mapRange = function (x, a, b, c, d) {
    var y = (x - a) / (b - a) * (d - c) + c;
    return y;
};

var LeagueData = function (leagueNo, spr, ltext, text, parent, data) {
    this.sprite = spr;
    this.ltext = ltext;
    this.parent = parent;
    this.reward = null;
    this.text = text;
    this.lno = leagueNo;
    this.data = data;
    this.ltext.alpha = 0.8;
    this.eventsOn = false;
    this.getData = function () {
        return data;
    };

};
LeagueData.prototype.addEvents = function () {
    if (this.lno <= this.parent.myLeague) {
        this.eventsOn = true;
        this.addRegularEvents(this.sprite);
    } else {
        this.addHoverEvents(this.sprite);
    }
};

LeagueData.prototype.addHoverEvents = function (obj) {
    var self = this;
    obj.on('mouseover', function (mousedata) {
        console.log('mouseover');



    });
    obj.on('mouseout', function (mousedata) {
        console.log('mouseout');

    });
}

LeagueData.prototype.removeEvents = function () {
    if (this.sprite && this.eventsOn) {
        this.eventsOn = false;
        this.sprite.removeAllListeners();
    }
};


LeagueData.prototype.selectDefault = function () {
    if (this.parent.lactiveLeague) {
        this.parent.lactiveLeague.sprite.filters = [];
    }
    if (this.parent.activeLeague) {
        this.parent.activeLeague.sprite.filters = [];
    }

    this.parent.activeLeague = this;
    this.parent.lactiveLeague = this;
    if (this.parent.myLeague == this.lno) {
      //  this.sprite.filters = [new extraFilter.OutlineFilter(2, 0x00ff00)];
    } else {
    //this.sprite.filters = [new extraFilter.OutlineFilter(2, 0xff0000)];
    }
};



LeagueData.prototype.addRegularEvents = function (obj) {
    var self = this;
    if (this.parent.myLeague == this.lno) {
        obj.tint = 0x00ff00;
        self.text.tint = 0x00ff00;
        self.ltext.tint = 0x00ff00;
    } else {
        obj.tint = 0xff0000;
        self.text.tint = 0xff0000;
        self.ltext.tint = 0xff0000;
    }
    obj.on('mouseover', function (mousedata) {
        if (self.parent.activeLeague == self) {
            return;
        }
        self.ltext.alpha = 1;
        obj.buttonMode = true;

     //   self.text.filters = [new extraFilter.GlowFilter(10, 1, 1, 0xff0000, 0.1)];
        console.log(self.parent.myLeague + "," + self.lno);
        if (self.parent.myLeague == self.lno) {
  //          obj.filters = [new extraFilter.OutlineFilter(2, 0x00ff00)];
        } else {
 //           obj.filters = [new extraFilter.OutlineFilter(2, 0xff0000)];
        }
    });
    obj.on('mouseout', function (mousedata) {
        if (self.parent.activeLeague == self) {
            return;
        }
        obj.filters = [];
        self.ltext.alpha = 0.8;

        self.text.filters = [];
        obj.buttonMode = false;
    });
    obj.on('mouseup', function (mousedata) {
        if (self.parent.activeLeague == self) {
            return;
        }
        obj.filters = [];
        self.ltext.scale.x = self.ltext.scale.y = 1;
        self.text.scale.x = self.text.scale.y = 1;
    });
    obj.on('mousedown', function (mousedata) {
        if (self.parent.activeLeague == self) {
            return;
        }
        self.ltext.scale.x = self.ltext.scale.y = 1.02;
        self.text.scale.x = self.text.scale.y = 1.02;

        self.parent.lactiveLeague = self.parent.activeLeague;

        self.parent.activeLeague = self;
        if (self.parent.lactiveLeague) {
            self.parent.lactiveLeague.sprite.filters = [];
        }
        self.parent.showActiveLeague();
        if (self.parent.myLeague == self.lno) {
            obj.filters = [new extraFilter.OutlineFilter(2, 0x00ff00)];
        } else {
            obj.filters = [new extraFilter.OutlineFilter(2, 0xff0000)];
        }
    });
};


// League
var League = function (app, stage, tweenEngine, width, height) {
    $('.mm-sett-league').show();
    width = 1920;
    height = 900;
    this.myLeague = 4;
    this.myRank = 8;
    this.leagueData = [];
    this.width = width;
    this.height = height;
    this.widthby4 = width / 4;
    this.widthby2 = width / 2;
    this.widthby3 = width / 3;
    this.heightby2 = height / 2;
    this.heightby3 = height / 3;
    this.heightby4 = height / 4;
    this.catRectSize = {};
    this.tableCoord = {};
    this.leagueVisible = false;
    this.ltMask = null;
    this.leftBtn = null;
    this.rightBtn = null;
    this.TWEEN = tweenEngine;
    this.scrollTime = 0;
    this.backBtn = null;
    this.dimbackground = null;

    this.lastTime = 0;
    this.now = Date.now();
    this.scrollSpr = null;
    this.sS
    this.background = null;
    this.scrollOn = false;
    this.scrollSpeed = 0;
    this.maxy = 0;
    this.container = new P.Container();
    this.lcontainer = new P.Container();
    this.dataContainer = new P.Container();
    this.dataContainer.pivot.x = this.dataContainer.pivot.y = 0.5;
    this.container.pivot.x = this.container.pivot.y = 0.5;
    this.lcontainer.pivot.x = this.lcontainer.pivot.y = 0.5;
    stage.addChild(this.container);
    this.container.addChild(this.lcontainer, this.dataContainer);
    this.container.visible = true;
    this.lcontainer.visible = true;
    this.dataContainer.visible = true;
    this.dataContainer.displayGroup = P.Layer1;
    this.leagueTween = null;
    this.currPage = 1;
    this.delLastTweenStamp = 0;
    this.leaguePages = Math.ceil(NO_OF_LEAGUES / ITEMS_PER_ROW);
    this.scrollTweenRunning = 0;
    this.stween = null;

    this.runTween = function (options, cb, cb2) {
        var self = options[0];
        var ele = options[1];
        var from = options[2];
        var to = options[3];
        var time = options[4];
        var element = ele;
        if (!self.twRunning) {
            self.twRunning = new self.TWEEN.Tween({
                    x: from
                }) // Create a new tween that modifies 'coords'.
                .to({
                    x: to
                }, time) // Move to (300, 200) in 1 second.
                .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
                .onUpdate(function () {
                    cb(this);
                })
                .onComplete(function () {
                    self.twRunning = null;
                    cb2(self);
                })
                .start();
        }
    };

    this.setClickEvent = function (thisptr, domEle, cb) {
        $('' + domEle).off('click').on('click', function (e) {
            cb(thisptr, e);
        });
    };

    this.doLeagueShowAni = function () {
        var can = $('#canvas');
        can.show();
        var from = window.innerHeight + this.container.height / 2;
        var final = 0;
        new this.TWEEN.Tween({
                x: from
            })
            .to({
                x: final
            }, 400) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
            .onUpdate(function () {
                can.css({
                    top: this.x + 'px'
                });

            })
            .onComplete(function () {
                can.css({
                    top: '0px'
                });
            })
            .start();
    };

    this.init = function () {
        var self = this;
        // this.data = data;
        this.container.position.x = this.width / 2;
        this.container.position.y = this.height / 2;
        var all_sec_height = $(MAIN_UI_Container).outerHeight(true);
        var top = $(MAIN_UI_Container).offset().top;
        this.uiTop = top;
        var total = Number(top + all_sec_height);
        this.uiHeight = all_sec_height - all_sec_height * 0.1;


        this.setClickEvent(self, MAIN_SHOP_BTN, function (self, e) {
            e.stopPropagation();
            var ele = $(MAIN_UI_Container);
            self.leagueVisible = true;
            self.resize(window.innerWidth, window.innerHeight);
            self.container.visible = true;
            self.lcontainer.visible = true;
            self.doLeagueShowAni();
            self.addRemScrollEvent(true);
            self.showDefaultLeague();
            self.showActiveLeague();
            self.showMyLeagueHeader();

            var options = [self, ele, self.uiTop, -self.uiHeight, 600];
            self.runTween(options,
                function ($this) {
                    ele.css({
                        top: $this.x + 'px'
                    });
                    ele.css({
                        top: $this.x + 'px'
                    });
                },
                function ($this) {

                });

            self.addEvents();
        });


        var maxx = this.width / 4.5;
        var maxy = this.heightby4;
        var leave = maxx / 1.8;

        var _minC_x = -maxx - leave / 2;
        var _minC_y = -maxy;
        var _maxC_x = _minC_x + leave;
        var _maxC_y = maxy;
        var padding = 10;
        var _minI_x = -maxx + leave / 2 + padding;
        var _minI_y = -maxy;
        var _maxI_x = _minI_x + maxx - padding;
        var _maxI_y = maxy;
        this.addBackground(maxx, maxy, leave, padding);
        this.addBtns();
        this.addLabels();

        this.addLeagueTable(maxx, maxy, leave, padding);
        this.container.visible = false;
        this.greyoutControls();
    };
};

League.prototype.lactiveLeague = null;
League.prototype.activeLeague = null;
League.prototype.onOffControls = function (left, right) {
    this.leftBtn['ison431'] = left;
    this.rightBtn['ison431'] = right;
    var f;
    if (left === 0) {
        f = new PIXI.filters.ColorMatrixFilter();
        this.leftBtn.filters = [f];
        f.greyscale(0.5, true);
    } else if (left === 1) {
        this.leftBtn.filters = [];
    }
    if (right === 0) {
        f = new PIXI.filters.ColorMatrixFilter();
        this.rightBtn.filters = [f];
        f.greyscale(0.5, true);
    } else if (right === 1) {
        this.rightBtn.filters = [];
    }
};
League.prototype.showActiveLeague = function () {
    if (this.activeLeague) {
        var data = this.activeLeague.data || '';

        if (data !== '') {
            var lno = this.activeLeague.lno;
            this.showLeagueData(data, lno);
            if (this.activeLeague.lno == this.myLeague) {
                this.scrollToMyNo();
            }

        }
    }

};
League.prototype.scrollToMyNo = function () {
    var cont = this.dataContainer;
    var self = this;
    var from = cont.position.y;
    var to = Math.max(-this.maxy + this.catRectSize.mh, this.catRectSize.y - TEXT_V_PADDING * this.myRank + this.catRectSize.h);
    var dt = Math.abs(from - to) / 400;
    var time = (0.4 + Number(dt)) * 100;
    console.log(time);
    new this.TWEEN.Tween({
            x: from
        }) // Create a new tween that modifies 'coords'.
        .to({
            x: to
        }, time) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(function () {
            //   console.log( self.iContainer.pivot.x );
            cont.position.y = this.x;
            self.scrollSpr.position.y = mapRange(self.dataContainer.position.y, 0, -self.maxy + self.catRectSize.mh, self.catRectSize.y_m_inside, self.catRectSize.y_m_inside_end);

            //  cb(this);
        })
        .onComplete(function () {
            //  self.twRunning = null;
            //   cb2(self);
        })
        .start();
};

League.prototype.showDefaultLeague = function () {
    this.leagueData[this.myLeague - 1].selectDefault();
};

League.prototype.addLabels = function () {
    var currY = this.catRectSize.x + 10;
    var text = this.createText("Rank");
    text.position.x = currY;
    text.position.y = this.catRectSize.y + 10;
    currY += 85;
    var text2 = this.createText("Name");
    text2.position.x = currY;
    text2.position.y = this.catRectSize.y + 10;
    currY += 280;
    var text3 = this.createText("Souls");
    text3.position.x = currY;
    text3.position.y = this.catRectSize.y + 10;
    currY += 120;
    var text4 = this.createText("Kills");
    text4.position.x = currY;
    text4.position.y = this.catRectSize.y + 10;
    currY += 120;
    var text5 = this.createText("Top 10");
    text5.position.x = currY;
    text5.position.y = this.catRectSize.y + 10;
    text.displayGroup = text2.displayGroup = text3.displayGroup = text4.displayGroup = text5.displayGroup = P.Layer1;
    this.container.addChild(text, text2, text3, text4, text5);
};
League.prototype.createTextsBold = function (params) {
    var style = {
        fill: 0xff0000,
        fontSize: 14,
        wordWrap: true,
        fontWeight: 'bold',
        wordWrapWidth: 220

    };

    var text = null;
    var txtArr = [];
    var startY = this.catRectSize.y + 15;
    var startX = this.catRectSize.x + 17;
    for (var i = 0; i < params.length; i++) {
        text = new PIXI.Text("" + params[i], style);
        text.anchor.x = 0;
        text.anchor.y = 0;
        text.displayGroup = P.Layer1;
        text.position.x = startX;
        text.position.y = startY;
        txtArr.push(text);
    }
    return txtArr;
};
League.prototype.createTexts = function (params) {
    var style = {
        fill: 0xffffff,
        fontSize: 14,
        wordWrap: true,
        wordWrapWidth: 220

    };

    var text = null;
    var txtArr = [];
    var startY = this.catRectSize.y + 15;
    var startX = this.catRectSize.x + 17;
    for (var i = 0; i < params.length; i++) {
        text = new PIXI.Text("" + params[i], style);
        text.anchor.x = 0;
        text.anchor.y = 0;
        text.displayGroup = P.Layer1;
        text.position.x = startX;
        text.position.y = startY;
        txtArr.push(text);
    }
    return txtArr;
};

League.prototype.update = function (dt) {
    if (!this.scrollOn) {
        return;
    }
    var a = Math.abs(this.scrollSpeed);
    if (a > 0.01) {
        count += 0.3;
        this.lastTime = this.now;
        this.now = Date.now();
        var delta = this.now - this.lastTime;
        this.scrollSpeed -= this.scrollSpeed * 0.16;
        this.scrollSpr.scale.y = 1 + Math.sin(count) * 0.1;
        this.dataContainer.position.y = Math.max(-this.maxy + this.catRectSize.mh, Math.min(0, this.dataContainer.position.y + this.scrollSpeed * 0.45));
        if (!this.scrollDragOn)
            this.scrollSpr.position.y = mapRange(this.dataContainer.position.y, 0, -this.maxy + this.catRectSize.mh, this.catRectSize.y_m_inside, this.catRectSize.y_m_inside_end);


        if (a <= 0.05) {
            this.scrollSpeed = 0;
            this.scrollSpr.scale.y = 1;
            this.scrollTime = 1;
        }
    }
    if (this.scrollDragOn) {
        count += 0.3;
        this.scrollSpr.scale.y = 1 + Math.sin(count) * 0.1;
    }
};

League.prototype.mouseScrollEvent = function (scroll) {
    var dist = scroll.deltaFactor * scroll.deltaY;
    var ts = Math.min(100, Math.max(5, scroll.timeStamp - this.delLastTweenStamp));
    this.delLastTweenStamp = scroll.timeStamp;
    this.scrollTime = (2 - ts / 100);
    this.scrollSpeed = Math.min(340, Math.pow(this.scrollTime * 3.5, 2.6)) * scroll.deltaY;
};

League.prototype.addRemScrollEvent = function (val) {


}

League.prototype.showLeagueData = function (data, lno) {
    var allchild = this.dataContainer.children;
    var self = this;
    var tchild = null;
    if (allchild.length > 0) {
        while (allchild.length > 0) {
            tchild = this.dataContainer.children[this.dataContainer.children.length - 1];
            this.dataContainer.removeChild(tchild);
        }
    }

    this.dataContainer.position.x = this.dataContainer.y = 0;
    self.scrollSpr.position.y = mapRange(0, 0, -self.maxy + self.catRectSize.mh, self.catRectSize.y_m_inside, self.catRectSize.y_m_inside_end);

    var keys = Object.keys(data);
    var rank = 0;
    var name = "";
    var souls = 0;
    var kills = 0;
    var top = 0;
    var textArr = [];
    var sX = 0;
    var sy = 0;
    this.maxy = 0;
    for (var i = 0; i < keys.length; i++) {
        rank = i + 1;
        name = data[keys[i]].name;
        souls = data[keys[i]].souls;
        kills = data[keys[i]].kills;
        top = data[keys[i]].top10;
        sy += TEXT_V_PADDING;
        if (i == (this.myRank - 1) && this.myLeague == lno) {
            textArr = this.createTextsBold([rank, name, souls, kills, top]);
        } else {
            textArr = this.createTexts([rank, name, souls, kills, top]);

        }
        var ele = textArr[0];
        sX = 0;
        ele.position.x += 0;
        ele.position.y += sy;
        this.dataContainer.addChild(ele);
        ele = textArr[1];
        sX += this.tableCoord.w / 8.5;
        ele.position.x += sX;
        ele.position.y += sy;
        this.dataContainer.addChild(ele);
        ele = textArr[2];
        sX += this.tableCoord.w / 2.34;
        ele.position.x += sX;
        ele.position.y += sy;
        this.dataContainer.addChild(ele);
        ele = textArr[3];
        sX += this.tableCoord.w / 6;
        ele.position.x += sX;
        ele.position.y += sy;
        this.dataContainer.addChild(ele);
        ele = textArr[4];
        sX += this.tableCoord.w / 5.3;
        ele.position.x += sX;
        ele.position.y += sy;
        this.dataContainer.addChild(ele);
        if (sy > this.maxy) {
            this.maxy = sy;
        }
    }

    if (this.maxy < this.catRectSize.inside_height * 0.9) {
        this.scrollOn = false;
        this.sgraphicSpr.visible = false;
        this.scrollSpr.visible = false;

    } else {
        this.scrollOn = true;
        this.sgraphicSpr.visible = true;
        this.scrollSpr.visible = true;
    }
    console.log('scroll:' + this.scrollOn);

};



League.prototype.hideLeagueData = function () {

};

League.prototype.greyoutControls = function () {
    if (this.leaguePages == 1) {
        this.onOffControls(0, 0);
        return;
    }

    if (this.currPage == 1) {
        this.onOffControls(0, 1);
    } else if (this.currPage == this.leaguePages) {
        this.onOffControls(1, 0);
    } else {
        this.onOffControls(1, 1);
    }
};

League.prototype.showMyLeagueHeader = function () {
    var myPageNo = Math.min(this.leaguePages, Math.ceil(this.myLeague / 5));
    var currPage = this.currPage;
    var del = currPage - myPageNo;
    var dx = (this.tableCoord.w - this.tableCoord.w / 30) * del;
    this.currPage = myPageNo;
    this.lcontainer.position.x += dx;
    this.greyoutControls();
};

League.prototype.scrollLeague = function (dir) {
    if (this.leagueTween === null) {
        var self = this;
        dir = Number(dir) || 1;
        this.currPage = this.currPage + (1 * dir);

        if (this.currPage > this.leaguePages) {
            this.currPage = this.leaguePages;

        } else if (this.currPage < 1) {
            this.currPage = 1;

        } else {
            this.greyoutControls();
            var from = self.lcontainer.position.x;
            var to = self.lcontainer.position.x - (this.tableCoord.w - this.tableCoord.w / 30) * dir;

            this.leagueTween = new this.TWEEN.Tween({
                    x: from
                }) // Create a new tween that modifies 'coords'.
                .to({
                    x: to
                }, 400) // Move to (300, 200) in 1 second.
                .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
                .onUpdate(function () {
                    //   console.log( self.iContainer.pivot.x );
                    self.lcontainer.position.x = this.x;
                    //  cb(this);
                })
                .onComplete(function () {
                    self.leagueTween = null;
                    //  self.twRunning = null;
                    //   cb2(self);
                })
                .start();
        }
    }
};

League.prototype.dragScrollStart = function (event) {
    this.scrollSpr.buttonMode = true;
    this.scrollDragOn = true;
    console.log('drag start');
  //  this.scrollSpr.filters = [new extraFilter.GlowFilter(5, 5, 1, COLORS.CLR.ACTIVE.Back_btn, 0.1)];
    this.scrollSpr['data'] = event.data;

}
League.prototype.dragScroll = function () {
    if (!this.scrollDragOn) {
        return;
    }
    var miny = this.catRectSize.y_m_inside;
    var maxy = this.catRectSize.y_m_inside_end;
    var data = this.scrollSpr['data'];
    var np = data.getLocalPosition(this.scrollSpr.parent);
    this.scrollSpr.position.y = Math.max(miny, Math.min(maxy, np.y));
    this.dataContainer.position.y = mapRange(this.scrollSpr.position.y, this.catRectSize.y_m_inside,
        this.catRectSize.y_m_inside_end, 0, -this.maxy + this.catRectSize.mh);

};
League.prototype.dragScrollEnd = function () {
    this.scrollSpr.buttonMode = false;
    this.scrollSpr.filters = [];
    this.scrollDragOn = false;
    console.log('dragend');

}

League.prototype.mouseUp = function () {
    if (this.scrollDragOn) {
        this.scrollDragOn = false;
    }
};

League.prototype.removeEvents = function () {
    if (this.leftBtn) {
        this.leftBtn.removeAllListeners();
    }
    if (this.rightBtn) {
        this.rightBtn.removeAllListeners();
    }
    if (this.backBtn) {
        this.backBtn.removeAllListeners();
    }
    if (this.scrollSpr) {
        this.scrollSpr.removeAllListeners();
    }
    $('#canvas').unbind('mouseup');
    $('#canvas').unbind('mousewheel');
    var ldata = this.leagueData;
    for (var i = 0; i < ldata.length; i++) {
        ldata[i].removeEvents();
      //  ldata[i].addEvents();
    }
};

League.prototype.addEvents = function () {
    this.removeEvents();
    this.addEventsToBtn(this.leftBtn);
    this.addEventsToBtn(this.rightBtn);
    this.addBackEvent();
    this.addEventsToScroll(this.scrollSpr);

    console.log('scroll:::' + this.scrollOn);
    if (this.scrollOn) {
        $('#canvas').mousewheel(this.mouseScrollEvent.bind(this));
    }
};

League.prototype.addEventsToScroll = function (obj) {
    var self = this;
    $('#canvas').mouseup(function (e) {
        self.mouseUp();
    });

    obj.on('mouseover', function (mousedata) {
        obj.buttonMode = true;
    });
    obj.on('mouseout', function (mousedata) {
        obj.tint =0xffff00;
        obj.filters = [];
        obj.buttonMode = false;
    });

    obj.on('mousedown', self.dragScrollStart.bind(self));

    obj.on('touchstart', self.dragScrollStart.bind(self));
    obj.on('mouseoutside', self.dragScrollEnd.bind(self));
    obj.on('touchend', self.dragScrollEnd.bind(self));
    obj.on('mouseup', self.dragScrollEnd.bind(self));
    obj.on('touchmove', self.dragScroll.bind(self));
    obj.on('mousemove', self.dragScroll.bind(self));


};



League.prototype.addEventsToBtn = function (obj) {
    var self = this;
    obj.on('mouseover', function (mousedata) {
        if (obj['ison431'] === 0) {
            return;
        }

 //       obj.filters = [new extraFilter.GlowFilter(5, 5, 1, COLORS.CLR.HOVER.Back_btn, 0.1)];
        obj.tint = 0xff0000;
        obj.buttonMode = true;
    });
    obj.on('mouseout', function (mousedata) {
        if (obj['ison431'] === 0) {
            return;
        }
        obj.tint = 0xff0000;
        obj.filters = [];
        obj.buttonMode = false;
    });
    obj.on('mouseup', function (mousedata) {
        obj.scale.x = obj.scale.y = 0.8;
    });
    obj.on('mousedown', function (mousedata) {
        if (obj['ison431'] === 0) {
            return;
        }
        var dir = Number(obj['stype']) || 1;
        obj.tint = 0xff0000;
        obj.scale.x = obj.scale.y = 0.75;
        obj.buttonMode = true;
  //      obj.filters = [new extraFilter.GlowFilter(5, 5, 1, COLORS.CLR.ACTIVE.Back_btn, 0.1)];
        self.scrollLeague(dir);
    });
};
League.prototype.goBack = function () {
    this.leagueVisible = false;
    var from = this.container.position.y;
    var final = window.innerHeight + this.container.height / 2 + 150;
    var stage = this.container;
    var self = this;
    new this.TWEEN.Tween({
            x: from
        }) // Create a new tween that modifies 'coords'.
        .to({
            x: final
        }, 600) // Move to (300, 200) in 1 second.
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(function () {
            // cb(this);
            stage.position.y = this.x;
        })
        .onComplete(function () {
            self.container.visible = false;
            self.container.position.y = from;
            //  self.twRunning = null;
            //cb2(self);
            self.removeEvents();
        })
        .start();

    setTimeout(function () {
        self.leagueVisible = false;
        var ele = $(MAIN_UI_Container);
        var options = [self, ele, -self.uiHeight, self.uiTop, 600];
        self.runTween(options,
            function ($this) {
                ele.css({
                    top: $this.x + 'px'
                });
                ele.css({
                    top: $this.x + 'px'
                });
            },
            function ($this) {

            });
    }, 400);
};

League.prototype.addBackEvent = function () {
    var self = this;
    this.backBtn.on('mousedown', function (mousedata) {
        self.backBtn.buttonMode = true;
        self.backBtn.alpha = 1;
        self.goBack();
    });
    this.backBtn.on('mouseover', function (mousedata) {
        self.backBtn.buttonMode = true;
        self.backBtn.alpha = 1;
    });
    this.backBtn.on('mouseout', function (mousedata) {
        self.backBtn.alpha = 0.8;
        self.backBtn.buttonMode = false;
    });
};
League.prototype.addLeagueTable = function (sx, sy, leave, padding) {
    this.lcontainer.displayGroup = P.Layer1;
    this.ltMask = new P.Graphics();
    this.ltMask.beginFill(0x111111, 0.1);
    this.ltMask.pivot.x = this.ltMask.pivot.y = 0.5;
    this.ltMask.drawRect(this.tableCoord.x + this.tableCoord.w / 50, this.tableCoord.y - this.tableCoord.h / 10, this.tableCoord.w - this.tableCoord.w / 25, this.tableCoord.h);
    this.ltMask.endFill();
    this.ltMask.displayGroup = P.Layer2;
    this.container.addChild(this.ltMask);
    this.lcontainer.mask = this.ltMask;
    var padding = this.tableCoord.w / 30;
    var remWidth = this.tableCoord.w - padding * (ITEMS_PER_ROW + 1);
    var itemWidth = remWidth / 5;
    var text;
    var leagueText;
    var graphic;
    var reward;
    var txtstyle = {
        fill: ['#ffffff', '#bbb', '#ffffff'],
        fillGradientStops: [0.35, 0.5, 0.65],
        fontSize: 50,
        fillGradientType: 0,
        stroke: ['#eeaaaa'],
        strokeThickness: 4,
    };

    var txtstyleleague = {
        fill: ['#ffffff'],
        fontSize: 16,
    };


    for (var i = 0; i < NO_OF_LEAGUES; i++) {
        var leagueNo = 'l' + (i + 1);
        graphic = new P.Graphics();
        graphic.displayGroup = P.Layer1;
        graphic.pivot.x = graphic.pivot.y = 0.5;
        graphic.beginFill(0x111111, 0.2);
        graphic.lineStyle(3, 0xffffff, 0.9);
        graphic.drawRoundedRect(0, 0, itemWidth, this.tableCoord.h - 20, 20);
        graphic.hitArea = new PIXI.Rectangle(0, 0, itemWidth, this.tableCoord.h - 20);
        graphic.interactive = true;
        graphic.endFill();
        text = new PIXI.Text('' + (i + 1), txtstyle);
        leagueText = new PIXI.Text("League", txtstyleleague);
        text.anchor.x = 0.5;
        text.anchor.y = 0;
        leagueText.anchor.x = 0.5;
        leagueText.anchor.y = 0.5;

        text.position.x = this.tableCoord.x + i * itemWidth + (i + 1) * padding + itemWidth / 2;
        text.position.y = this.tableCoord.y + (this.tableCoord.h - 20) / 2 - text.height / 2 + text.height / 5;
        leagueText.position.x = this.tableCoord.x + i * itemWidth + (i + 1) * padding + itemWidth / 2;
        leagueText.position.y = text.position.y - leagueText.height / 2;


        var spr = new PIXI.Sprite(graphic.generateCanvasTexture());
        leagueText.displayGroup = text.displayGroup = P.Layer1;
        spr.interactive = true;
        spr.position.x = this.tableCoord.x + i * itemWidth + (i + 1) * padding;
        spr.position.y = this.tableCoord.y;
        spr.alpha = 0.8;
        spr.anchor.x = spr.anchor.y = 0;
        this.lcontainer.addChild(spr);
        this.lcontainer.addChild(text, leagueText);
        var temp = new LeagueData(i + 1, spr, leagueText, text, this, DATA[leagueNo]);
        this.leagueData.push(temp);
    }

};
League.prototype.createText = function (tex) {
    var style = {
        stroke: 0xeeeee,
        strokeThickness: 1,
        fill: 0xdddddd,
        fontSize: 18
    };

    var text = new PIXI.Text("" + tex, style);
    text.anchor.x = 0;
    text.anchor.y = 0;
    return text;
};

League.prototype.resize = function (neww, newh) {

    this.container.position.x = neww / 2;
    var r = -(this.tableCoord.y - this.tableCoord.h / 10);
    this.container.position.y = Math.max(r, newh / 2);

};

League.prototype.addBtns = function () {

    var backbtn = P.Resources[Conf.FILES[Conf.FILESI.backbtn]].texture;
    this.leftBtn = new P.Sprite(backbtn);
    this.rightBtn = new P.Sprite(backbtn);

    this.rightBtn.anchor.x = this.leftBtn.anchor.x = 0.5;
    this.rightBtn.anchor.y = this.leftBtn.anchor.y = 0.5;
    this.rightBtn.tint = this.leftBtn.tint = 0xdd0000;
    this.leftBtn.x = this.catRectSize.x;
    this.rightBtn.rotation = Math.PI;

    this.rightBtn.x = this.catRectSize.x + this.catRectSize.w;
    this.rightBtn.y = this.leftBtn.y = this.catRectSize.ty;

    this.tableCoord = {
        x: this.catRectSize.x + this.rightBtn.width + TABLE_PADDING,
        y: this.catRectSize.ty - this.catRectSize.h / 7 + 10,
        w: this.catRectSize.w - 2 * TABLE_PADDING - 2 * this.rightBtn.width,
        h: this.catRectSize.h / 3.1
    };
    this.leftBtn.displayGroup = this.rightBtn.displayGroup = P.Layer1;
    this.rightBtn.interactive = this.leftBtn.interactive = true;
    this.leftBtn.scale.x = this.leftBtn.scale.y = this.rightBtn.scale.x = this.rightBtn.scale.y = 0.8;
    this.leftBtn['stype'] = -1;
    this.rightBtn['stype'] = 1;
    this.container.addChild(this.leftBtn, this.rightBtn);
}

League.prototype.selectMyLeague = function () {

};


League.prototype.addBackground = function (sx, sy, leave, padding) {
    this.container.displayGroup = P.Layer1;
    var scroller = new P.Graphics();
    var sgraphic = new P.Graphics();
    scroller.displayGroup = P.Layer1;
    sgraphic.displayGroup = P.Layer1;
    sgraphic.pivot.x = sgraphic.pivot.y = 0;

    scroller.pivot.x = scroller.pivot.y = 0;


    scroller.beginFill(0xff0000, 1);
    scroller.lineStyle(2, 0xaa0000, 1);
    scroller.drawRoundedRect(0, 0, scrollWidth, scrollHeight, 20);
    this.scrollSpr = new PIXI.Sprite(scroller.generateCanvasTexture());
    this.scrollSpr.anchor.x = this.scrollSpr.anchor.y = 0;


    var maskBackground = new P.Graphics();
    this.backBtn = new PIXI.Text("Back", {
        stroke: 0x000000,
        strokeThickness: 2,
        fill: 0xff0000,
        fontSize: 17
    });

    this.backBtn.anchor.x = 0.5;
    this.backBtn.anchor.y = 0;
    this.backBtn.alpha = 0.8;
    this.backBtn.interactive = true;
    this.dimbackground = new P.Graphics();

    this.background = new P.Graphics();
    var background = this.background;
    background.beginFill(COLORS.CLR.NORM.BACKGROUND, COLORS.ALPHA.NORM.BACKGROUND);
    background.lineStyle(COLORS.CLR.NORM.BACKGROUND_THICKNESS, COLORS.CLR.NORM.BACKGROUND_LINE, COLORS.ALPHA.NORM.BACKGROUND_LINE);

    var height = sy * 2;
    var width = sx * 2;
    var mainRectTopYShift = height / 14;
    var mainRectHeaderHeight = height / 12;

    var leaguesContGap = height / 5;
    var mainContHeightShift = height / 10;

    this.catRectSize = {
        x: -sx,
        y: -sy + mainRectTopYShift,
        w: width,
        h: height - mainContHeightShift,
        ty: -sy - leaguesContGap,
        y_m_inside: -sy + mainRectTopYShift + mainRectHeaderHeight + 1,
        x_m_last_inside: -sx + width - scrollWidth - 10,
        inside_height: height - mainContHeightShift - mainRectHeaderHeight - scrollHeight,
        y_m_inside_end: -sy + mainRectTopYShift + height - mainContHeightShift - scrollHeight - 3,
        mh: height - mainContHeightShift - mainRectHeaderHeight - maskPadding * 2
    };

    sgraphic.beginFill(0x333333, 1);
    sgraphic.drawRect(0, 0, 2, this.catRectSize.inside_height + scrollHeight / 2);
    sgraphic.endFill();
    this.sgraphicSpr = new PIXI.Sprite(sgraphic.generateCanvasTexture());
    this.sgraphicSpr.anchor.x = this.sgraphicSpr.anchor.y = 0;
    this.sgraphicSpr.position.x = this.catRectSize.x_m_last_inside + scrollWidth / 2;
    this.sgraphicSpr.position.y = this.catRectSize.y_m_inside;
    this.scrollSpr.position.x = this.catRectSize.x_m_last_inside;
    this.scrollSpr.position.y = this.catRectSize.y_m_inside;

    this.backBtn.y = this.catRectSize.y + this.catRectSize.h + 2;
    this.backBtn.x = this.catRectSize.x + this.catRectSize.w / 2;
    maskBackground.beginFill(0x111111, 0.2);
    maskBackground.drawRect(this.catRectSize.x + maskPadding, mainRectHeaderHeight + this.catRectSize.y + maskPadding, width - maskPadding * 2, this.catRectSize.mh);
    maskBackground.endFill();
    maskBackground.displayGroup = P.Layer2;
    background.beginFill(0x666666, 0);
    background.drawRoundedRect(this.catRectSize.x, this.catRectSize.y, width, this.catRectSize.h, 10);
    background.endFill();
    this.dimbackground.beginFill(0xee3300, 1);
    this.dimbackground.lineStyle(1, 0xaa0000, 1);
    this.dimbackground.drawRect(this.catRectSize.x, this.catRectSize.y, this.catRectSize.w, this.catRectSize.h / 12);
    this.dimbackground.displayGroup = P.Layer3;
    this.dimbackground.endFill();
    background.displayGroup = P.Layer1;
    this.container.addChild(background);
    this.container.addChild(this.dimbackground);
    this.container.addChild(this.backBtn, maskBackground, this.sgraphicSpr, this.scrollSpr);
    this.backBtn.displayGroup = P.Layer1;
    var co = this.container.children;

    for (var i = 0; i < co.length; i++) {
        co[i].visible = true;
    }
    this.scrollSpr.interactive = true;

    this.dataContainer.mask = maskBackground;
};


League.prototype.showLeague = function (leagueData) {
    console.log('showing leahuges');
    // this.mainshop_c.position.x = this.width / 2;
    // this.mainshop_c.position.y = this.height / 2;
};

module.exports = League;