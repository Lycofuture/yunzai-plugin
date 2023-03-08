import {
    segment
} from "oicq";
import plugin from "../../lib/plugins/plugin.js";
export class dg extends plugin {
    constructor() {
        super({
            name: 'diagan',
            dsc: 'dg',
            event: 'message',
            priority: 8,
            rule: [{
                reg: /^(.*)(代肝)/,
                fnc: 'daigan'
            }]
        })
    }
    async daigan(e) {
        let msg=[
            ('\n'),
            ('***需要代肝的板板加我啦***\n'),
            ('接以下哦、委托、体力、纪行、突破材料、怪物材料、晶核等\n'),
            ('⭐接主线任务 魔神任务 传说任务 世界任务\n'),
            ('⭐接风岩雷草神瞳 神樱树 忍冬树 梦之树 \n'),
            ('⭐接蒙德 雪山 璃月 稻妻 渊下宫 须弥 沙漠满探索度 \n'),
            ('⭐接版本活动 任务剧情 人物突破 接任何新活动 满精鱼叉 陪玩带本 开图锚点等\n'),
            ('**********\n'),
            ('纯手打，可直播\n'),
            ('联系方式 → 暂无\n'),
            ('现在还有人想要代肝吗?\n'),
            ('(づ ●─● )づ\n')
        ]
        await e.reply(msg, true, {
            at: true
        })
    }
}