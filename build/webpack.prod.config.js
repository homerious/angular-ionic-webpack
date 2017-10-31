var baseconf = require('./webpack.base.config');
var path = require('path');
var root = path.resolve(__dirname, '../');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify("development")
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
    }),
    new ExtractTextPlugin({
        filename: './[name].css?[contenthash:8]',
        allChunks: true,
    }),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'commons', // 这公共代码的chunk名为'commons'
        filename: './js/[name].bundle.js', // 生成后的文件名，虽说用了[name]，但实际上就是'commons.bundle.js'了
        minChunks: 3, // 设定要有4个chunk（即4个页面）加载的js模块才会被纳入公共代码。这数目自己考虑吧，我认为3-5比较合适。
    }),
    new ManifestPlugin(path.join('dist', 'manifest.json'))
];
baseconf.module.rules.push(
    {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader"
        })
    }
);
module.exports = merge(baseconf, {
    output: {
        path: root + "/dist",
        publicPath: "./",
        filename: "./js/[name].[chunkhash].js"
    },
    devtool: false,
    plugins: plugins
});
