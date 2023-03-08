import {
    segment
} from "oicq";
import plugin from '../../lib/plugins/plugin.js'

/**
 * Created with Visual Studio Code.
 * Description: 因为没有，所以才有
 * User: kirito
 * Date: 2022-11-08
 * Time: \(^o^)/ 17:39:32 摆烂！
 * Blog: mywifeasuna.top
 */

export class fuckme extends plugin {
    constructor() {
        super({
            name: '被群友日',
            dsc: '随机被一位群友注射脱氧核糖核酸',
            event: 'message',
            priority: 5000,
            rule: [{
                reg: '^#?日我$',
                fnc: 'fuckme'
            }]
        })
    }

    async fuckme(e) {
        console.log("用户命令：", e.msg);
        let map = await e.group.getMemberMap();
        let arrMember = Array.from(map.values());
        let mem = arrMember[Math.round(Math.random() * (arrMember.length - 1))];
        let msg = [segment.at(e.user_id), "被" + mem.nickname + "狠狠地注射了脱氧核糖核酸~", segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${mem.user_id}`)]
        e.reply(msg);
    }

}