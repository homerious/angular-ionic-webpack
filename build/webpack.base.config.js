var path = require('path');
var root = path.resolve(__dirname, '../');

module.exports = {
    entry: {
        'main': root + '\\app\\index.js',
        jquery:['jquery'],
        ionic:root+'\\app\\assets\\lib\\ionic\\release\\js\\ionic.bundle.min.js',
        datepicker:root+'\\app\\assets\\lib\\ionic-datepicker\\release\\ionic-datepicker.bundle.min.js',
        calendar_pk:root+'\\app\\assets\\lib\\calendar-pk\\release\\js\\calendar_pk.min.js'
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|woff|svg|eot|ttf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }

        ]
    },
    resolve: {
        extensions: ['.js', '.json']
    }

};
