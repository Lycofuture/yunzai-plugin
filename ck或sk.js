import plugin from '../../lib/plugins/plugin.js'
import {
    segment
} from 'oicq'
export class cs extends plugin {
    constructor() {
        super({
            name: 'sk、ck帮助',
            dsc: 'sk绑定',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            priority: 1,
            rule: [{
                reg: '^#?绑定(sk|ck|cookie|stokenn)\\s*帮助$',
                fnc: 'cook'
            }]
        })
    }
    async cook(e) {
        let ulr = "blog.potato.work/archives/cookie"
        await e.reply([
            "请发送‘#扫码登录’绑定stoken和cookie\n",
            "也可以直接发送cookie或stoken来绑定\n",
            "获取教程请前往:${ulr}"
        ])
        await e.reply([
            "sk需要包含一下字段\n",
            "_MHYUUID =\n",
            "DEVICEFP_SEED_ID =\n",
            "DEVICEFP_SEED_TIME =\n",
            "DEVICEFP =\n",
            "cookie_token_v2 =\n",
            "account_mid_v2 =\n",
            "account_id_v2 =\n",
            "login_uid =\n",
            "login_ticket ="
        ])
        await e.reply([
            "ck需要包含一下字段\n",
            "_MHYUUID =\n",
            "_MHYUUID =\n",
            "DEVICEFP_SEED_ID =\n",
            "DEVICEFP_SEED_TIME =\n",
            "DEVICEFP =\n",
            "LOGIN_PLATFORM_SWITCH_STATUS =\n",
            "cookie_token_v2 =\n",
            "account_mid_v2 =\n",
            "account_id_v2 =\n",
            "ltoken_v2 =\n",
            "ltmid_v2 =\n",
            "ltuid_v2 ="
        ])
    }
}