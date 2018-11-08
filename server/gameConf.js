var collEnum = require('./lib/collenum.js');

function getProperGridSize(totalSize) {

    totalSize = Math.floor(totalSize / 1000) * 1000;
    return totalSize;
}

var Ad_DATA = [{
        url: "antipole_ad",
        link: "antipole.io"
    },
    {
        url: "bigwords",
        link: "bigwords.io"
    }
];
var GAME_CONF = {
    WORLD_SIZE: 10000,
    FCODE: [0, 0, 1, 0, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0
    ],
    GRID_ELE_SCALE: 1.1,
    GRID_ELE_SIZE: 72,
    GRID_RECT_SPRITE_P_BLOCK: 14,
    LOOP_SLOW_RATE: 20,
    LOOP_FAST_RATE: 60,
    INPUT_LOOP_RATE: 40
}

var LOC = {
    "US_E": "US_E",
    "US_W": "US_W",
    "ASIA_W": "ASIA_W",
    "ASIA_E": "ASIA_E",
    "FRA": "FRA"
};

var GameConf = {
    GEO_KEY: "56383629cbb84ab4a2eaeae05aa8d2c5",
    LOC_FIND_SERVICE_URL: 'http://api.ipstack.com/',
    REDIS_IP: '198.58.105.106',
    REDIS_PORT: 6379,
    REDIS_PASS: '545fgkldfgkjkjl56kglfgjkl56klj45',
    BOT_STATES: {
        'free': 1,
        'attacking': 2,
        'flee': 3,
        'movingup': 4,
        'awayfromwall': 5
    },
    BOT_WEIGHTS: {
        'free': 10,
        'attacking': 80,
        'movingup': 70,
        'awayfromwall': 10,
        'flee': 30
    },
    BOT_WEIGHTS_TOTAL: 230,
    WEIGHTS: {
        'normal': {
            'free': { // free state combined with weights
                'free': 88,
                'attacking': 0,
                'flee': 2,
                'movingup': 10,
                'awayfromwall': 0
            },
            'attacking': {
                'free': 0,
                'attacking': 60,
                'flee': 30,
                'movingup': 10,
                'awayfromwall': 0
            },
            'flee': {
                'free': 10,
                'attacking': 20,
                'flee': 65,
                'movingup': 5,
                'awayfromwall': 0
            },
            'movingup': {
                'free': 10,
                'attacking': 0,
                'flee': 12,
                'movingup': 5,
                'awayfromwall': 0
            },
        }
    },
    /// new
    RESTART_EVERY_X_HOUR: 6,
    FPS: 60,
    FIRE_DAMAGE: 50,
    SCORE_INC_FOR_DOT_EATEN: 1,
    SCORE_INC_FOR_KILL: 10,
    SCORE_INC_FOR_KILL_BAR: 50,
    SCORE_INC_FOR_CWP: 5,
    SCORE_INC_FOR_CWP_BAR: 3,
    ROOMS_DIM: 1000,
    PLUS_DIM: 500,

    PLUS_DIM_SMALL: 200,
    PLA_ACC_BASIC_X: 10,
    PLA_ACC_BASIC_Y: 13,
    PLA_ACC_FAST_X: 16,
    PLA_ACC_FAST_Y: 25,
    PLA_ACC_DFAST_X: 35,
    PLA_ACC_DFAST_Y: 40,

    PLA_ACC_PUNC: 40,
    PLA_SP_BASIC: 320,
    PLA_SP_FAST: 400,
    PLA_SP_PUNC: 1000,

    PLA_SP_FAN: 540,
    BALLOON_SCALE_RATIO: 70000,
    PLA_RAD_FOR_1_SCALE: 200,
    MAX_FACE_MASS: 35000,
    MAX_FACES_MASS_BOT: 10000,
    MAX_ZOOM: -1,
    waterDepth: 300,
    PLAYER_START_FACES: 50,

    MASS_TO_WEIGHT: 0.002, // 1 scale for 5000 mass
    CAM_DEFAULT_ZOOM: 1,
    CAM_MAX_ZOOM: 1.6,
    SERVER_NO_PACKET_TIMEOUT: 1200 * 1000, // 2 min time to new input
    MAX_LOAD_15MIN: 85, // CPU LOAD MAX
    MAX_LOAD_5MIN: 80, // CPU LOAD MAX BEFOE STOP AcCEPting ConN.

    DEFAULT_PLAYER_NAME: 'player',
    MAX_CAPACITY: 55,
    DEAD_FOOD_SIZE: 20,
    MAX_BOT_CAPACITY: 60,
    MAX_BOT_PER_CYCLE: 5,
    BOTS_TRIGGER_COUNT: 40,
    SERVER_SHUTDOWN_CODE: 'zjrqwoeoflqs',
    SERVER_SHUTDOWN_TIME: 10000,
    GAME_VER: [],
    COMBO_TIME: 6,
    DOUBLE_MODE_TIME: 60,
    POWER_BAR_MAX: [500, 550, 1000, 2000, 4000, 8000, 10000],
    TIME_GAP_BETWEEN_COMP: 3,
    SERVER_BLOCKS_COUNT: 20,
    NO_OF_SAD_PEOPLE_PER_BLOCK: 10,
    LEADERBOARD_MAX: 10,
    LEADERBOARD_FAV_MAX: 1,
    WATER_DEAD_FOOD_VAL: 20,
    POWER_REQ_TO_ATTACK: 20,
    PL_FOOD_RAD: 60, // FOOD RADIUS
    PL_REAL_RAD: 30, // PLAYER RADIUS
    BALOON_RAD: 25,
    START_FAS_RAD: 100,
    SKIN_HIGH: 512,
    SKIN_LOW: 140,
    MATCH_TIME_POP: 115,
    MATCH_TIME_WAIT: 5,
    SKIN_NAMES: {
        'base': [
            'balloon_b_base',
            'balloon_c_base',
            'balloon_g_base',
            'balloon_y_base',
            'balloon_r_base',
            'balloon_m_base'
        ],
        'premium': [
            'balloon_r_pineapple',
            'balloon_c_g1',
            'balloon_g_g1',
            'balloon_r_g1',
            'balloon_r_g2',
            'balloon_r_g3',
            'balloon_r_eyes',
            'balloon_r_tr_fl',
            'balloon_r_h1',
            'balloon_r_stars',
            'balloon_r_mos',
            'balloon_g_cat1',
            'balloon_g_owl',
            'balloon_g_pig1',
            'balloon_gr_cat2',
            'balloon_m_cow',
            'balloon_r_cat1',
            'balloon_c_e1',
            'balloon_r_snake',
            'balloon_r_snake2',
            'balloon_r_spider',
            'balloon_r_tiger',
            'balloon_r_dra',
            'balloon_r_virus',
        ],
        'youtubers': [
            'balloon_r_mp',
            'balloon_r_pewd',
        ]
    },

    RATE: {
        LOOP_SLOW_RATE: GAME_CONF.LOOP_SLOW_RATE,
        LOOP_FAST_RATE: GAME_CONF.LOOP_FAST_RATE,
        INPUT_LOOP_RATE: GAME_CONF.INPUT_LOOP_RATE
    },
    WEAPON_COLORS: [
        '0xff0033',
        '0xaa1111',
        '0x00ff00',
        '0x2200aa'
    ],
    ITEM_TYPES: {
        'FOOD': 1,
        'PLAYER': 2,
        'BULLET': 3,
        'FACE': 6,
        'SAD': 7,
        'BALL': 8,
        'ROOM_WALL': 9,
        'FAN': 10,
        'PLAYER_LEGS': 11
    },
    MAX_ALLOWED_CLIENT_TIME_DIFF: 60 * 20 * 1000,
    /// new
    MAIN_DB: null,
    PINGTIME: 5000,
    LobbyTimer: 10000,
    Tags_Max: 9,
    ONE_SEC_TIME: 1000,
    FIVE_SEC_TIME: 5000,
    FEATURES_BYTE_CODE: GAME_CONF.FCODE,
    GAME_STAGE: 'Beta',
    SCALE_INC_PER_CARD: 0.1,
    SCALE_INC_PER_DOT: 0.002,
    ITEM: {
        'dots': 1
    },
    SERVER_REGIONS: [
        'US_EAST',
        'US_WEST',
        'ASIA_EAST',
        'ASIA_WEST',
        'FRANCE'
    ],
    SERVER_REGIONS_2: [
        'use',
        'usw',
        'asiae',
        'asiaw',
        'fra'
    ],
    LOC_CODE: {
        'asiae': 3,
        'asiaw': 4,
        'usw': 2,
        'use': 1,
        'fra': 5
    },
    MODE_CODE: {
        'popmatch': 1
    },
    SERVER_REGIONS_TO_CODE: {
        'ASIA_E': '1111',
        'ASIA_W': '2222',
        'US_W': '3333',
        'US_E': '4444',
        'FRA': '5555'
    },
    SERVER_CODE_TO_REGION: {
        '1111': 'ASIA_E',
        '2222': 'ASIA_W',
        '3333': 'US_W',
        '4444': 'US_E',
        '5555': 'FRA'
    },
    SERVER_CODE_TO_REGION_NO_UNDER: {
        '1111': 'asiae',
        '2222': 'asiaw',
        '3333': 'usw',
        '4444': 'use',
        '5555': 'fra'
    },
    LOC_FULL: {
        "US_E": "US_EAST",
        "US_W": "US_WEST",
        "ASIA_W": "ASIA_WEST",
        "ASIA_E": "ASIA_EAST",
        "FRA": "FRANCE"
    },

    // currently it is the server ip address.
    MongoConf: {
        pass: 'himanshu1736A@',
        mongourl: 'mongodb://localhost:27017/pdata_kark',
        mongourl_online: 'mongodb://45.33.94.46:31017/pdata_kark',
        res_header: {
            "Content-type": "application/json",
            'Access-Control-Allow-Origin': '*'
        }
    },
    SAFE_TIME: 5,
    XP_TABLE: [50, 90, 120, 150, 2500, 7000, 15000, 25000, 40000, 70000, 100000, 250000, 450000, 700000, 1000000],
    CHOICES_TIME: 10,
    TAGS_IDS: {
        'dark death': 12
    },
    TAGS_SPECIAL: {
        DD: 'dark death'
    },
    MAX_PER_ROOM: {
        'ffa': 200,
        'FFA': 200
    },
    PLAYER_TAIL_LEN: 3,
    DOT_TYPES: 5,
    DOT_CHART: ['ff1111', 'eeee00', 'ffffff', '33f3f1', 'ffffff'],
    DOT_SCALES: [7, 9, 12, 15, 18],
    ITEMNAME_MAX_LENGTH: 25,
    MAX_TAG_LENGTH: 30,
    BLOCK_DEFAULT_SPEED: 3,
    BLOCK_BIRTH_SPEED: 2,
    BLOCK_FRICTION: 0.06,
    COLLISION_TYPE: collEnum.QT_COLL,
    SKIN_COLOR_AVATAR: [
        '0xFFE5C8'
    ],
    MAX_BLOCKS_COUNT: 50,
    IDLE_TIMEOUT: 10,
    DEFAULT_MAX_TAGS: 3,
    MAX_TAGS_POSSIBLE: 10,
    MY_IP: "127.0.0.1",
    PACKET_A: '',
    VER_2: 0,
    CONN_STR: 'http://',
    CLR_FOOD: {
        '0': 0,
        '1': 0xff0000,
        '2': 0xffff00,
        '3': 0x00ff00
    },
    SCALE_FOOD: {
        '1': 1,
        '2': 1.1,
        '3': 1.2,
        '4': 1.3
    },
    GUEST_FILES_JPG: [
        'bg', 'bg2', 'sx'
    ],
    FILES_JPG: [

    ],
    GUEST_FILES: [
        'coin', 'trophy', 'gem5',
    ],
    GUEST_FILES_OBJ: [
        'd6', 'ge', 'gp', 'cz', 'ph', 'hm', 'br', 'pp', 'cl'
    ],
    GUEST_FILES_SPAWN: [
        'dmg'
    ],
    GUEST_FILES_ANI: [

    ],
    GUEST_FILES_POWER: [
        'dam', 'fas'
    ],
    GUEST_FILES_SOCAIL: [
        'fb', 'tw'
    ],
    GUEST_FILES_TAGS: [
        'hol'
    ],
    GUEST_FILES_SHOP: [
        'bbt'
    ],
    STYLES_COUNT: 17,
    GUEST_FILES_STYLES: 'sk',
    GEMS_COUNT: 5,
    WEAPONS_COUNT: 9,
    GUEST_FILES_WEAPON: 'w',
    GUEST_FILES_GEM: 'gem',
    cUpgrade_w: 30,
    cUpgrade_b: 50,
    COIN_REWARDS_DATA: {},
    DOT_COL: '',
    MOUSE_CLICK_POLL_TIME: 500,
    FILES_PARENT: 'images',
    FILES_SPARENT: 'images/skins',
    FILES_EXT: 'png',
    PLA_SP_FAS: 2.3,
    SERVER_CODE: 1,
    PL_PL_COLL_RAD: 100,
    DOTS_HIDE_PIXELS: 110,
    RAND: 0,
    BLOCK_DENS_EXTRA_SPACE: 2,
    RAND_POS_PADDING: 100,
    LOCAL_SERVER_PRIMUS_PATH: '/jsdata/primus.js',
    PUBLIC_DIR: 'public',
    MAX_PLAYERS_PER_ROOM: 100,
    ERROR_CODE: {
        'ROOM_FULL': 12,
        'NO_ERROR': 11,
        'UNKNOWN_ERROR': 7
    },

    CONN_STR_LOCAL: 'http://localhost:519',
    LRoomSTR: '_room-',
    MAX_ROOM_COUNT_CAPTURE_MODE: 100,
    GM_DOM_MAX_CAPACITY: 60,
    GM_DOM_TEAM_MAX_SIZE: 20,
    PLAYER_DIE_MASS: 105,
    GAME_STATUS: {
        live: 1,
        maintenance: 2,
        local: 3,
        blocked: 4
    },
    GAME_STATUS_N: {
        'live': 'live',
        'maintenance': 'maintenance',
        'local': 'local',
        'blocked': 'blocked'
    },
    GAME_STATUS_M: {
        '1': 'live',
        '2': ' maintenance',
        '3': 'local',
        '4': 'blocked'
    },

    S_WD: 's.wd',
    STREAM_USER_DELTA: 1,
    MAX_SCALE_PLAYER: 20,
    SERV_CLIE_PLA_SCA_DIFF: 0,
    MAX_INPUT_QUE: 10,
    MODES: [
        'ffa', 'soccer'
    ],
    LB_CHART: [
        'ranking', 'team'
    ],

    GRAPHIC_TYPES: [
        'ugly',
        'low',
        'medium',
        'high'
    ],
    DEFAULT_QUALITY: 2,
    PLAYER_COLL_RECT: 120,

    PER_DOT_XP: 1,
    ON_SOMEONE_ELSE_PARK_HEALTH_MINUS: 5,
    MIN_SPEED: 60,
    HIDDEN_GRID: {},
    SPEED_MASS_FACTOR: 50,
    DEL_SCALE_EAT: 0.001,
    DEL_SCALE_PARK: 0.02,
    ERR: {
        MODE_NOT_FOUND: 'Mode not found',
        QUA_NOT_FOUND: 'Quality settings not found.',
        MAINTENANCE: 'Maintenance under progress.'
    },
    GM_DOM_TEAM: ['0xff0000', '0x00ff00', '0x0000ff'],
    GM_DOM_TEAM_COLORS: {
        '1': '0xff0000',
        '2': '0x00ff00',
        '3': '0x0000ff',
    },
    GM_DOM_TEAM_MAX: 3,
    RAD_MASS_R: 10,
    GAME_SLOW_PACKET_CODE: {
        'FFA': 'u',
        'AAA': 'v'
    },
    MODE_CUP_PACKET: [
        'k',
        'e',
        'd',
        'm',
        't',
        'c',
        'tb',
        'a'
    ],
    MODE_DOMINATION_CONF: {
        TeamSize: 10,
        TeamColors: [0xff0000, 0x00ff00],
    },

    E_QUALITY: {
        "UGLY": 1,
        "AVERAGE": 2,
        "GREAT": 3,
    },
    QUA_TO_STR: {
        '1': "UGLY",
        '2': "AVERAGE",
        '3': "GREAT"
    },

    // only on server

    TINT_COLORS_RAINBOW: [{
            c: '#8800FF'
        },
        {
            c: '#0000FF'
        },
        {
            c: '#00FFFF'
        },
        {
            c: '#00FF00'
        },
        {
            c: '#FFFF00'
        },
        {
            c: '#FF7F00'
        },
        {
            c: '#FF0000'
        },

    ],

    TINT_COLORS: [{
            BlueOrchid: "#3855e2",
            c: "#3855e2"
        },
        {
            RoyaleBlue: "#1054ff",
            c: "#1054ff"
        },
        {
            BlueLotus: "#4a3eff",
            c: "#4a3eff"
        },
        {
            SilkBlue: "#2b97fb",
            c: "#2b97fb"
        },
        {
            AquaBlue: "#3ed4d4",
            c: "#3ed4d4"
        },
        {
            SEA_GREEN: "#3ddda7",
            c: "#3ddda7"
        },
        {
            CamoGreen: "#87c84b",
            c: "#87c84b"
        },
        {
            MSeaGreen: "#1dc88d",
            c: "#1dc88d"
        },
        {
            MForestGreen: "#24da27",
            c: "#24da27"
        },
        {
            CloverGreen: "#5dd278",
            c: "#5dd278"
        },
        {
            CornYellow: "#efdc24",
            c: "#efdc24"
        },
        {
            BlondeYellow: "#ded07f",
            c: "#ded07f"
        },
        {
            DickYellow: "#e7c50d",
            c: "#e7c50d"
        },
        {
            TigerOrange: "#fb8a24",
            c: "#fb8a24"
        },
        {
            CinnamonOrange: "#d9b164",
            c: "#d9b164"
        },


        {
            RustOrange: "#e47853",
            c: "#e47853"
        },
        {
            ChoclateOrange: "#ff6609",
            c: "#ff6609"
        },

        {
            ValentineRed: "#E55451",
            c: "#E55451"
        },
        {
            RubeRed: "#F62217",
            c: "#F62217"
        },
        {
            ChilliRed: "#c5524f",
            c: "#c5524f"
        },
        {
            WineRed: "#ff5e71",
            c: "#ff5e71"
        },
        {
            BloodRed: "#d75a27",
            c: "#d75a27"
        },
        {
            Magenta: "#dc21dc",
            c: "#dc21dc"
        },
        {
            DeepPink: "#F52887",
            c: "#F52887"
        },

        {
            PlumPink: "#c93698",
            c: "#c93698"
        },
        {
            IrisPurple: "#a742e9",
            c: "#a742e9"
        },
        {
            HazePurple: "#aa6ad4",
            c: "#aa6ad4"
        },


        {
            MarbleBlue: "#36b6c9",
            c: "#36b6c9"
        },
        {
            FerrariRed: "#1dd4b8",
            c: "#1dd4b8"
        },
        {
            ChestnutRed: "#C34A2C",
            c: "#C34A2C"
        }
    ],
    DEFAULT_GRID_CLR: '#222222',

    ROOM_DIV_COUNT: 50,
    GRID_ELE_SCALE: GAME_CONF.GRID_ELE_SCALE,
    GRID_ELE_SIZE: GAME_CONF.GRID_ELE_SIZE,
    GRID_RECT_SPRITE_P_BLOCK: GAME_CONF.GRID_RECT_SPRITE_P_BLOCK, // this is fixed for proper view
    GRID_SPACE_IN_DIM: Math.floor((GAME_CONF.GRID_ELE_SCALE * GAME_CONF.GRID_ELE_SIZE * GAME_CONF.GRID_RECT_SPRITE_P_BLOCK) / 100) * 100,
    GRID_GAP: GAME_CONF.GRID_ELE_SCALE * GAME_CONF.GRID_ELE_SIZE * 1.2,
    GRID_RGB_REPSPAWN_BASE: 2,
    GRID_RGB_REPSPAWN_DEL: 2,
    GRID_RGB_REPSPAWN_MIN: 1,
    GRID_RGB_REPSPAWN_Y_BASE: 15,
    gridDotSize: 40,

    WORLD_SIZE: getProperGridSize(GAME_CONF.WORLD_SIZE),
    MAX_PORTALS: 5,
    MAX_SIZE: 1000,
    START_SIZE: 100,
    MAX_BULLETS: 50,
    MAX_BOOM_DOTS: 10000,
    BULL_SS: 30,
    DOTS_PER_BLOCK: 100,
    DOTS_POS_DELTA: 50,
    COLORS_COUNT_DOTS: 4,
    BULL_DIST: {
        LOW: 20,
        MED: 15,
        GOOD: 10,
        HIGH: 5,
    },
    BULL_SIZE: {
        SMALL: 20,
        SM_MED: 25,
        MEDIUM: 30,
        LARGE: 35,
        SUPER_LARGE: 40,
        EPIC: 50
    },
    BULL_ANGLE: {
        A0: 0,
        A60: 60,
        A120: 120,
    },
    BULL_SPEED: {
        LOW: 10,
        MED: 15,
        GOOD: 20,
        HIGH: 25,
    },
    SERVER_DATA: {},
    SERVER_DATA: {},
    //ISO 3166 names
    BLOCKED_LIST: [],
    // only on server
    IP_LIST_C: [
        "Anonymous Proxy", //1
        "Satellite Provider",
        "Other Country",
        "Andorra",
        "United Arab Emirates",
        "Afghanistan", ,
        "Antigua and Barbuda",
        "Anguilla",
        "Albania",
        "Armenia", //10
        "Angola",
        "Asia/Pacific Region",
        "Antarctica",
        "Argentina",
        "American Samoa", //15
        "Austria",
        "Australia",
        "Aruba",
        "Aland Islands",
        "Azerbaijan", //20
        "Bosnia and Herzegovina",
        "Barbados",
        "Bangladesh",

        "Belgium",
        "Burkina Faso", //25
        "Bulgaria",
        "Bahrain",
        "Burundi",
        "Benin",
        "Saint Bartelemey", //30
        "Bermuda",
        "Brunei Darussalam",
        "Bolivia",
        "Bonaire, Saint Eustatius and Saba",
        "Brazil", //35
        "Bahamas",
        "Bhutan",
        "Bouvet Island",
        "Botswana",
        "Belarus", //40
        "Belize",
        "Canada",
        "Cocos (Keeling) Islands",
        "Congo, The Democratic Republic of the",
        "Central African Republic", //45
        "Congo", //46
        "Switzerland",
        "Cote d'Ivoire",
        "Cook Islands",


        "Chile", //50
        "Cameroon",
        "China",
        "Colombia",
        "Costa Rica",
        "Cuba", //55
        "Cape Verde",
        "Curacao",
        "Christmas Island",
        "Cyprus",
        "Czech Republic", //60
        "Germany",
        "Djibouti",
        "Denmark",
        "Dominica",
        "Dominican Republic", //65
        "Algeria",
        "Ecuador",
        "Estonia",
        "Egypt",
        "Western Sahara", //70
        "Eritrea",
        "Spain",
        "Ethiopia",
        "Europe",
        "Finland", //75
        "Fiji",
        "Falkland Islands (Malvinas)",
        "Micronesia, Federated States of",
        "Faroe Islands",
        "France", //80
        "Gabon",
        "United Kingdom",
        "Grenada",
        "Georgia",
        "French Guiana", //85
        "Guernsey",
        "Ghana",
        "Gibraltar",
        "Greenland",
        "Gambia", //90
        "Guinea",
        "Guadeloupe",
        "Equatorial Guinea",
        "Greece",
        "South Georgia and the South Sandwich Islands", //95
        "Guatemala", //96
        "Guam",
        "Guinea-Bissau",
        "Guyana",
        "Hong Kong", //100
        "Heard Island and McDonald Islands",
        "Honduras",
        "Croatia",
        "Haiti",
        "Hungary", //105
        "Indonesia",
        "Ireland",
        "Israel",
        "Isle of Man",
        "India", //110
        "British Indian Ocean Territory",
        "Iraq",
        "Iran, Islamic Republic of",
        "Iceland",
        "Italy", //115
        "Jersey",
        "Jamaica",
        "Jordan",
        "Japan",
        "Kenya", //120
        "Kyrgyzstan",
        "Cambodia",
        "Kiribati",
        "Comoros",
        "Saint Kitts and Nevis", //125
        "Korea, Democratic People's Republic of",
        "Korea, Republic of",
        "Kuwait",
        "Cayman Islands",
        "Kazakhstan", //130
        "Lao People's Democratic Republic",
        "Lebanon",
        "Saint Lucia",
        "Liechtenstein",
        "Sri Lanka", //135
        "Liberia",
        "Lesotho",
        "Lithuania",
        "Luxembourg",
        "Latvia", //140
        "Libyan Arab Jamahiriya",
        "Morocco",
        "Monaco",
        "Moldova, Republic of",
        "Montenegro", //145

        "Saint Martin",
        "Madagascar",
        "Marshall Islands",
        "Macedonia",
        "Mali", //150
        "Myanmar",
        "Mongolia",
        "Macao",
        "Northern Mariana Islands",
        "Martinique", //155
        "Mauritania",
        "Montserrat",
        "Malta",
        "Mauritius",

        "Maldives", //160
        "Malawi",
        "Mexico",
        "Malaysia",
        "Mozambique",
        "Namibia", //165
        "New Caledonia",
        "Niger",
        "Norfolk Island",
        "Nigeria",
        "Nicaragua", //170
        "Netherlands",
        "Norway",
        "Nepal",
        "Nauru",
        "Niue", //175
        "New Zealand",
        "Oman",
        "Panama",
        "Peru",
        "French Polynesia", //180
        "Papua New Guinea",
        "Philippines",
        "Pakistan",
        "Poland",
        "Saint Pierre and Miquelon", //185
        "Pitcairn",
        "Puerto Rico",
        "Palestinian Territory",
        "Portugal",
        "Palau", //190
        "Paraguay",
        "Qatar",
        "Reunion",
        "Romania",
        "Serbia", //195
        "Russian Federation",
        "Rwanda",
        "Saudi Arabia",
        "Solomon Islands",
        "Seychelles", //200
        "Sudan",
        "Sweden",
        "Singapore",
        "Saint Helena",
        "Slovenia", //205
        "Svalbard and Jan Mayen",
        "Slovakia",
        "Sierra Leone",
        "San Marino",
        "Senegal", //210
        "Somalia",
        "Suriname",
        "South Sudan",
        "Sao Tome and Principe",
        "El Salvador", //215
        "Sint Maarten",
        "Syrian Arab Republic",
        "Swaziland",
        "Turks and Caicos Islands",
        "Chad", //220
        "French Southern Territories",
        "Togo",
        "Thailand",
        "Tajikistan",
        "Tokelau", //225
        "Timor-Leste",
        "Turkmenistan",
        "Tunisia",
        "Tonga",
        "Turkey", //230
        "Trinidad and Tobago",
        "Tuvalu",
        "Taiwan",
        "Tanzania, United Republic of",
        "Ukraine", //235
        "Uganda",
        "United States Minor Outlying Islands",
        "United States",
        "Uruguay",
        "Uzbekistan", //240
        "Holy See (Vatican City State)",
        "Saint Vincent and the Grenadines",
        "Venezuela",
        "Virgin Islands, British",
        "Virgin Islands, U.S.", //245
        "Vietnam",
        "Vanuatu",
        "Wallis and Futuna",
        "Samoa",
        "Yemen", //250
        "Mayotte",
        "South Africa",
        "Zambia",
        "Zimbabwe" //254
    ],
    //ISO 3166 NAMES 2 LETTERS
    IP_LIST: [
        "A1",
        "A2",
        "O1",
        "AD",
        "AE",
        "AF",
        "AG",
        "AI",
        "AL",
        "AM",
        "AO",
        "AP",
        "AQ",
        "AR",
        "AS",
        "AT",
        "AU",
        "AW",
        "AX",
        "AZ",
        "BA",
        "BB",
        "BD",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BL",
        "BM",
        "BN",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BT",
        "BV",
        "BW",
        "BY",
        "BZ",
        "CA",
        "CC",
        "CD",
        "CF",
        "CG",
        "CH",
        "CI",
        "CK",
        "CL",
        "CM",
        "CN",
        "CO",
        "CR",
        "CU",
        "CV",
        "CW",
        "CX",
        "CY",
        "CZ",
        "DE",
        "DJ",
        "DK",
        "DM",
        "DO",
        "DZ",
        "EC",
        "EE",
        "EG",
        "EH",
        "ER",
        "ES",
        "ET",
        "EU",
        "FI",
        "FJ",
        "FK",
        "FM",
        "FO",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GF",
        "GG",
        "GH",
        "GI",
        "GL",
        "GM",
        "GN",
        "GP",
        "GQ",
        "GR",
        "GS",
        "GT",
        "GU",
        "GW",
        "GY",
        "HK",
        "HM",
        "HN",
        "HR",
        "HT",
        "HU",
        "ID",
        "IE",
        "IL",
        "IM",
        "IN",
        "IO",
        "IQ",
        "IR",
        "IS",
        "IT",
        "JE",
        "JM",
        "JO",
        "JP",
        "KE",
        "KG",
        "KH",
        "KI",
        "KM",
        "KN",
        "KP",
        "KR",
        "KW",
        "KY",
        "KZ",
        "LA",
        "LB",
        "LC",
        "LI",
        "LK",
        "LR",
        "LS",
        "LT",
        "LU",
        "LV",
        "LY",
        "MA",
        "MC",
        "MD",
        "ME",
        "MF",
        "MG",
        "MH",
        "MK",
        "ML",
        "MM",
        "MN",
        "MO",
        "MP",
        "MQ",
        "MR",
        "MS",
        "MT",
        "MU",
        "MV",
        "MW",
        "MX",
        "MY",
        "MZ",
        "NA",
        "NC",
        "NE",
        "NF",
        "NG",
        "NI",
        "NL",
        "NO",
        "NP",
        "NR",
        "NU",
        "NZ",
        "OM",
        "PA",
        "PE",
        "PF",
        "PG",
        "PH",
        "PK",
        "PL",
        "PM",
        "PN",
        "PR",
        "PS",
        "PT",
        "PW",
        "PY",
        "QA",
        "RE",
        "RO",
        "RS",
        "RU",
        "RW",
        "SA",
        "SB",
        "SC",
        "SD",
        "SE",
        "SG",
        "SH",
        "SI",
        "SJ",
        "SK",
        "SL",
        "SM",
        "SN",
        "SO",
        "SR",
        "SS",
        "ST",
        "SV",
        "SX",
        "SY",
        "SZ",
        "TC",
        "TD",
        "TF",
        "TG",
        "TH",
        "TJ",
        "TK",
        "TL",
        "TM",
        "TN",
        "TO",
        "TR",
        "TT",
        "TV",
        "TW",
        "TZ",
        "UA",
        "UG",
        "UM",
        "US",
        "UY",
        "UZ",
        "VA",
        "VC",
        "VE",
        "VG",
        "VI",
        "VN",
        "VU",
        "WF",
        "WS",
        "YE",
        "YT",
        "ZA",
        "ZM",
        "ZW"
    ],

    IP_TO_REGION: [
        LOC.US_W, //1
        LOC.US_E, //2
        LOC.US_W, //3
        LOC.FRA, //4
        LOC.ASIA_W, //5
        LOC.ASIA_W, //6
        LOC.US_W, //7
        LOC.US_W, //8
        LOC.FRA, //9
        LOC.ASIA_W, //10
        LOC.ASIA_W, //11
        LOC.ASIA_E, //12
        LOC.ASIA_E, //13
        LOC.US_W, //14
        LOC.US_W, //15
        LOC.FRA, //16
        LOC.ASIA_E, //17
        LOC.US_W, //18
        LOC.FRA, //19
        LOC.ASIA_W, //20
        LOC.ASIA_W, //21
        LOC.US_E, //22
        LOC.ASIA_E, //23
        LOC.FRA, //24
        LOC.FRA, //25
        LOC.FRA, //26
        LOC.ASIA_W, //27
        LOC.ASIA_W, //28
        LOC.ASIA_W, //29
        LOC.US_W, //30
        LOC.US_E, //31
        LOC.ASIA_E, //32
        LOC.US_W, //33
        LOC.US_W, //34
        LOC.US_W, //35
        LOC.US_W, //36
        LOC.ASIA_E, //37
        LOC.US_E, //38
        LOC.ASIA_W, //39
        LOC.FRA, //40
        LOC.US_E, //41
        LOC.US_W, //42
        LOC.ASIA_E, //43
        LOC.ASIA_W, //44
        LOC.FRA, //45
        LOC.ASIA_W, //46
        LOC.FRA, //47
        LOC.FRA, //48
        LOC.US_W, //49

        LOC.FRA, //50
        LOC.FRA,
        LOC.ASIA_E,
        LOC.US_W,
        LOC.US_W,
        LOC.US_W, //55
        LOC.US_W,
        LOC.US_W,
        LOC.ASIA_E,
        LOC.ASIA_W,
        LOC.FRA, //60
        LOC.FRA,
        LOC.ASIA_W,
        LOC.FRA,
        LOC.US_E,
        LOC.US_E, //65
        LOC.FRA,
        LOC.US_E,
        LOC.FRA,
        LOC.ASIA_W,
        LOC.ASIA_W, //70
        LOC.ASIA_W,
        LOC.FRA,
        LOC.ASIA_W,
        LOC.FRA,
        LOC.FRA, //75
        LOC.US_E,
        LOC.US_E,
        LOC.US_E,
        LOC.US_E,
        LOC.FRA, //80
        LOC.FRA,
        LOC.FRA,
        LOC.US_E,
        LOC.ASIA_W,
        LOC.FRA, //85
        LOC.FRA,
        LOC.FRA,
        LOC.FRA,
        LOC.US_E,
        LOC.FRA, //90
        LOC.FRA,
        LOC.US_W,
        LOC.FRA,
        LOC.FRA,
        LOC.FRA, //95
        LOC.US_W,
        LOC.ASIA_E,
        LOC.FRA,
        LOC.US_W,
        LOC.ASIA_E, //100
        LOC.FRA,
        LOC.US_W,
        LOC.FRA,
        LOC.US_W,
        LOC.FRA, //105
        LOC.ASIA_E,
        LOC.FRA,
        LOC.ASIA_W,
        LOC.FRA,
        LOC.ASIA_E, //110
        LOC.ASIA_E,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.FRA,
        LOC.FRA, //115
        LOC.FRA,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_E,
        LOC.ASIA_E, //120
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W, //125
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.US_E,
        LOC.ASIA_W, //130
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.US_E,
        LOC.FRA,
        LOC.ASIA_E, //135
        LOC.FRA,
        LOC.FRA,
        LOC.FRA,
        LOC.FRA,
        LOC.FRA, //140
        LOC.FRA,
        LOC.FRA,
        LOC.FRA,
        LOC.FRA,
        LOC.FRA, //145
        LOC.US_E,
        LOC.ASIA_W,
        LOC.ASIA_E,
        LOC.ASIA_W,
        LOC.FRA, //150
        LOC.ASIA_E,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W, //155
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W, // mauritias
        LOC.ASIA_W, //160
        LOC.ASIA_W,
        LOC.US_E, // mexico
        LOC.ASIA_E,
        LOC.ASIA_W,
        LOC.ASIA_W, //Namibia 165
        LOC.US_W,
        LOC.FRA, // Niger
        LOC.US_W, //Norfolk island
        LOC.FRA,
        LOC.FRA, //170
        LOC.FRA,
        LOC.FRA,
        LOC.ASIA_E,
        LOC.ASIA_E,
        LOC.ASIA_E, // Niue 175
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.FRA, //French Polynesia //180
        LOC.US_W,
        LOC.ASIA_W, // philipines
        LOC.ASIA_W,
        LOC.FRA,
        LOC.FRA, //185
        LOC.FRA,
        LOC.FRA,
        LOC.FRA,
        LOC.FRA, // portugal
        LOC.ASIA_E, //190
        LOC.US_W, // paraguay
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.FRA,
        LOC.FRA, //serbia//195
        LOC.ASIA_W, //russia
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W, //200
        LOC.ASIA_W,
        LOC.FRA, // Sweden
        LOC.ASIA_E, //singapore
        LOC.ASIA_E,
        LOC.ASIA_E, //205
        LOC.ASIA_E,
        LOC.ASIA_E,
        LOC.ASIA_E,
        LOC.ASIA_E,
        LOC.ASIA_E, // senegal 210
        LOC.ASIA_E,
        LOC.ASIA_E,
        LOC.ASIA_E,
        LOC.ASIA_E,
        LOC.ASIA_E, // El Salvador 215
        LOC.ASIA_E,
        LOC.ASIA_E,
        LOC.ASIA_E, // swaziland
        LOC.ASIA_E,
        LOC.ASIA_W, //220
        LOC.FRA,
        LOC.ASIA_W,
        LOC.ASIA_W, // thailand
        LOC.ASIA_W,
        LOC.ASIA_W, //225
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W, //tonga
        LOC.ASIA_W, // turkey 230
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W, // taiwan
        LOC.ASIA_W,
        LOC.FRA, // ukraine 235
        LOC.ASIA_W,
        LOC.US_W,
        LOC.US_W,
        LOC.US_W,
        LOC.ASIA_W, //Uzbekistan 240
        LOC.US_W,
        LOC.US_W,
        LOC.US_W, // venezuala
        LOC.US_W,
        LOC.US_W, // virgin islands 245
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W,
        LOC.ASIA_W, //250
        LOC.ASIA_W, //Mayotte
        LOC.FRA,
        LOC.FRA,
        LOC.FRA,

    ],
    REG_TO_SERVER: [

    ]


};
GameConf.NO_OF_GRID_BLOCKS = GameConf.WORLD_SIZE / GameConf.GRID_SPACE_IN_DIM;


module.exports = GameConf;
module.exports.AdData = Ad_DATA;