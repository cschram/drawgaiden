var exec = require('child_process').exec;

module.exports = function ( grunt ) {

	grunt.initConfig({
		// Require.js Optimization
		requirejs : {
			dist : {
				options : {
					almond         : true,
					baseUrl        : 'public/js',
					mainConfigFile : 'public/js/config.js',
					paths : {
						'socket.io' : 'contrib/socket.io/socket.io'
					},
					out : 'public/js/drawgaiden.min.js'
				}
			}
		},

		// CSS Optimization
		cssmin : {
			dist : {
				files : {
					'public/css/style.min.css' : [
						'public/css/normalize.css',
					    'public/css/formalize.css',
					    'public/js/contrib/spectrum/spectrum.css',
					    'public/css/style.css'
					]
				}
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-requirejs' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );

	grunt.registerTask( 'clean-js', 'Remove minified JavaScript file.', function () {
		exec('rm -f public/js/drawgaiden.min.js', this.async());
	});

	grunt.registerTask( 'clean-css', 'Remove minified CSS file.', function () {
		exec('rm -f public/css/style.min.css', this.async());
	});

	grunt.registerTask( 'clean-hjs', 'Copy back development HJS file.', function () {
		exec('cp views/index.dev.hjs views/index.hjs', this.async());
	});

	grunt.registerTask( 'build-hjs', 'Move built HJS file.', function () {
		exec('cp views/index.min.hjs views/index.hjs', this.async());
	});

	grunt.registerTask( 'clean', [ 'clean-js', 'clean-css', 'clean-hjs' ] );
	grunt.registerTask( 'build', [ 'requirejs', 'cssmin', 'build-hjs' ] );

};