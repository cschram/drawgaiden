import React from 'react';

function Icon({ name }) {
    return <i className={`fa fa-${name}`} aria-hidden="true"></i>;
}

export default Icon;