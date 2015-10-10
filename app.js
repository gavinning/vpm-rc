var fs = require('fs');
var ini = require('ini');
var path = require('path');
var Class = require('aimee-class');
var App = Class.create();
var lib = {}, _config = {};

lib.getHome = function(){
    return process.env[(process.platform == 'win32') ?
      'USERPROFILE' : 'HOME'];
}

lib.getRC = function(name){
    return path.join(this.getHome(), name);
}

module.exports = function(name){
    _config.path = lib.getRC(name);
    return new App;
}

App.include({
    get: function(key){
        var config;

        // 同步读取配置文件
        try{
            config = ini.parse(fs.readFileSync(_config.path, 'utf-8'))

        // 读取失败则赋值为{}
        }catch(e){
            config = {}
        }

        if(key){
            try{
                // 尝试返回指定key值
                return eval('config.' + key)
            }catch(e){}
        }

        else{
            return config;
        }
    },

    set: function(key, value){
        var config = this.get();
        var arr = ['config.', key, '=value'];

        // 处理 key, value
        if(typeof key === 'string'){
             // 尝试赋值保存配置文件
            try{
                eval(arr.join(''))
                fs.writeFileSync(_config.path, ini.stringify(config), 'utf-8')

            // 失败则证明可能存在多级key，中间key可能不存在的情况
            }catch(e){
                var _data = config, arr = key.split('.');
                // 遍历检查中间key是否存在，不存在则赋值{}
                arr.forEach(function(item, i){
                    if(!_data[item] && i<arr.length-1){
                        _data[item] = {};
                        _data = _data[item];
                    }
                    // 赋值
                    if(i === arr.length-1){
                        _data[item] = value;
                    }
                    fs.writeFileSync(_config.path, ini.stringify(config), 'utf-8')
                })
            }
        }

        // 处理object
        if(typeof key === 'object'){
            config = App.extend({}, config, key)
            fs.writeFileSync(_config.path, ini.stringify(config), 'utf-8')
        }
    }
})
