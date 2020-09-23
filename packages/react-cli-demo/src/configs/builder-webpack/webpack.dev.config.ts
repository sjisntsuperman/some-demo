import webpack from 'webpack'

import merge from 'webpack-merge'

import {
    baseConfig
} from './webpack.base.config'

export const devConfig:webpack.Configuration=merge(baseConfig,{
    
})