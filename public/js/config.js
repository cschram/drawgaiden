require.config({

    baseUrl : 'js',

    deps : [ 'drawgaiden' ],

    paths : {

        'jquery'    : 'contrib/jquery/jquery',
        'flight'    : 'contrib/flight/lib',
        'socket.io' : '/socket.io/socket.io',
        'simplify'  : 'contrib/simplify-js/simplify',
        'class'     : 'contrib/class/class'

    },

    shim : {
        'flight' : {
            deps : [
                'contrib/es5-shim/es5-shim',
                'jquery'
            ]
        },

        // jQuery Plugins
        'contrib/spectrum/spectrum' : {
            deps : [ 'jquery' ]
        },
        'contrib/html5slider/html5slider' : {
            deps : [ 'jquery' ]
        },
        'contrib/notifyjs/notify.min' : {
            deps : [ 'jquery' ]
        }
    }

});