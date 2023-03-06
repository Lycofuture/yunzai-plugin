import plugin from '../../lib/plugins/plugin.js'
import {
    segment
} from 'oicq'
export class newcomer extends plugin {
    constructor() {
        super({
            name: '欢迎新人',
            dsc: '新人入群欢迎',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'notice.group.increase',
            priority: 5000,
        })
    }

    /** 接受到消息都会执行一次 */
    async accept() {
        /** 定义入群欢迎内容 */
        let msg = "欢迎来到提瓦特\n入群需改昵称为游戏uid\n以方便更好的交流游玩\n不改昵称的会被踢出群聊哦\n"
        /** 冷却cd 30s */
        let cd = 1

        if (this.e.user_id == Bot.uin) return

        /** cd */
        let key = `Yz:newcomers:${this.e.group_id}`
        if (await redis.get(key)) return
        redis.set(key, '1', {
            EX: cd
        })

        /** 回复 */
        await this.reply([
            segment.at(this.e.user_id),
            // segment.image(),
            segment.image(
                `https://api.dujin.org/pic/yuanshen/`
            ),
            msg
        ])
        await this.reply(msg('记得要改群昵称哦～'))
        await this.reply(msg('快来欢迎这位小伙伴'))
    }
}

export class outNotice extends plugin {
    constructor() {
        super({
            name: '退群通知',
            dsc: 'xx退群了',
            event: 'notice.group'
        })
    }

    async accept(e) {
        //let name, msg
        let msg
        let forwardMsg
        switch (e.sub_type) {
            case 'decrease':
                {
                    if (e.operator_id == e.user_id) {
                        msg = [
                            segment.image(
                                `http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`
                            ),
                            '[通知 - 群员退群]\n',
                            `退群人QQ：${e.user_id}\n`,
                            `退群人昵称：${e.member.nickname}\n`,
                            `退群人群名片：${e.member.card}\n`
                        ]
                        logger.mark(`[成员退群通知]${this.e.logText} ${msg}`)
                    } else if (e.operator_id !== e.user_id) {
                        msg = [
                            segment.image(
                                `http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`
                            ),
                            '[通知 - 群员被踢]\n',
                            `操作人QQ：${e.operator_id}\n`,
                            `被踢人QQ：${e.user_id}\n`,
                            `被踢人昵称：${e.member.nickname}\n`,
                            `被踢人群名片：${e.member.card}\n`
                        ]
                        logger.mark(`[成员被踢通知]${this.e.logText} ${msg}`)
                    }
                    break
                }
            default:
                return false
        }
        await this.reply(msg)
    }
}