////////////////////////////////////////////////
//s.bp = server base packet
//avd = avatar data
//t.k = token
//smc = mode changed
//C203 ::settings
//S204:: client region left
//C255: window resize
//355 region update
//800 world dot data
//C311 enable collision 

//*************** testing packets begin 2000+ *******************************************
//C_PK2100 temporary dead testing

//C_PK91 left mouse down
// C_PK92 right mouse down
//C_PK99 mouse move
//S_PK24 my socket data to others
// S_PK23 other players socket data
// S_PK1K servr ready
//C_PK500 game start


// h0 player colors packet 
//h1 other player colors packet
//g  add player to server

module.exports = [
     'a',  // first packet
     'p', // ping packet

    // S_BP: 's.bp',
    // S_PK1: 's.pk1',
    // S_PK101:'s.1',
    // S_OPEN: 'open',
    // S_MT:'m',
    // S_SMC: 's.smc',
    // S_PK678:'s.d1',
    // S_PK677:'s.d0',
    // S_PK691:'s.c1',
    // S_PK400: 's.error',
    // S_PK204: 's.rlf',
    // S_PK23: 's.opsd',
    // S_PK24: 's.msdto',
    // S_PK800: 's.wdd',
    // S_PK801: 's.wd',
    // S_PK83:'s.8',
    // S_PK1K: 's.rd',
    // S_PK355: 's.ru',
    // INC_PING: 'incoming::ping',
    // S_PK_STR: 's.store',
    // S_PK_CURR: 's.curr',
    // S_KK:'s.kk',
    // S_PK374: 's.b',
    // S_OPEN: 'open',
    // S_PK999: 's.dd',
    // C_PK203: 'c.sett',
    // C_PK1: 'c.pk1',
    // C_PK202: 'c.fbname',
    // C_PK204: 'c.nreg',
    // C_PK255: 'c.wr',
    // C_PK355: 'c.ru',
    // C_PK101:'c.1',
    // C_P0: 'c.0',
    // C_P888: 'c.2',
    // C_PK1K: 'c.rd',
    // C_777:'c.t',
    // C_PK900: 'c.rfd',
    // C_PK311: 'c.co',
    // C_PK2100: 'c.tdead',
    // C_4011:'c.bt',
    // C_PK91: 'c.md',
    // C_PK406: 'c.to',
    // C_PK92: 'c.rmd',
    // C_PK99: 'c.mm',
    // C_PK500: 'c.gs',
  
    // C_PK51: 'c.pn',

    // C_KK:'c.kk',

];