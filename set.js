import {
    segment
} from "oicq";
import fetch from "node-fetch";
import plugin from '../../lib/plugins/plugin.js';
import common from '../../lib/common/common.js'
import co from '../../lib/common/common.js'
import fs from 'fs'
import YAML from 'yaml'
export class St extends plugin {
    constructor() {
        super({
            name: '清凉图',
            dsc: 'st',
            event: 'message',
            priority: 1,
            rule: [{
                reg: '^#?图$',
                fnc: 'setu'
            }, {
                reg: '^#?图片',
                fnc: 'sese'
            }]
        });
    }
    async setu(e) {
        if (e.isGroup) {
            let num = 20
            await e.reply('正在给你找图片啦～', true, {
                recallMsg: 0
            });
            let image = []
            for (let i = 0; i < [num]; i++) {
                let url = `https://api.lolicon.app/setu/v2?r18=1`; //←此处修改图片类型，0为非18，1为18，2为18非18混合
                let response = await fetch(url);
                let obj = await response.json();
                console.log(obj);
                console.log(response)
                console.log('已获取图片链接 ' + (i + 1) + ' 个');
                let msg = '已获取图片' + (i + 1) + '张'
                image.push(segment.image(obj.data[0].urls.original))
            }
            let abc = await e.reply(num = 1 ? await co.makeForwardMsg(e,image,'清凉图来啦') : image, false, {
                recallMsg: 0
            }); //群聊撤回间隔
            // let abc =  await e.reply(await co.makeForwardMsg(msgList),false,{recallMsg:0});//群聊撤回间隔
            if (!abc) {
                return e.reply('好、好涩(//// ^ ////)……不、不行啦……被、被吞啦o(≧口≦)o', true, {
                    recallMsg: 60
                });
            }
            return true;
        }
        let num = 50
        await e.reply('正在给你找' + {
            num
        } + '张图片啦～', true, {
            recallMsg: 0
        });
        for (let i = 0; i < [num]; i++) {
            let url = `https://api.lolicon.app/setu/v2?r18=0`; //←此处修改图片类型，0为非18，1为18，2为18非18混合
            let response = await fetch(url);
            let obj = await response.json();
            console.log(obj);
            console.log('已获取图片链接 ' + (i + 1) + ' 个');
            let msg = '已获取图片 ' + (i + 1) + ' 张';
            let abc = await e.reply([
                segment.image(obj.data[0].urls.original),
                msg
            ], false, {
                recallMsg: 0
            }); //私聊撤回间隔
            if (!abc) {
                return e.reply('好、好涩(//// ^ ////)……不、不行啦……被、被吞啦o(≧口≦)o', true, {
                    recallMsg: 60
                });
            }
            await common.sleep(500);
        }
        return true;
    }
    async sese(e) {
        if (e.isGroup) {
            let num = 20
            await e.reply('正在给你找图片啦～', true, {
                recallMsg: 0
            });
            let image = []
            for (let i = 0; i < [num]; i++) {
                let url = `https://api.lolicon.app/setu/v2?r18=0`; //←此处修改图片类型，0为非18，1为18，2为18非18混合
                let response = await fetch(url);
                let obj = await response.json();
                console.log(obj);
                console.log(response)
                console.log('已获取图片链接 ' + (i + 1) + ' 个');
                image.push(segment.image(obj.data[0].urls.original))
                await common.sleep(500);
            }
            let abc = await e.reply(num = 1 ? await co.makeForwardMsg(e,image,'清凉图来啦') : image, false, {
                recallMsg: 0
            }); //群聊撤回间隔
            // let abc =  await e.reply(await co.makeForwardMsg(msgList),false,{recallMsg:0});//群聊撤回间隔
            if (!abc) {
                return e.reply('好、好涩(//// ^ ////)……不、不行啦……被、被吞啦o(≧口≦)o', true, {
                    recallMsg: 60
                });
            }
            return true;
        }
        let num = 50
        await e.reply('正在给你找' + {
            num
        } + '张图片啦～', true, {
            recallMsg: 0
        });
        for (let i = 0; i < [num]; i++) {
            let url = `https://api.lolicon.app/setu/v2?r18=0`; //←此处修改图片类型，0为非18，1为18，2为18非18混合
            let response = await fetch(url);
            let obj = await response.json();
            console.log(obj);
            console.log('已获取图片链接 ' + (i + 1) + ' 个');
            let msg = '已获取图片 ' + (i + 1) + ' 张';
            let abc = await e.reply([
                segment.image(obj.data[0].urls.original),
                msg
            ], false, {
                recallMsg: 0
            }); //私聊撤回间隔
            if (!abc) {
                return e.reply('好、好涩(//// ^ ////)……不、不行啦……被、被吞啦o(≧口≦)o', true, {
                    recallMsg: 60
                });
            }
            await common.sleep(500);
        }
        return true;
    }
}