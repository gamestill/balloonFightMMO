var Logger = require('../lib/Logger.js');
var fs = require("fs");
var os = require('os');
var fileNameBadWords = "./server/conf/badwords.txt";
var fileNameBotNames = "./server/conf/botnames.txt";
var BadWordManager = function(){
    this.badWords =[];
    this.botNames = [];
    this.loadFile = function(name,cont,cb){
        try {
            if (!fs.existsSync(name)) {
                Logger.warn(name + " not found");
            } else {
                var words = fs.readFileSync(name, 'utf-8');
                words = words.split(/[\r\n]+/);
                words = words.map(function (arg) { return arg.trim().toLowerCase(); });
                words = words.filter(function (arg) { return !!arg; });
               cont = words;
                Logger.info(cont.length + " bad words loaded");

                cb(cont);
            }
        } catch (err) {
            Logger.error(err.stack);
            Logger.error("Failed to load " + name + ": " + err.message);
            cb();
        }
    }
    this.loadBadWords_botnames = function (cb) { 
        var self = this;
        this.loadFile(fileNameBadWords,this.badWords,function(data){
            if(data && data.length>0){
                self.loadFile(fileNameBotNames,this.botNames,function(botData){
                    if(data && data.length>0){
                        cb(data,botData);
                    }else{
                        Logger.error("No Data found in file " + fileNameBotNames);
                    }
                });
            }
            else{
                Logger.error("No Data found in file " + fileNameBadWords);
            }
        });
    };

}

module.exports = BadWordManager;

