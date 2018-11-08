// @Karkio
// gruntfile.js

// PORT WHICH IS USED TO CONNECT CLIENT FOR XHR REQUEST!!!
var Conf = require('./server/gameConf.js');
// *******************Conf*******************\

var LOCALPORT = 4444;
var __mode = Conf.GAME_STATUS_N.live;
// *******************Conf*******************
var isLocal = (__mode === Conf.GAME_STATUS_N.live) ? "false" : "true";
if (isLocal) {
    LOCALPORT = 4444;
} else {
    LOCALPORT = 444;
}
// export the module to be used in the main file.
module.exports = function (grunt) {

    // init the tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeTagWhitespace: true,
                    useShortDoctype: true,
                    removeOptionalTags: true,
                    removeStyleLinkTypeAttributes: true
                },
                files: {
                    './views/home.handlebars': './views/homelocal.handlebars', // 'destination': 'source'
                }
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [{
                            match: /@@\.\w+/,
                            replacement: '@@.' + __mode
                        },
                        {
                            match: /@@,\w+/,
                            replacement: '@@,' + LOCALPORT
                        },
                        {
                            match: /@@00\w+/,
                            replacement: '@@00' + isLocal
                        },
                        {
                            match: /GAMEVER_[\w.]+/,
                            replacement: 'GAMEVER_' + grunt.file.readJSON('package.json').version
                        }
                    ]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['share/reqserver.js', 'share/karkClient.js'],
                    dest: 'share/'
                }]
            }
        },
        clean: {
            js: ['./public/javascripts/*.js'],
            css: ['./public/stylesheets/*.css', '!./public/stylesheets/*.min.css']
        },
        bump: {
            options: {
                createTag: false,
                commit: false,
                push: false,
                tagName: 'v%VERSION%',
                updateProps: 'package.json'
            }
        },
        cssmin: {

            target: {
                files: [{
                    expand: true,
                    cwd: './publicdev/stylesheets',
                    src: ['*.css', '!*.min.css'],
                    dest: './public/stylesheets',
                    ext: '.css'
                }]
            }
        },
        uglify: {
            options: {
                beautify: true,
                mangle: {
                    //  properties: true,
                    //   reserved: ['jQuery', 'TWEEN']
                },
                //     reserveDOMCache: true,
                compress: {
                    global_defs: {
                        'DEBUG': false
                    },

                       sequences: true,
                       dead_code: true,
                       drop_console: false,
                       conditionals: true,
                       booleans: true,
                       unused: true,
                       if_return: true,
                       join_vars: true
                }
            },
            jsfiles: {
                files: {
                    './public/javascripts/illuminati.js': ['./jsdata/handlebars.js', '.jsdata/frogscroll.js', './jsdata/timespan.js', './jsdata/primus.js', './jsdata/templates.js', './jsdata/howler.min.js'],
                    './public/javascripts/karkbuild.js': ['./publicdev/javascripts/karkbuild.js']
                }
            }
        },
        browserify: {
            client: {
                src: ['./share/*.js'],
                dest: './publicdev/javascripts/karkbuild.js'
            }

        },
        handlebars: {
            options: {
                namespace: 'Soulcrashers.Templates',
                processName: function (filePath) {
                    return filePath.replace(/^templates\//, '').replace(/\.handlebars$/, '');
                }
            },
            all: {
                files: {
                    "./jsdata/templates.js": ["templates/**/*.handlebars"]
                }
            }
        },
        copy: {
            dev: {
                files: [{
                    cwd: './publicdev/javascripts/other',
                    src: 'ads.js',
                    dest: './public/javascripts/',
                    expand: true
                }]
            }
        },
        hashres: {
            // Global options 
            options: {
                encoding: 'utf8',
                fileNameFormat: '${name}.${hash}.${ext}',
                renameFiles: true
            },
            prod: {
                options: {},
                src: [
                    './public/javascripts/illuminati.js',
                    './public/javascripts/karkbuild.js',
                    './public/stylesheets/stylesheet.css',
                ],
                dest: ['./views/layouts/main.handlebars',
                    './views/home.handlebars'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-hashres');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.registerTask('status', ['replace']);
    grunt.registerTask('default', ['clean:js', 'clean:css', 'bump', 'replace', 'copy:dev', 'handlebars:all', 'htmlmin:dist', 'browserify:client', 'cssmin:target', 'uglify:jsfiles', 'hashres:prod']);
};