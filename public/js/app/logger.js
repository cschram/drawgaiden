define(function () {

    // Shim console groups
    var groups = [];
    if ( typeof console.group !== 'function' ) {
        console.group = function ( group ) {
            if ( groups[ groups.length - 1 ] !== group ) {
                groups.push( group );
            }
        };

        console.groupEnd = function ( group ) {
            if ( groups[ groups.length - 1 ] === group ) {
                groups.pop();
            }
        };

        var log = console.log || function () {};
        console.log = function () {
            var msg = [
                '[',
                groups.join(']['),
                ']: ',
                [].prototype.join.call( arguments, ' ' )
            ].join('');
            log( msg );
        };
    }

    return {

        currentGroup : null,

        log : function ( group, message ) {
            if ( message ) {
                if ( group !== this.currentGroup ) {
                    console.groupEnd();
                    console.group( group );
                    this.currentGroup = group;
                }
                console.log( message );
            } else {
                message = group;
                console.groupEnd();
                console.log( message );
            }
        }
    };

});