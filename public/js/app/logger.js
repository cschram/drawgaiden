define(function () {

    var group    = console.group.bind( console ),
        groupEnd = console.groupEnd.bind( console ),
        log      = console.log.bind( console );

    // Shim console groups
    var groups = [];
    if ( typeof group !== 'function' ) {
        group = function ( grp ) {
            if ( groups[ groups.length - 1 ] !== grp ) {
                groups.push( grp );
            }
        };

        groupEnd = function () {
            groups.pop();
        };

        log = function () {
            var msg = [
                '[',
                groups.join(']['),
                ']: ',
                Array.prototype.join.call( arguments, '' )
            ].join('');
            console.log( msg );
        };
    }

    return {

        currentGroup : null,

        log : function ( grp, message ) {
            if ( message ) {
                if ( grp !== this.currentGroup ) {
                    groupEnd();
                    group( grp );
                    this.currentGroup = grp;
                }
                log( message );
            } else {
                message = grp;
                groupEnd();
                log( message );
            }
        }
    };

});
