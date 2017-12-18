module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less:{
            less2css : {
                options: {
                    compress: false
                },
                files: {
                    'css/global.css': 'less/global.less',
                    'css/panEasyUI.css':'less/panEasyUI.less',
                    'css/ui_frame.css':'less/ui_frame.less'
                }
            }
        },
        cssmin:{
            target:{
                options:{
                    sourceMap:false,
                    beautify: {
                        //中文ascii化
                        ascii_only: true
                    }
                },
                files:{
                    'css/global.min.css':'css/global.css',
                    'css/panEasyUI.min.css':'css/panEasyUI.css',
                    'css/ui_frame.min.css':'css/ui_frame.css'
                }
            }
        },
        uglify:{
            build:{
                options:{
                    banner:'\n'
                },
                files:{
                    'js/test.min.js':'js/test.js',
                    'js/panEasyUI.min.js':'js/panEasyUI.js',
                    'js/ui_frame.min.js':'js/ui_frame.js'
                }
            }
        }
    })
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default',['less','cssmin','uglify']);
}

