module.exports = function(grunt) {
  var config = {
    dist: 'public/dist',
    client: 'public/client',
    lib: 'public/lib',
    views: 'views',
    css: 'public'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'public/lib/jquery.js',
          'public/lib/underscore.js',
          'public/lib/backbone.js',
          'public/lib/handlebars.js',
          'public/client/app.js',
          'public/client/link.js',
          'public/client/links.js',
          'public/client/linkView.js',
          'public/client/linksView.js',
          'public/client/createLinkView.js',
          'public/client/router.js'
        ],
        dest: 'public/dist/production.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      build: {
        src: 'public/dist/production.js',
        dest: 'public/dist/production.min.js'
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'public/client/*.js',
        'app/**/ *.js',
        'lib/**/*.js',
        './*.js',
        'spec/**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      combine: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      options: {
        livereload: true
      },
      scripts: {
        bower: {
          files: ['bower.json'],
          tasks: ['wiredep']
        },
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ],
        options: {
          spawn: false
        }
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin'],
        options:{
          spawn: false
        }
      }
    },

    //For use with bower.json install dependencies
    //wiredep: {
    //  app: {
    //    ignorePath: /^\/|\.\.\//,
    //    src: ['<%= config.app %>/*.ejs'],
    //    exclude: ['bower_components/bootstrap/dist/js/bootstrap.js']
    //  }
    //},

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: 'public/dist'
      },
      html: 'views/{,*/}*.ejs '
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          'public/dist',
        ]
      },
      html: ['views/{,*/}*.ejs'],
      css: ['client/{,*/}*.css']
    },

    shell: {
      prodServer: {
        command: 'git push azure master',
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');



  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', ['useminPrepare','concat', 'uglify', 'cssmin', 'usemin' ]);

  //grunt.option('prod', true);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run([ 'shell:prodServer' ])
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  //grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    //'test',
    'build',
    'upload'
  ]);


};
