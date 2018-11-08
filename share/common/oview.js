var Oview = function (renderer) {
    var fps_text;
    var latency_text;
    var alatency_text;
    this.container = new PIXI.Container();
    this.container.pivot.y = 0.5;
    this.container.pivot.x = 1;
    this.update;
    this.FPS_STATE = function (val) {
        var setVal = false;
        if(val==1){
            setVal = true;
        }
        if (fps_text && setVal) {
            fps_text.visible = setVal;
            this.update = this.updateFn;
        } else {
            fps_text.visible = false;
            this.update = this.updateEmpty;
        }
    };



    this.showHideLat = function(val){
        alatency_text.visible = latency_text.visible  = val;
    }
    this.updateEmpty = function () {};
    this.updateFn = function (fps,lat,alat) {
        fps = Math.round(fps * 10) / 10;
        latency_text.text= "Avg. Latency : " + alat + " ms";
        alatency_text.text = "Latency : " +  Math.floor(lat) + ' ms';
        fps_text.text = "FPS : " + fps;
        if(alat>=300){
            alatency_text.tint = 0xff0000;
        }else if(alat>=150){
            alatency_text.tint = 0xffff00;
        }else{
            alatency_text.tint = 0x00ff00;
        }

        if(lat>=300){
            latency_text.tint = 0xff0000;
        }else if(lat>=150){
            latency_text.tint = 0xffff00;
        }else{
            latency_text.tint = 0x00ff00;
        }
    };
    this.init = function (rend) {
        var overlay = rend.getOverlayStage();
        var layer = rend.getUILayer();
       overlay.addChild(this.container);
        this.update = this.updateFn;
        var winHeight = window.innerHeight;
        var winWidth = window.innerWidth;
        fps_text = new PIXI.Text("FPS : MAX", {
            stroke: 0x000000,
            strokeThickness: 3,
            fill: 0x00ff00,
            fontSize: 14,
            fontWeight: 'bold'
        });
        latency_text = new PIXI.Text("Latency:0", {
            stroke: 0x000000,
            strokeThickness: 3,
            fill: 0xffffff,
            fontSize: 14
        });
        alatency_text = new PIXI.Text("Avg Latency:0", {
            stroke: 0x000000,
            strokeThickness: 3,
            fill: 0xffffff,
            fontSize: 14
        });
        alatency_text.anchor.x = alatency_text.anchor.y =   latency_text.anchor.x = latency_text.anchor.y = fps_text.anchor.x = fps_text.anchor.y = 0;
        alatency_text.x = latency_text.x = fps_text.x = 5;
        fps_text.y = 5;
        latency_text.y = fps_text.y + fps_text.height;
        alatency_text.y = latency_text.y + latency_text.height;
        alatency_text.alpha = 0.6;
        latency_text.alpha = 0.6;
        fps_text.alpha = 0.8;
        this.container.addChild(fps_text,latency_text,alatency_text);
        fps_text.displayGroup =latency_text.displayGroup =alatency_text.displayGroup = layer;
        this.showHideLat(false);
    }

    this.init(renderer);

};

module.exports = Oview;