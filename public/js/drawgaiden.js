require([

    'app/app',
    'app/ui/header',
    'app/ui/login',
    'app/ui/canvases',
    'app/ui/usercanvas',

    // Plugins
    'contrib/spectrum/spectrum',
    'contrib/html5slider/html5slider',
    'contrib/notifyjs/notify.min'

], function ( App, Header, Login, Canvases, UserCanvas ) {
    
    App.init();

    // Attach components
    Header.attachTo( 'header' );
    Login.attachTo( '#user-login' );
    Canvases.attachTo( '#canvases' );
    UserCanvas.attachTo( '#user-canvas' );

});