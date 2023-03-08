import {
    segment
} from "oicq";
import plugin from "../../lib/plugins/plugin.js";
let urls_one = segment.image('http://api.andeer.top/API/word_pic1.php')
export class DianZan extends plugin {
    constructor() {
        super({
            name: '点赞',
            dsc: '点赞',
            event: 'message',
            priority: 8,
            rule: [{
                reg: /^#?(点赞|赞我|点zan)$/,
                fnc: 'thuMUp'
            }]
        })
    }
    async thuMUp(e) {
        if (e.isGroup) {
            /** 判断是否为好友 */
            let isFriend = await Bot.fl.get(e.user_id)
            if (!isFriend) return e.reply('不加好友不点🙄', true)
            /** 点赞成功回复的图片 */
            let imgs = [
                'https://xiaobai.klizi.cn/API/ce/zan.php?qq=',
                // "https://xiaobai.klizi.cn/API/ce/xin.php?qq=",
                'http://ovooa.com/API/zan/api.php?QQ=',
                'http://api.caonm.net/api/bix/b.php?qq=',
                'http://api.caonm.net/api/kan/kan_3.php?qq='
            ]
            /**随机图片处理**/
            let random = Math.floor(Math.random() * (imgs.length - 0))
            let successImg = segment.image(imgs[random] + e.user_id)
            /**点赞失败图片**/
            let faildsImg = segment.image(`https://xiaobai.klizi.cn/API/ce/paa.php?qq=${e.user_id}`)
            /**开始执行点赞**/
            let n = 0
            let failsmsg = '今天已经点过了，还搁这讨赞呢！！！'
            while (true) {
                // 好友点赞
                if (isFriend) {
                    let res = await Bot.sendLike(e.user_id, 10)
                    logger.debug(`${e.logFnc}好友点赞`, res)
                    if (res) {
                        n += 10
                    } else break
                }
            }
            /** 回复的消息 */
            let successResult = ['\n', `赞了${n}下噢喵~,可以..可以回我一下嘛o(*////▽////*)q~`, successImg, ]
            let faildsResult = ['\n', failsmsg, faildsImg]

            /** 判断点赞是否成功 */
            let msg = n > 0 ? successResult : faildsResult
            /** 回复 */
            await e.reply(
                msg,
                true, {
                    at: true
                })
            await e.reply(urls_one, true)
            return true
        }
        await Bot.sendLike(e.user_id, 20)
        await e.reply("赞了噢喵~,可以..可以回我一下嘛o(*////▽////*)q~,没点上请加我好友再发【打卡】~")
        return true
    }
}