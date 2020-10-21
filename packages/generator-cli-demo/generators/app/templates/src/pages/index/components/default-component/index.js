'use strict';

import React from 'react';
import './index.less';

export default class DefaultComponent extends React.Component {

    render() {
        return (
            <div className="default-component">
                <p>hello, cli-demo.</p>
            </div>
        );
    }
}
