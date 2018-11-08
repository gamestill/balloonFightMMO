// Keyboard class


var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Conf = require('./gameConf.js');

var Keyboard = function (app,del) {
    EventEmitter.call(this);
    var click_poll_rate = Conf.MOUSE_CLICK_POLL_TIME;
    this.CTRL = '17';
    this.SHIFT = '16';
    this.TILDA = '192';
    this.app = app;
    this.wx = window.innerWidth;
    this.wy = window.innerHeight;
    this.Q = '81';
    this.SPACE = '32';
    this._ONE = '66';
    this._A = '65';
    this._D = '68'
    this._W = '87'
    this._S = '83';
    this._1 = '49';
    this._2 = '50';
    this.up = '38';
    this.down = '40';
    this.left = '37';
    this.right = '39';
    this.ENTER = '13';
    this._BKEY = '78';
    this.press = "pressed";
    this.ctrlDown = false;
    this.tildaDown = false;
    this.qDown = false;
    this.devConsoleON = false;
    var windowSizeDiff = del;
    var view = null;
    var last_X = 0;
    var last_Y = 0;
    var mdInt;
    var _x = 0;
    var _y = 0;
    var _debug = false;
    var clientRect;
    var m_l_down = false;
    var m_r_down = false;
    this.lastMouseDown = Date.now();

    this.mousedown_EVENT = (function (btn) {
        //left click
        if (btn === 1) {
            this.emit("m:lc", {
                x: _x,
                y: _y,
                o: true
            });
        } else if (btn === 3) {
            this.emit("m:rc", {
                x: _x,
                y: _y,
                o: true
            });
        }


    }).bind(this);

    this.removeEvents = function () {
        this.removeAllListeners();
    };

    this.mouseScrollEvent = function(scroll){
        scroll = scroll.deltaY;
        var scr = -1;
        if(scroll>0){
            scr = 1;
        }
        this.emit('k:scr',scr);
    };

    this.mouseup_EVENT = (function (btn) {
        //left click
        if (btn === 1) {
            this.emit("m:lc_", {
                x: _x,
                y: _y,
                o: false
            });
        } else if (btn === 3) {
            this.emit("m:rc_", {
                x: _x,
                y: _y,
                o: false
            });
        }


    }).bind(this);

    this.updateWindowSizes = function (del) {
        windowSizeDiff = del;
        clientRect = view.getBoundingClientRect();
     };

    this.mouseDown = function (mouse) {
        var $this = this;
        var currMouseDown = Date.now();
        var deltaMouseDown = currMouseDown - this.lastMouseDown;
        var btn = Number(mouse.which);
        if (btn === 1) {
            m_l_down = true;
            if (deltaMouseDown > click_poll_rate) {
                this.mousedown_EVENT(btn);
                this.lastMouseDown = currMouseDown;
            }
        } else if (btn === 3 && !m_l_down) {
            m_r_down = true;
            this.mousedown_EVENT(btn);
        }
    };

    this.mouseUp = function (mouse) {
   
        var btn = Number(mouse.which);
        if (m_l_down) {
            m_l_down = false;

            this.mouseup_EVENT(btn);

        } else if (m_r_down) {
            m_r_down = false;
            this.mouseup_EVENT(btn);
        }
    };
    this.mouseDownInitial = function(){
     
    }
    this.mouseMoveInitial = function(){
     
    }
    this.mouseUpInitial = function(){
       
    }
    this.mouseMove = function (mouse) {   
        _x = Math.floor(((mouse.clientX - clientRect.left) / (clientRect.right - clientRect.left)) *this.wx);
        _y = Math.floor(((mouse.clientY - clientRect.top) / (clientRect.bottom - clientRect.top)) * this.wy);
        if (_x !== last_X && _y !== last_Y) {
            this.emit("mouseMove", {
                x: _x,
                y: _y
            });
        }
        last_X = _x;
        last_Y = _y;
    };

    this.debug = function () {
        return _debug;
    };

    this.setKeyEvents = function (deb) {
        _debug = deb;
    };

    this.toggleDevConsole = function () {
        if (this.devConsoleON) {
            console.log('hide console');
        } else {
            console.log('show console');
        }
        this.devConsoleON = !this.devConsoleON;
    };
    this.kill = function(){
        console.log('killing keyboard');
        
        window.removeEventListener('mousedown',this.mouseDownInitial.bind(this),true);
        window.removeEventListener('mouseup',this.mouseUpInitial.bind(this),true);
        window.removeEventListener('mousemove',this.mouseMoveInitial.bind(this),true);

        window.removeEventListener('mousedown',this.mouseDown.bind(this),true);
        window.removeEventListener('mousemove',this.mouseMove.bind(this), true);
        window.removeEventListener('mouseup', this.mouseUp.bind(this), true);
        if(view){
            view.removeEventListener('mousemove',this.mouseMove.bind(this), true);   
        }
        this.removeAllListeners();
    };
    this.setMouseEvents = function (scrollcallback) {
        if (window !== undefined || window !== null) {
            view = view || window.document.getElementById('canvas');
            clientRect = view.getBoundingClientRect();
            if (view !== null) {
                window.removeEventListener('mousedown',this.mouseDownInitial.bind(this),true);
                window.removeEventListener('mouseup',this.mouseUpInitial.bind(this),true);
                window.removeEventListener('mousemove',this.mouseMoveInitial.bind(this),true);

                window.removeEventListener('mousedown',this.mouseDown.bind(this),true);
                window.removeEventListener('mousemove',this.mouseMove.bind(this), true);
                view.removeEventListener('mousemove',this.mouseMove.bind(this), true);   
                window.removeEventListener('mouseup', this.mouseUp.bind(this), true);

                window.addEventListener('mousedown', this.mouseDown.bind(this), true);
                view.addEventListener('mousemove', this.mouseMove.bind(this), true);
                window.addEventListener('mouseup', this.mouseUp.bind(this), true);

                $('#canvas').unbind('mousewheel');
                $('#canvas').mousewheel(this.mouseScrollEvent.bind(this));
            }
        }
    };

    (function ($this) {
        if (window !== null || window !== undefined){
            document.onkeydown = $this._onKeyDown.bind($this);
            document.onkeyup = $this._onKeyUp.bind($this);
            window.addEventListener('mousedown', $this.mouseDownInitial.bind($this), true);
            window.addEventListener('mousemove', $this.mouseMoveInitial.bind($this), true);
            window.addEventListener('mouseup', $this.mouseUpInitial.bind($this), true);
        }
    })(this);
};

util.inherits(Keyboard, EventEmitter);

Keyboard.prototype._onKeyDown = function (key) {
    key = key || window.event;
   if (key.keyCode === 69) {
        this.emit('k:ed');
    }
    if (key.keyCode == this.SPACE) {
        this.emit("k:space");
    }
    if (key.keyCode == this.left) {
        this.emit('k:left');
    }
    if (key.keyCode == this.right) {
        this.emit('k:right');
    }
    if (key.keyCode == this.up) {
        this.emit('k:up');
    }
    if (key.keyCode == this.CTRL) {
        this.emit("k:ctrl");
    }

    if (key.keyCode == this.SHIFT) {
        this.emit("k:ctrl");
    }
    if (key.keyCode == this._A) {
        this.emit('k:a');
    }
    if (key.keyCode == this._D) {
        this.emit('k:d');
    }
    if (key.keyCode == this._W) {
        this.emit('k:w');
    }
    // if (key.keyCode == this._S) {
    //     this.emit('k:s');
    // }
};

Keyboard.prototype._onKeyUp = function (key) {
 
    if (key.keyCode == this.ENTER) {
        this.emit('k:ret');
    }
    var numKey = 0;
    if(key.keyCode>=49 && key.keyCode<=57){
        numKey = +(key.keyCode - 48);
        this.emit('k:' + numKey,numKey);
    }
    if (key.keyCode == this.TILDA) {
        this.tildaDown = false;
        this.emit('debug');
    }
    if (key.keyCode == this.left) {
        this.emit('k:left_');
    }
    if (key.keyCode == this.up) {
        this.emit('k:up_');
    }
    // if (key.keyCode == this.down) {
    //     this.emit('k:down_');
    // }
    if (key.keyCode == this._A) {
        this.emit('k:a_');
    }
    if (key.keyCode == this._D) {
        this.emit('k:d_');
    }
    if (key.keyCode == this._W) {
        this.emit('k:w_');
    }
    // if (key.keyCode == this._S) {
    //     this.emit('k:s_');
    // }
    if (key.keyCode == this.right) {
        this.emit('k:right_');
    }
    else if (key.keyCode == 90) {
        this.emit('k:tab');
    }
    if (key.keyCode == this._BKEY) {
        this.emit("k:bt");
    }
    if (key.keyCode == this.SPACE) {
        this.emit("k:space_");
    }
    if (key.keyCode == this.CTRL) {
        this.emit("ctrl_");
    }
    if(key.keyCode == this._A){
        this.emit('bot');
    }
    key.preventDefault();
};

module.exports = Keyboard;