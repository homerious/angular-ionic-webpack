## 基于webpack构建的angular1.x + ionic 1.x 工程

这是一个基于webpack的angular 1.x和ionic 1.x的工程脚手架。    

给需要重构angular老工程的朋友的一个参考

>初始化工程
```
npm install
```
这条命令会自动安装所有必要的依赖，这里用到的angular版本是1.4.3
ionic的版本是1.2.4（不过由于用``npm``安装``ionic``会提示找不到``ionic``的错误,所以我把ionic附在了`/app/assets/lib`文件夹里面，直接引用）
>运行工程/开发模式打包
```
npm run dev
```
这条命令会打包并生成`dev-server`，然后可以在`localhost:8089`端口访问到这个项目的开发环境（端口配置和接口代理可以在`build/configServer.js`里配置）
>生产模式打包
```
npm run build
```
这条命令会打包成生产环境的包供部署。

更多信息可以看本脚手架里其他两篇文章：  
[基于webpack构建的angular 1.x工程（webpack篇）](./docs/webpack-part.md)  

[基于webpack构建的angular 1.x工程（angular篇）](./docs/angular-m-part.md)