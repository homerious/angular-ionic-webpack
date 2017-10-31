# 基于webpack构建的angular 1.x 工程（一）webpack篇

&emsp;&emsp;现在[AngularJS](https://angularjs.org/)都已经出到4.x的版本了，可我对它的认识还是停留在1.x的版本。  
&emsp;&emsp;之前用它是为了搭配[ionic](http://ionicframework.com/docs/)来写[web手机天气 应用](https://github.com/homerious/homerWeather)（用来应付我大学里一门学科的课设的︿(￣︶￣)︿）。之后就因为它太难学而没有继续深入下去。  
&emsp;&emsp;现在就职的公司也有个项目是做混合式的手机app的，居然也是用[AngularJS](https://angularjs.org/)+[ionic](http://ionicframework.com/docs/)来做的，而且也是用1.x的版本。  
&emsp;&emsp;本来没我什么事的，我这段时间都在用[Vuejs](https://cn.vuejs.org/v2/)。然后上头发现那个项目加载是在太慢了，问我有没有优化的方法。我看了下项目工程结构，发现是用[gulp](https://gulpjs.com/)打包的一个工程。可能刚开始做这个项目的时候没掌握好要点，导致整个项目臃肿不堪。[gulp](https://gulpjs.com/)我是不会的了，由于一直在用[Vuejs](https://cn.vuejs.org/v2/)，官方cli提供的模板就是用[webpack](http://webpack.github.io/docs/)打包的，而且我之前写[ReactJS](http://react-china.org/)用的也是[webpack](http://webpack.github.io/docs/)来打包的。因此，我就用了[webpack](http://webpack.github.io/docs/)来重构一下工程。然后写下这篇详细的文章，想给可能会同样遇到的这种问题的朋友做一个参考( • ̀ω•́ )✧。 
另外，本文也可以当做webpack的一篇入门文章。 
#### 首先，要先配置好工程文件。
&emsp;&emsp;我先列一下我的`package.json`里的配置：
```
{
  "name": "angular-ionic-webpack",
  "version": "1.0.0",
  "description": "a project base on angular 1.x and webpack",
  "main": "index.js",
  "scripts": {
    "build": "webpack --config ./build/webpack.prod.config.js",
    "dev": "set NODE_ENV=dev&& webpack-dev-server --config ./build/webpack.dev.config.js"
  },
  "devDependencies": {
    "css-loader": "^0.26.4",
    "extract-text-webpack-plugin": "^3.0.1",
    "html-loader": "^0.4.4",
    "html-webpack-plugin": "^2.24.1",
    "style-loader": "^0.13.1",
    "url-loader": "^0.5.7",
    "webpack": "^3.1.0",
    "webpack-dev-server": "^2.9.2",
    "webpack-manifest-plugin": "^1.3.2",
    "webpack-merge": "^4.1.0"
  },
  "dependencies": {
    "angular": "1.4.3",
    "angular-cache": "^4.5.0",
    "angular-cookies": "1.4.12",
    "angular-ui-router": "^0.3.2",
    "jquery": "^3.2.1"
  },
  "author": "homer",
  "license": "MIT"
}

```
&emsp;&emsp;第一个首先是项目直接用到的依赖，也就是`dependencies`里的东西  
分别有：
```
 "dependencies": {
    "angular": "1.4.3", 
    "angular-cache": "^4.5.0",
    "angular-cookies": "1.4.12",
    "angular-ui-router": "^0.3.2",
    "jquery": "^3.2.1"
  }
```
&emsp;&emsp;我这里的`angular`和`angular-cookies`都用了具体的版本（就是版本号前面没有用符号`^`，直接写数字`1.4.3`），因为不合版本的这两个东西会跟`ionic`里的`angular-ui-router`发生冲突导致渲染失败。  
&emsp;&emsp;而我这里也没有装`ionic`，是因为我直接引用的时候会报`can't resolve 'ionic'`的错误，我也不知道为什么，所以我是直接调用了`/app/assets/lib`里的`ionic.bundle.min.js`来引入的。请有找到原因的朋友麻烦告知一下我是为什么。  


&emsp;&emsp;接下来是开发时用到的依赖：
```
"devDependencies": {
    "css-loader": "^0.26.4",
    "extract-text-webpack-plugin": "^3.0.1",
    "html-loader": "^0.4.4",
    "html-webpack-plugin": "^2.24.1",
    "style-loader": "^0.13.1",
    "url-loader": "^0.5.7",
    "webpack": "^3.1.0",
    "webpack-dev-server": "^2.9.2",
    "webpack-manifest-plugin": "^1.3.2",
    "webpack-merge": "^4.1.0"
  },
```
&emsp;&emsp;各种loader是必要的，因为webpack在打包的时候会把你项目里的非js文件转换出来然后打包在一起。
我们常用的loader有`css-loader`,`url-loader`,这两个分别是解析css和图片的。然后其他的loader我们要看项目需求来按需选取，比如我这里因为是angular 1.x的项目，里面还有挺多的html模板，所以我这里用到了`html-loader`来解析html。  
&emsp;&emsp;其次是`webpack`——说句题外话，其实`webpack`一般都是用最新的，因为打包的环境跟所用的框架其实没有太多互相干扰的地方。我一开始想着用的1.x的`webpack`发现用起来不怎么方便，于是又改回最新的3.x。这也算是个人的一个小小心得吧。然后我们还用了`webpack-dev-server`。
这个是在我们开发的时候用的服务器，可以热替换更新代码。很方便，至于怎么用我后面会详细讲。然后就是`webpack-merge`这个东西是用来合并webpack配置，这个是在vue项目里看到，感觉还挺好用，就也模仿着用了。
最后就是各种插件，`extract-text-webpack-plugin`这个用来把css样式独立打包成一个css文件的插件，没有它的话，样式只会注入`index.html`做内联样式；`html-webpack-plugin`是用于把js注入到`index.html`里；`webpack-manifest-plugin`是用来生成网页的manifest文件的。     
&emsp;&emsp;然后是写启动webpack的命令行，也就是上面的：
```
"scripts": {
    "build": "webpack --config ./build/webpack.prod.config.js",
    "dev": "set NODE_ENV=dev&& webpack-dev-server --config ./build/webpack.dev.config.js"
  },
```
这样写的意思是，当你输入`npm run ` + 你的命令名字就会让npm执行你对应命令的语句。
比如输入`npm run dev`，相当于你执行了上面那条`dev`对应的`set NODE_ENV=dev&& webpack-dev-server --config ./build/webpack.dev.config.js"`这条语句。
这里`dev`命令执行的是开发版本打包并生成开发的服务器；`build`命令执行的则是生产版本打包。
在打包开发版本的时候，用的是`webpack-dev-server`，我们让它按照`./build/webpack.dev.config.js`里的配置（下文会提到）来执行。
在打包生产环境，是直接运行`webpack`,让它按照`./build/webpack.prod.config.js`里的配置来执行。  

&emsp;&emsp;关于这份`package.json`里其他的配置有问题的可以在issue里提哈~~

### 然后来写webpack的配置文件
#### 概述
&emsp;&emsp;安装了webpack，我们要配置好，让它按照我们的期望来工作。
一般我们都会用 `webpack.config.js`来命名webpack的配置文件，以免和其他配置文件搞混。
但是由于我们一般都会分开开发环境和生产环境，而对于这个两个环境打包我们要求会有点不一样。
开发环境我们希望它可以直接模仿生产环境放上服务器测试；
然后又想它可以一有改动就会自动打包更新显示在页面，不用我们手动刷新浏览器；
不希望它打包花的时间太长；如果出错会有相应的提示等等。
而生产环境我们想尽量压缩文件大小，生成manifest文件等等。
因此，我们就需要把开发打包和生产打包的配置分开来。这里我们就分开了 `webpack.dev.config.js`和`webpack.prod.config.js`两个文件。
但是还是有些配置是两个文件都会用到的，本着复用的精神，所以我们还有一个 `webapck.base.config.js`来记录公共的配置。

#### webpack基本结构
&emsp;&emsp;webpack的配置主要分为几个部分：
1. webpack打包文件的入口（entry）。
2. webpack打包完文件后输出的出口（output）。
3. webpack在打包文件时的模块配置（module）。
4. webpack在打包文件时用到的插件（plugin）。

&emsp;&emsp;这四个是webpack配置的基本部分，写好了这四个基本可以打包成功了。
还有其他要用的配置后面会说到，其他配置没用到的可以看一下官方的文档[(3.x的官网)](http://webpack.github.io/docs/)/ [(个人觉得翻译的比较好的中文文档)](http://www.css88.com/doc/webpack/)。
接下来我们先来分析下开发环境和生成环境共用的部分配置。
首先入口文件一般都是一样的吧？然后打包时模块配置也是一样的，因为你打包时的文件都是一样的，所以设置也是一样的。
所以我们的 `webpack.base.config.js`是这样写的：
```
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
        loaders: [
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
```
&emsp;&emsp;入口（entry）文件其实不一定是只有一个，我这里就有多个。只要路径分开写正确就可以了。
&emsp;&emsp;然后是模块（module）配置，webpack的思想是把工程所有的js都是模块，然后全部打包在一起。
所以遇到一些非js会有麻烦。但是他们早就预料这种情况，做出了一些系列的loader（加载器）来把一些非js文件做成webpack能打包的东西。
一般都会用到的是`css-loader`, `url-loader`。这两个分别用来解析项目里.css和图片字体之类的文件。
上面说过，由于项目中会有较多的.html文件要引用，所以我们还用了 `html-loader`。
我这里还有一个 `resolve`（解析）的配置，这个是用来js里引用文件的时候，不写后缀的话，webpack就会自动为其加上.js或.json的后缀，可以省一些写后缀的时间(✧◡✧)。

#### 开发打包配置
&emsp;&emsp;我们的开发打包配置是这样的：
```
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
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
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
baseconf.module.loaders.push(
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

```
&emsp;&emsp;我们首先把基本的配置引进来。然后写插件（plugin），毕竟我们开发配置想实现的功能有部分需要插件来做。 
`webpack.DefinePlugin`是用来让webpack知道正在准备的是开发环境打包。某些框架会识别开发和生产环境，然后在我们开发的时候会给出相应的警告和提示，而在生产环境则会屏蔽这些内容。
`webpack.ProvidePlugin`是当我们用到 `jQuery`之类的js库的时候，用到的相关符号都会自动进行引用，不会导致报错。
`webpack.optimize.CommonsChunkPlugin`是用来提取我们代码里的公共用到的部分，避免代码重复打包，减少代码体积。
`webpack.HotModuleReplacementPlugin`是用来启用我们的代码热替换功能，在我们改了代码之后开发服务器可以重新打包更新，浏览器自动刷新，把我们的改动显示在页面。
`HtmlWebpackPlugin`是我们自己安装的插件，用来把生成的js自动插入到我们的html模板里面。
&emsp;&emsp;写完了插件之后，我们还要写输出（output）。这里指定下输出文件夹和输出的js名字即可。
然后是是开发工具（devtool）和开发服务器（dev-server），开发工具的意思是，webpack会根据打包的文件做出一个标识的map文件，如果代码出错的话，它会找出来，然后提示在什么地方。方便修改代码。
开发服务器是一个建立在本地的服务器，上面就是你的项目。搭配热替换功能，开发会很方便。这里顺带简单介绍下，开发服务器配置 `./build/configDevServer.js`：
```
const server={
    contentBase:'/dist/',
    host: 'localhost',//服务主机
    port: 8089,//端口
    inline: true, // 可以监控js变化
    hot: true, // 热启动
    compress: true,
    watchContentBase: true,
    proxy: {//设置代理服务器，用于调试接口
        '/api':{
            target:'http://www.baidu.com',
            pathRewrite:{"^/api": "/api"}//重写路径
        }
    }
};
module.exports= server;
```
&emsp;&emsp;可以看上面的备注来理解对应的配置项的意思。
&emsp;&emsp;上文我们装了个 `webpack-merge`这时就发挥作用了。正如它的名字一样，它会把两个webpack配置合并起来。然后输出。
这样我们的开发环境配置写好了

#### 生产环境配置
&emsp;&emsp;同样，先上配置：
```
var baseconf = require('./webpack.base.config');
var path = require('path');
var root = path.resolve(__dirname, '../');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack=require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV:JSON.stringify("development")
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
        filename: './css/[name].css?[contenthash:8]',
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
    { test: /\.css$/,
        loader: ['style-loader','css-loader'] }
);
module.exports=merge(baseconf,{
    output: {
    path: root+"/dist",
        publicPath: "./",
        filename: "./js/[name].[chunkhash].js"
},
    devtool: false,
    plugins: plugins
});

```
&emsp;&emsp;重复的插件我们就不说了，我们说说几个上面没有的插件。 `webpack.optimize.UglifyJsPlugin`是用来压缩混淆js代码的。
`ExtractTextPlugin`是我们另外安装的，用来把打包的css独立出来成一个css文件。使用这个插件的时候，css的loader要相应做一下设置，所以可以看到 `css-loader`我没有放到公共配置，里面而是分开了。
`ManifestPlugin`也是另外安装的，用来生成manifest缓存文件，使网站可以减少对静态资源的重复请求。
另外你可以发现这里devtool设成了false，没有设置devserver，因为不是生产所需要的，所以没有设置。

#### 来跑一遍吧！
在你的入口的地方建立一个配置里的entry规定名字的js文件，就可以先跑一遍webpack。
如果webpack没有报错，就说明你的配置基本是对的。

接下来，我会就angular 1.x 用webpack打包打包遇到的坑来说一说，请看下一篇文章： 

[基于webpack构建的angular 1.x工程（angular篇）](./angular-m-part.md)

想看详细代码，可以访问我的项目地址 
[https://github.com/homerious/angular-ionic-webpack](https://github.com/homerious/angular-ionic-webpack)  

有什么问题或者不对的地方欢迎指出，谢谢阅读！  

本文原创，未经授权请勿转载。