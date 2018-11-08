var SoundManager = function(){
    this.m1_id = 0;
    this.m2_id = 0;
    this.m3_id = 0;
    

    this.init = function(){
        this.music1 = new Howl({
            src:['music/1.mp3'],
            loop: true,
            volume:0.5
        });
      
        this.sound = new Howl({
            src: ['sounds/audio.mp3'],
            volume: 0.7,
            sprite:{
                eat:[0,350],
                fanfare:[2383,580],
                fly:[655,320],
                fall:[1038,1230],
                collide:[336,305],
                portal:[2960,1150]
            }
          });
          
    };
    this.changeMusicRate = function(rate){
        this.music1.rate(rate, this.m1_id);
        if(rate>1){
            this.music1.volume(0.5);
        }else{
            this.music1.volume(0.3);     
        }

    };
    this.playMusic = function(val){
        if(this.music1.playing()){
            return;
        }
        if(val == 1){
          this.m1_id =  this.music1.play();
        }
    };
    this.mute = function(val){
        this.sound.mute(val);
    };
    this.playSoundBoost = function(id){
        this.sound.play(id); 
    };
    this.playSoundFly = function(id){
        this.sound.play(id);
    };
    this.playSoundRobot = function(id){
        this.sound.play(id);
    };

    this.muteMusic = function(){
        this.music1.mute(true);
        
    };
    this.unMuteMusic = function(){
        this.music1.mute(false);
        
    };
    this.playSoundCollide = function(id){
            this.sound.play(id); 
    };

    this.playSoundEat = function(id){
            this.sound.play(id);
        
        
    };
    this.init();
};

module.exports = SoundManager;