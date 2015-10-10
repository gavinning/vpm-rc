#vpm-rc

管理.rc文件


##Install
```
npm install vpm-rc --save
```

##Example
```
var vpmrc = require('vpm-rc');
// target: ~/.apprc
var rc = vpmrc('.apprc');


// 获取配置文件内容
var config = rc.get();
// config.user
var user = rc.get('user');
// config.user.name
var name = rc.get('user.name');

// 更新配置文件
rc.set('user.name', 'admin');
```
