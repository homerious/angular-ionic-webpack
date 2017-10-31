var baseconf = require('./webpack.base.config');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var server = require('./configDevServer');
var path = require('path');
var root = path.resolve(__dirname, '../');

var plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify("development")
        }
    }),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor', // 这公共代码的chunk名为'commons'
        filename: '[name].bundle.js', // 生成后的文件名，虽说用了[name]，但实际上就是'commons.bundle.js'了
        minChunks: 3, // 设定要有4个chunk（即4个页面）加载的js模块才会被纳入公共代码。这数目自己考虑吧，我认为3-5比较合适。
    }),
    new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
    }),
    new webpack.HotModuleReplacementPlugin()
];
baseconf.module.rules.push(
    {
        test: /\.css$/,
        loader: ['style-loader','css-loader'],
    }
);
module.exports = merge(baseconf, {
    output: {
        path: root+"/dist",
        publicPath: "/",
        filename: "./js/[name].[chunkhash].js"
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: server,
    plugins: plugins,
});
