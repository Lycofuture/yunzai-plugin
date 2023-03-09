import plugin from '../../lib/plugins/plugin.js'
import {
    segment
} from 'oicq'
export class outNotice extends plugin {
    constructor() {
        super({
            name: '进退群通知',
            dsc: '群通知',
            event: 'notice.group'
        })
    }
    async accept(e) {
        //let name, msg
        let msg
        let forwardMsg
        switch (e.sub_type) {
            case 'increase':
                {
                    if (e.user_id === Bot.uin) {
                        // if (!Config.getGroup(e.group_id).groupNumberChange) return false
                        msg = [
                            segment.image(`https://p.qlogo.cn/gh/${e.group_id}/${e.group_id}/100`),
                            '我是派蒙小助手\n',
                            // `新增群号：${e.group_id}`
                            '大家快来欢迎我'
                        ]
                        logger.mark(`[新增群聊]${e.group_id} ${msg}`)
                    } else {
                        //  if (!Config.getGroup(e.group_id).groupMemberNumberChange) return false
                        logger.mark('新增群员')
                        msg = [
                            //segment.image(`https://p.qlogo.cn/gh/${e.group_id}/${e.group_id}/100`),
                            //'[通知 - 新增群员]\n',
                            // `群号：${e.group_id}\n`,
                            //`新成员QQ：${e.user_id}\n`,
                            //`新成员昵称：${e.nickname}`,
                            segment.at(this.e.user_id),
                            // segment.image(),
                            segment.image(
                                'http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg'
                            ), '\n',
                            '您好我是本群的小小助手',
                            '欢迎${user_id}加入提瓦特\n',
                            '########################\n',
                            '#                      #\n',
                            '#    大佬又在装萌新了  #\n',
                            '#                      #\n',
                            '########################\n'
                        ]
                    }
                    break
                }
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
                // 群撤回
            case 'recall':
                {
                    // 开启或关闭
                    // if (!Config.getGroup(e.group_id).groupRecall) return false
                    // 是否为机器人撤回
                    if (e.user_id == Bot.uin) return false
                    // 是否为主人撤回
                    // if (e.user_id) return false
                    // 读取
                    let res = JSON.parse(
                        await redis.get(`notice:messageGroup:${e.message_id}`)
                    )
                    // 无数据 return出去
                    if (!res) return false
                    // 不同消息处理
                    let special = ''
                    if (res[0].type === 'flash') {
                        // 闪照处理
                        forwardMsg = await e.group.makeForwardMsg([{
                            message: segment.image(res[0].url),
                            nickname: e.group.pickMember(e.user_id).card,
                            user_id: e.user_id
                        }])
                        special = '[闪照]'
                    } else if (res[0].type === 'record') {
                        // 语音
                        forwardMsg = segment.record(res[0].url)
                        special = '[语音]'
                    } else if (res[0].type === 'video') {
                        // 视频
                        forwardMsg = segment.video(res[0].file)
                        special = '[视频]'
                    } else if (res[0].type === 'xml') {
                        // 合并消息
                        forwardMsg = res
                        special = '[合并消息]'
                    } else {
                        // 正常处理
                        forwardMsg = await Bot.pickFriend(Config.masterQQ[0]).makeForwardMsg([{
                            message: res,
                            nickname: e.group.pickMember(e.user_id).card,
                            user_id: e.user_id
                        }])
                    }
                    // 判断是否管理撤回
                    let isManage = ''
                    if (e.operator_id != e.user_id) {
                        isManage = `撤回管理：${e.group.pickMember(e.operator_id).card}(${e.operator_id})\n`
                    }
                    isManage ? logger.mark('群聊管理撤回') : logger.mark('[椰奶]群聊撤回')
                    // 发送的消息
                    msg = [
                        segment.image(`https://p.qlogo.cn/gh/${e.group_id}/${e.group_id}/100`),
                        `[通知 - 群聊${isManage ? '管理' : ''}撤回]\n`,
                        `撤回群名：${e.group_name}\n`,
                        `撤回群号：${e.group_id}\n`,
                        isManage,
                        `${isManage ? '被撤回人' : '撤回人员'}：${e.group.pickMember(e.user_id).card}(${e.user_id})\n`,
                        `撤回时间：${moment(e.time * 1000).format('MM-DD HH:mm:ss')}`,
                        special ? `\n特殊消息：${special}` : ''
                    ]
                    break
                }
            default:
                return false
        }
        await this.reply(msg)
    }
}