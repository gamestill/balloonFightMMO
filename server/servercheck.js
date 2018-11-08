var healthCode = '/' + (process.env.healthcode || 'app6317');

module.exports = function(app){

app.get(healthCode,function(req,res){
    res.sendStatus(200);
});

}