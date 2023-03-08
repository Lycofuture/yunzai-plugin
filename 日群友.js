import {
    segment
} from "oicq";
import plugin from '../../lib/plugins/plugin.js'

/**
 * Created with Visual Studio Code.
 * Description: 因为没有，所以才有
 * User: kirito
 * Date: 2022-11-05
 * Time: \(^o^)/ 17:45:17 摆烂！
 * Blog: mywifeasuna.top
 */

export class fuck extends plugin {
    constructor() {
        super({
            name: '日群友',
            dsc: '随机给一位群友注射脱氧核糖核酸',
            event: 'message',
            priority: 5000,
            rule: [{
                reg: '^#?日群友$',
                fnc: 'fuck'
            }]
        })
    }

    async fuck(e) {
        console.log("用户命令：", e.msg);
        let num = Math.round(Math.random() * 100);
        // let num = 11;  // 测试 
        if (num <= 5) {
            let msg = [segment.at(e.user_id), "你也配？自己默默导管吧！"]
            e.reply(msg);
        } else if (num <= 10) {
            let msg = [segment.at(e.user_id), "呜呜呜，只因无力(╯‵□′)╯︵┻━┻，你直接日歪了，细狗"]
            e.reply(msg);
        } else if (num <= 11) {
            let msg = [segment.at(e.user_id), "万中无一，孤独终老。\n\n（这么低的概率也能命中请速速去抽卡买彩票，作者都想不到会有人能中~）"]
            e.reply(msg);
        } else if (num <= 75) {
            let map = await e.group.getMemberMap();
            let arrMember = Array.from(map.values());
            let mem = arrMember[Math.round(Math.random() * (arrMember.length - 1))];
            let msg = [segment.at(e.user_id), "成功给" + mem.nickname + "注射了脱氧核糖核酸~", segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${mem.user_id}`)]
            e.reply(msg);
        } else if (num > 75) {
            let map = await e.group.getMemberMap();
            let arrMember = Array.from(map.values());
            let mem = arrMember[Math.round(Math.random() * (arrMember.length - 1))];
            let msg = ["恭喜你", segment.at(e.user_id), "和" + mem.nickname + "喜结良缘❤", segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${mem.user_id}`)]
            e.reply(msg);
        }
    }

}