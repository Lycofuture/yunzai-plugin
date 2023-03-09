import { segment } from "oicq";
import fetch from "node-fetch";
import lodash from 'lodash'
// 使用方法：
// #查权重+QQ号，带不带#都行在群聊里可以@别人也可以直接发#查权重查自己的
//换了个接口，上一个接口寄了
//感谢椰羊佬帮我改进
//1.定义命令规则
export class example extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '查QQ权重',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 50000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: "^#*查权重(.*)$",
          /** 执行方法 */
          fnc: 'chaquanzhong'
        },
      ]
    })
  }

  //执行方法
  async chaquanzhong(e) {
    let qq = e.message.filter(item => item.type == 'at')?.map(item => item?.qq)
    console.log(qq);
    if (lodash.isEmpty(qq)) {
      qq = e.msg.match(/\d+/g)
    }
    if (!qq) qq = [e.user_id]
    for (let i of qq) {
      let url = `http://tc.tfkapi.top/API/qqqz.php?type=json&qq=${i}`;
      let response = await fetch(url);
      let res = await response.json();
      let msg = [
        `QQ：${i}\n`,
        "查询状态：", segment.text(res.msg), "\n",
        "权重：", segment.text(res.qz), "\n",
        "权重越低越容易封号，权重低时别涩涩啦"
      ];
      //发出消息
      await e.reply(msg);
    }


    return true; //返回true 阻挡消息不再往下
  }

}
