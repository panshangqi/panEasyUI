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
                    'css/panEasyUI.css':'less/panEasyUI.less'
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
                    'css/panEasyUI.min.css':'css/panEasyUI.css'
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
                    'js/panEasyUI.min.js':'js/panEasyUI.js'
                }
            }
        }
    })
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default',['less','cssmin','uglify']);
}

