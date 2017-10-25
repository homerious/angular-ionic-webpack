#基于webpack构建的angular 1.x 工程（一）webpack篇

&emsp;&emsp;现在[AngularJS](https://angularjs.org/)都已经出到4.x的版本了，可我对它的认识还是停留在1.x的版本。  
&emsp;&emsp;之前用它是为了搭配[ionic](http://ionicframework.com/docs/)来写[web手机天气 应用](https://github.com/homerious/homerWeather)（用来应付我大学里一门学科的课设的︿(￣︶￣)︿）。之后就因为它太难学而没有继续深入下去。  
&emsp;&emsp;现在就职的公司也有个项目是做混合式的手机app的，居然也是用[AngularJS](https://angularjs.org/)+[ionic](http://ionicframework.com/docs/)来做的，而且也是用1.x的版本。  
&emsp;&emsp;本来没我什么事的，我这段时间都在用[Vuejs](https://cn.vuejs.org/v2/)。然后上头发现那个项目加载是在太慢了，问我有没有优化的方法。我看了下项目工程结构，发现是用[gulp](https://gulpjs.com/)打包的一个工程。可能刚开始做这个项目的时候没掌握好要点，导致整个项目臃肿不堪。[gulp](https://gulpjs.com/)我是不会的了，由于一直在用[Vuejs](https://cn.vuejs.org/v2/)，官方cli提供的模板就是用[webpack](http://webpack.github.io/docs/)打包的，而且我之前写[ReactJS](http://react-china.org/)用的也是[webpack](http://webpack.github.io/docs/)来打包的。因此，我就用了[webpack](http://webpack.github.io/docs/)来重构一下工程。然后写下这篇详细的文章，想给可能会同样遇到的这种问题的朋友做一个参考( • ̀ω•́ )✧。  
####首先，要先配置好工程文件。
>我先列一下我的`package.json`里的配置：
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


接下来是开发时用到的依赖：
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

###然后来写webpack的配置文件


