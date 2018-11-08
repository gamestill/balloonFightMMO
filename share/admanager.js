var singleAdHeight = 0;
var gameAdsCount = 0;
var currentAd = 0;

function repeatFnGen(callback, time, $this) {
    var timer;
    var timerTime = time;

    window = window || '';
    if (window === '') {
        return;
    }
    return function () {
        timer = window.setInterval(function () {
            callback(timer, $this);
        }, timerTime);
    };
}

function setGameAds_UI() {
    var totalHeight = 0;
    var count = 0;
    $('.last_sec_ad ul').children().each(function () {
        count++;
        totalHeight = totalHeight + $(this).outerWidth(true);
    });
    $('.last_sec_ad ul').css('width', totalHeight + 'px');
    gameAdsCount = count;
    singleAdHeight = Math.floor(totalHeight / count);
    return singleAdHeight;
}

var AdManager = function(app,tween,repeattime){
    this.app = app;
    this.adHeight = 0;
    this.time = 500;
    this.repeatTime = repeattime;
    this.tw = tween;
    this.tweenCache = null;
    this.twRunning = false;
    this.element =  $('.all_sections .last_sec_ad ul');

    this.init = function(adsData){
        adsData = adsData || '';
        if(adsData===''){
            return;
        }
        var $this = this;
        var gameAds_main = {
            gameAds: []
        };
        var gameAdsData = adsData;
        var gameAds = Soulcrashers.Templates.gameads;
        for (var i = 0; i < gameAdsData.length; i++) {
            gameAds_main.gameAds.push({
                url: gameAdsData[i].url,
                link: gameAdsData[i].link,
            });
        }

        $('.last_sec_ad').html(gameAds(gameAds_main));
        this.element =  $('.all_sections .last_sec_ad ul');
      this.adHeight =  setGameAds_UI();
        repeatFnGen(this.adReplacUI_Update,  this.repeatTime, $this)();
    };

    this.adTween = function(ulMargin){
        var self = this;
        var initialMargin = parseInt(self.element.css('marginLeft'));

        if(ulMargin){
            // this.tweenCache  =   new self.tw.Tween({
            //     x: initialMargin
            // }) 
            // .to({
            //     x: (ulMargin + initialMargin)
            // }, self.time) // Move to (300, 200) in 1 second.
            // .easing(self.tw.Easing.Back.Out) // Use an easing function to make the animation smooth.
            // .onUpdate(function () {
            //     self.element.css({marginLeft:(this.x+ 'px')}) 
            // })
            // .start();
        }else{
            // this.tweenCache  =   new self.tw.Tween({
            //     x: initialMargin
            // }) 
            // .to({
            //     x: (initialMargin - self.adHeight)
            // }, self.time) // Move to (300, 200) in 1 second.
            // .easing(self.tw.Easing.Back.Out) // Use an easing function to make the animation smooth.
            // .onUpdate(function () {
            //     self.element.css({marginLeft:(this.x+ 'px')});
            // })
            // .start();
        }
    };

    this.replaceGameAd = function () {
        currentAd++;
        var baseTime = 300;
        if (currentAd > (gameAdsCount - 1)) {
            currentAd = 0;
            var ntime = gameAdsCount * baseTime / 2;
            var mm = Math.abs(parseInt($('.all_sections .last_sec_ad ul').css('margin-left')));
            this.adTween(mm);
        }
        else{
            this.adTween();
        }
    };

    this.adReplacUI_Update = function (timer, $this) {
        $this.replaceGameAd($this);
    };
};

module.exports = AdManager;