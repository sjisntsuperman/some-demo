import env from 'yeoman-env'
import eventemitter from 'events'

class Generator {
    constructor(){

    }

    run(){
        
    }
}

// app.js

import generator from 'yeoman-generator'

module.exports = class extends generator{
    writing(){

    }

    end(){
        console.log('generator finished')
    }
}