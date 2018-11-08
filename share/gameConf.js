

var GameConf = {
    // new
    CAM_DEFAULT_ZOOM:1,
    TIME_GAP_BETWEEN_COMP:1,
    MIN_MASS_FOR_HELPER:1,
    MASS_TO_WEIGHT:0.0002,
    CAM_MAX_ZOOM: 1,
    BOUNDARY_SIZE:20,
    SKIN_HIGH : 512,
    SKIN_LOW :102,
    SKINS_DATA : [],
    BALLOON_SCALE_RATIO:20000,
    DEFAULT_NAME:'name',
    DOUBLE_MODE_TIME:60,
    POP_MATCH_INVALID_TIME:56565,
    INPUT_LOOP_TIME:100,
    SLOW_LOOP_TIME:1000,
    LOGO_ANI_TIME:300,
    FOOD_CONT_COUNT:24,
    MAX_FOOD_PER_CONTAINER:50,
    PRADIUS:25,
    lasttimename:'lasttimename',
    LOW_FOOD_RAD:9,
    START_BLADES:3,
    BABY_WING_LEN_COUNT:0,
    MAX_WINGS:0,
    WING_LEN_FOR_COOL_WINGS:0,
    FOOD_TINT:{
        '0': 0xff4848,
        '1':0x00ffe4,
        '2':0xff7d14,
        '3':0xffb912,
        '4':0xd6ff15,
        '5':0x93ff14,
        '6':0x14ff88,
        '7':0x15ffdb,
        '8':0x15a4ff,
        '9':0xff1bcc,
        '10':0xff4f85,

    },
    QUALITY:{
        'ugly':'ugly',
        'low':'low',
        'medium':'medium',
        'high':'high',
    },
    INPUT_REC_LOOP_TIME:30,
    GAME_VER : "0.1",
    GAME_STAGE : "Alpha",
    TIP_INTERVAL: 3000,
    LAT_SIZE:50,
    BOUND_BACK_COLOR:0x110000,
    BOUND_COLOR:0xff00000 ,
    BOUND_SCALAR:8000,
    BOUND_THICK:12,
    MAX_SNAPSHOTS:4,
    LOOP_RATE:0,
    INTERP_TIME:100,
    // new
    NOTHING_MSG : "Nothing Here",
    AD_DATA : [],
    FEAT:0,
    WaterHeight:300,
    RAND: 0,
    NV_COLOR:0x0000ff,
    DEFAULT_XP_MAX:100,
    HEALTH_EFF_DEL_COUNT: 10,
    FILES: [],
    CLIENT_MODE: "development",
    SKIN_DETAILS: [],
    FILESI: {},
    DOT_FILES: [],
    DOT_CLRS: {},
    MAX_NAME_LEN: 20,
    DOTS_CACHE_COUNT: 200,
    GRID_SPR_TIMEOUT: 60000,
    MOUSE_CLICK_POLL_TIME: 0,
    START_RAD: 80,
    RAD_MASS_R: 3,
    cUpgrade_w:20,
    cUpgrade_b:40,
    DEL_SCALE_EAT: 0.001,
    GRID_SPR_BASE_CLR: '0x332222',
    GRID_SPR_BASE_CLR_L: '0x555555',
    GRID_SPR_BASE_CLR_D: '0x111111',
    MAP_FACE_VALUE : 10,
    P_I_SC: 0.3,
    DOT_DIST_HIDE_COLL: 2700,
    DOT_SCALE_DELTA_COLL_PERUPDATE: 0.05,
    P_I_SKIN: 0.4,
    BULL_SCALE: 1.0,
    worldSize: 0,
    SERVER_BLOCKS_COUNT:20,
    LEADERBOARD_MAX:0,
    GRID_SIZE_1D: 0,
    GRID_SIZE_1D: 0,
    P_O_T: 0x0022dd,
    P_O_A: 0.3,
    P_A: 0.5,
    ZERO_5: 0.5,
    DEF_MODE: "",
    DO_SC: 0.03,
 
    DO_A: 0.04,
    DO_SP: 4,
    BO_LA: 1,
    BO_CL: 0x991111,
    BO_A: 0.6,
    UNTITLED_NAME: "UNKNOWN GAMER",
    BO_SC: 0.0002,
    BO_LW: 5,
    BO_SZ: 4000,
    BO_LC: 0xFF0000,
    DOT_GAP: 100,
    DISCONNECT_TIME: 40000,
    CHOICES_TIME :5,
    Debug:false,
    STATE:{
        'ON':1,
        'OFF':2,
        'DEFAULT':2
    },
    STRANGER_CLRS:[
        0xfb0000,
        0xd41fdf,
        0xe6ca2f,
        0x82d82e,
        0x1ae0d0,
        0x3060da,
        0xda7030,
        0x469a70,
        0xafcf3f,
        0x15b061,
        0x5e3c90,
        0xa02e4c


    ],
    GUEST_IMG_URL:'/images/obj/gp.png',
    DOT_CHART : [],
    GAME_TIPS: ["Hold Space to move fast.", "Use Arrow keys to move.", "Protect your balloon from others.","Stay away from water","Press Shift/Ctrl to shoot.",
    'Chat with others using shortcut keys 1-9','Pop balloons to win the match.',
    ],
   
    CURR_CAT: {
        "special_offer": "popular",
        "recommended": "popular",
        "best_value": "value",
        "none": "none",
        "null": "none"

    },
    CODES: {},
    DIE_MSGS:["DAMN!! Shit happens.",'GAMERS Don`t die!!!', 'I don`t want to DIE!!!!','I feel pain.','Its the end of suffering.', 'I will rise again!!!','Wait!! I am coming.','You will be dead.',
            'OH MY GOD!!!','What the heck','@$#@ @!#','OH SHIT!!!','What the F*CK','Who made this shit game!!!'],
    T_COLORS: {
        RED: 0xff0000,
        GREEN: 0x00ff00,
        BLUE: 0x0000ff,
        YELLOW: 0xffff00
    },
    EYE_CLR: {
        'b': 0x333333,
        'y': 0xffff00,
    },
    SKIN_STATE_TEXT: {
        "ACTIVE": "ACTIVE",
        "USE": "USE"
    },
    SHOP_ITEM_TYPES: [],
    AVATAR_CLRS: ['#FFE5C8', '#FFDABE', '#FFCEB4', '#FFC3AA', '#F0B8A0', '#E1A696', '#D2A18C', '#C39582', '#A57E6E', '#87675A', '#695046'],
    SKINCHILD_CLRS:['#ff0000','#00ff00','#00ffff','#ffff00','#555522'],
    SKIN_KEY_CLASS: {
        "ACTIVE": "skinOnColor",
        "USE": "skinOffColor"
    },
    SKIN_STATES: [
        "USE", "ACTIVE"
    ],
    SKIN_STATES_TOGG: {
        "USE": "ACTIVE",
        "ACTIVE": "USE"
    },
    PNAME_CLRS: [
        0xFFFFFF,
        0xFFAAAA,
        0xFFFFFF,
        0xDDDDDD
    ],
    CTRLS_NAMES: {
        'SPACE': 'SPACE',
        'ALT': 'ALT',
        'SHIFT': 'SHIFT',
        'CTRL': 'CTRL',
        'H': 'H',
        'E': 'E'
    },
    KEY_VAL: {
        '32': 'SPACE',
        '17': 'CTRL',
        '18': 'ALT',
        '16': 'SHIFT',
        '69': 'E',
        '72': 'H'
    },
    CTRLS_MSG: {
        "ALREADY": "ALREADY SET",
        "INVALID": "INVALID"
    },
    CTRLS: {
        'SPACE': '32',
        'ALT': '18',
        'SHIFT': '16',
        'CTRL': '17',
        'H': '72',
        'E': '69'
    },

    SUCCESS: "success",
  
    Taunt_CB_RES: {
        "length": "Message length insufficient. Please try a different message.",
        "alreadyfound": "This message is already present. Try something new.",
        "nospace": "You don't have any slot to hold more messages."

    },
    Taunt_CB_VALID: [
        "Insufficient Length",
        "Already Present",
        "No Space Left"
    ],
    WEAPON_PROP:['Speed','Damage','Deploy Time','Cooldown',"Strength",'Stop Time'],
    WEAPON_MAX_LEVEL:7,
    CONTROLS:{
        CARD:{
            '0':'1',
            '1':'2'
        }
    },
    CHOICE_SPR : {
        '1':'xsca',
        '2':'xhea',
        '3':'xsta',
        '4':'xfas',
        '5':'xdam',
        '6':'xsto',
        '7': 'xhol',
        '8':'xtag',
        '9':'xwin'
    },
    RING_DEF_TIME:[],
    VER_PACK : 'ccdfffe', 
    VER_2:0,
    RINGS:['r_p1','w_p2','b_tag','l_hole'],
    CHOICE_RINGS_MAPPING:{
        '6':'w'
    },
    RINGS_MAPPING:{
        'q':'Q',
        'w':'W',
        'e':'E',
        'b':'Space',
        'l':'LM',
        'r':'RM'
    },
    RINGS_TYPE:{
        'r':2,
        'q':1,
        'e':1,
        'b':1,
        'l':1,
        'w':1
    },
    RINGS_COLOR:{
        '1':0xaa0000,
        '2':0x0000aa
    },
    RINGS_SPR_MAPPING:{
        'p1':'spe',
        'p2':'stp',
        'tag':'tag',
        'hole':'hol'
    },
    COMBO_TIME:1,
    TOWER_TIMER:20,
    SplKeyCodes: [35,42,64,95],
    SHOOT_REFILL_SIZE: 150,
    TIME_SKILL_SIZE:150,
    Taunt_DEF_STA: "on",
    TAUNT_STATUS: {
        "on": "#4ed24e",
        "off": "#ff0000"
    },
    TAUNT_BORDER:{
        "on":"#006900",
        "off":"#630707"
    },
    TAUNT_BORDER_O:{
        "on":"#630707",
        "off":"#006900"
    },
    TAUNT_TOGGLE_CLR: {
        'on': '#ff0000',
        'off': '#4ed24e',
    },
    TAUNT_TOGGLE: {
        "on": "off",
        "off": "on"

    },
    GAME_MODE_DEFAULT:'',
    GAME_MODES:[],
    MODE_TO_LB:{
    },
    DEBUG:{'fps':'fps','commands':'commands','version':'version','overlay':'overlay','clear':'clear'},
    DEBUG_COMMANDS: ['fps','commands','version','overlay','clear'],
    DEBUG_COMMANDS_01:['fps','version','overlay'],
    COLOR_HEX: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': 'A',
        '11': 'B',
        '12': 'C',
        '13': 'D',
        '14': 'E',
        '15': 'F'
    },
    MAX_SCALE_PLAYER: 1,
    POWER_BAR_MAX:[],
    CONNECTION: 'http://172.104.32.148:520',
    CONN_STR_LOCAL: 'http://localhost:2222',
    CONN_STR_TESTING: 'http://localhost:2222',
    MAIN_CONN: '',
    MAIN_REG:'',
    PLAYER_DATA_URL_STR: 'gstart',
    GRAPHICS: [
        'UGLY',
        'AVERAGE',
        'GREAT'
    ],
    SERVERS_LIST_SHORT:[],
    LOC_CODES:{},
    SERVERS_LIST_LONG:[],
    SERVERS_LIST_MAP:{},
    EVENTS: {
        S_OPEN: 'open',
        S_BP: 's.bp',
        S_RU: 's.ru',
        S_MT: 's.mt',
        S_TK: 's.tk',
        S_SMC: 's.smc',
        S_WDD: 's.wdd',
        S_WDT: 's.wdt',
        S_ERR: 's.error'
    },
    OUTER_TINT: {
        RED: 0xff0000,
        GREEN: 0x00ff00,
        CYAN: 0x00ffff,
        YELLOW: 0xffff00
    },

    BACKGROUND_COLORS: {
        DARK: 0x121212,
        LIGHT:0xeeeeee
    },
    TB_TEMPRATURE: {
        DANGER: 85,
        HIGH: 50,
    },
    TB_READINGS: {
        'NORMAL': 'green',
        'HIGH': 'yellow',
        'DANGER': 'red'
    },
    TB_COLORS: {
        'red': 0xff0000,
        'yellow': 0xeeee22,
        'green': 0x00ff00,
    },
    LB_CLR_FALL: 0.06,
    TB_SIZE_X: 200,
    TB_SIZE_Y: 80,
    TB_OFFSET_X: 10,
    TB_OFFSET_Y: 10,
    TB_TEMP_MIN: 0,
    TEMP_GRAPH_MIN_VAL: 200,
    TB_TEMP_MAX: 500000,
    LB_SIZE_PER_REC_X: 330,
    LB_SIZE_PER_REC_Y: 30,
    LB_TOTAL_REC: 10,
    LB_OFFSET_X: 5,
    LB_OFFSET_Y: 90,
    LB_OFFSET_Y_START: 0,

    LB_CLR_START: 0.8,
    T_OFFLINE_MSG: "Tags are stored locally. Login to sync tags.",
    T_ONLINE_MSG: "Tags Sync is ON.",
    LB_CLRS: [{
            Rage: "#ff2424",
            c: "#ff2424"
        },
        {
            friend: "#FFFF00",
            c: "#FFFF00"
        },
        {
            sad: "#5fecff",
            c: "#5fecff"
        },
        {
            Terror: "#66CC66",
            c: "#66CC66"
        },
        {
            cool: "#4FC3F7",
            c: "#4FC3F7"
        },
        {
            attack: "#FF9800",
            c: "#FF9800"
        },
        {
            angry: "#F44336",
            c: "#F44336"
        },
        {
            meh: "#A1887F",
            c: "#A1887F"
        },
        {
            boom: "#CCFFFF",
            c: "#CCFFFF"
        },
        {
            illuminati: "#6666CC",
            c: "#6666CC"
        }
    ],
    LB_CLR: [{
            BlueOrchid: "#1F45FC",
            c: "#1F45FC"
        },
        {
            RoyaleBlue: "#2B60DE",
            c: "#2B60DE"
        },
        {
            CobaltBlue: "#0020C2",
            c: "#0020C2"
        },
        {
            BlueLotus: "#6960EC",
            c: "#6960EC"
        },
        {
            SilkBlue: "#488AC7",
            c: "#488AC7"
        },
        {
            AquaBlue: "#00FFFF",
            c: "#00FFFF"
        },
        {
            ELECTRICBLUE: "#9AFEFF",
            c: "#9AFEFF"
        },
        {
            TEAL: "#008080",
            c: "#008080"
        },
        {
            SEA_GREEN: "#4E8975",
            c: "#4E8975"
        },
        {
            CamoGreen: "#78866B",
            c: "#78866B"
        },
        {
            MSeaGreen: "#306754",
            c: "#306754"
        },
        {
            MForestGreen: "#347235",
            c: "#347235"
        },
        {
            CloverGreen: "#3EA055",
            c: "#3EA055"
        },
        {
            SpringGreen: "#4AA02C",
            c: "#4AA02C"
        },
        {
            Green: "#00FF00",
            c: "#00FF00"
        },
    ],
    TINT_COLORS: [{
            BlueLotus: "#6960EC"
        },
        {
            BlueOrchid: "#1F45FC"
        },
        {
            RoyaleBlue: "#2B60DE"
        },
        {
            CobaltBlue: "#0020C2"
        },
        {
            SilkBlue: "#488AC7"
        },
        {
            AquaBlue: "#00FFFF"
        },
        {
            ELECTRICBLUE: "#9AFEFF"
        },
        {
            TEAL: "#008080"
        },
        {
            SEA_GREEN: "#4E8975"
        },
        {
            CamoGreen: "#78866B"
        },
        {
            MSeaGreen: "#306754"
        },
        {
            MForestGreen: "#347235"
        },
        {
            CloverGreen: "#3EA055"
        },
        {
            SpringGreen: "#4AA02C"
        },
        {
            Green: "#00FF00"
        },
        {
            Yellow: "#FFFF00"
        },
        {
            CornYellow: "#FFF380"
        },
        {
            BlondeYellow: "#FBF6D9"
        },
        {
            DickYellow: "#FFD801"
        },
        {
            GoldenYellow: "#EAC117"
        },
        {
            DeepYellow: "#FFCBA4"
        },
        {
            BrassYellow: "#B5A642"
        },
        {
            TigerOrange: "#C88141"
        },
        {
            CinnamonOrange: "#C58917"
        },
        {
            WoodBrown: "#966F33"
        },
        {
            RedDOrange: "#7F5217"
        },
        {
            RustOrange: "#C36241"
        },
        {
            ChoclateOrange: "#C85A17"
        },
        {
            DarkOrange: "#F88017"
        },
        {
            ValentineRed: "#E55451"
        },
        {
            RubeRed: "#F62217"
        },
        {
            ChilliRed: "#C11B17"
        },
        {
            WineRed: "#990012"
        },
        {
            BloodRed: "#7E3517"
        },
        {
            Magenta: "#FF00FF"
        },
        {
            DeepPink: "#F52887"
        },
        {
            LemonPink: "#E4287C"
        },
        {
            VioletRed: "#CA226B"
        },
        {
            PlumPink: "#B93B8F"
        },
        {
            IrisPurple: "#571B7E"
        },
        {
            HazePurple: "#571B7E"
        },
        {
            CrimsonPink: "#E238EC"
        },
        {
            SeashellYellow: "#FFF5EE"
        },
        {
            BlueWhale: "#342D7E"
        },
        {
            JeyGray: "#616D7E"
        },
        {
            SlateGrey: "#25383C"
        },
        {
            GooseGray: "#D1D0CE"
        },
        {
            MarbleBlue: "#566D7E"
        },
        {
            FerrariRed: "#F70D1A"
        },
        {
            ChestnutRed: "#C34A2C"
        }
    ],
    DEFAULT_GRID_CLR: '#222222',
    startRadius: 25,
    NO_OF_GRID_BLOCKS: 10,
    GRID_ELE_SCALE: 0.8,
    GRID_ELE_SIZE: 120,
    GRID_RECT_SPRITE_P_BLOCK: 17,
    GRID_RGB_REPSPAWN_BASE: 10,
    GRID_RGB_REPSPAWN_DEL: 5,
    GRID_RGB_REPSPAWN_Y_BASE: 15,
    gridDotSize: 30,
    WORLD_SIZE: 0,
    MAX_PORTALS: 5,
    MAX_SIZE: 1000,
    START_SIZE: 100,
    MAX_TAG_BULLETS: 3,
    BULL_SS: 30,
    DOTS_PER_BLOCK: 100,
    DOTS_POS_DELTA: 50,
    COLORS_COUNT_DOTS: 4,
};



module.exports = GameConf;