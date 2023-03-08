// 配置cd  三个cd相互独立===========================================================
const masterCD = false; //主人是否受cd限制

// "wocplus"的触发cd     "wocplus"命令，发出的视频使用的是【远程共享视频源】
const wocpluscd_ = 120; //触发cd 单位是秒
const cdtimes_ = 15; //每个视频被发送后，在多少次内不会被再次被发送

// "卧槽plus"的触发cd     "卧槽plus"命令，发出的视频使用的是【本地自行添加】的视频
const wocpluscd = 120; //触发cd 单位是秒
const cdtimes = 15; //每个视频被发送后，在多少次内不会被再次被发送

// "woc"、"卧槽"的触发cd
const cd = 120;
// 合并转发中的发送者是机器人还是用户。设为true是机器人，设为false是用户
const botsender = false;

// 其他 ==============================================================================
const allowQYHY = true; //是否允许群友换源（仅限在已添加的源中选择）
const iswoc = false; //是否覆盖闲心plugin的“卧槽”、“woc”功能。如需使用闲心plugin的woc功能，可将此处设为false
const withdrawTimer = 0; //视频自动撤回时间，0~120（秒），0表示不撤回
const wocwithdrawTimer = 0; //图片自动撤回时间，0~120（秒），0表示不撤回

// woc图片的接口，可自行更换
// const imageUrl="https://dev.iw233.cn/api.php?sort=random"
const imageUrl = "https://iw233.cn/api.php?sort=iw233";

// 命令列表=======================================================================

// ●wocplus       随机发出一条视频，使用的是远程共享视频源
// ●卧槽plus      随机发出一条视频，使用的是你本地自行添加的视频库，需要自己慢慢添加
// ●录入、收录     对某条视频回复此命令，将其添加到本地视频库
// ●删除          1.对某条视频回复此命令，将其从本地视频库删除  2. 对失效的远程视频源回复此命令，将其从远程视频源列表里删除
// ●plus推送      将本地视频库推送至gitee共享仓库 ※需要事先配置好本地仓库与gitee仓库的连接。请使用密钥而非密码  仓库配置教程：https://www.wolai.com/q7KFZcFqQu3smb5BonMzKg
// ●开启、关闭定时推送    开启定时推送后，将每小时自动推送本地视频库至gitee仓库

// ●plus换源      查看当前收录的远程共享视频源列表，发送对应序号更换至该源

// ●卧槽、woc     获取10张高质量动漫图片，以合并转发的形式   （考虑到会覆盖闲心plugin的同名指令，可在第21行关闭此功能）
// ●来几张？图、来[数字]个老婆、来个老婆   获取指定数量张高质量动漫图片。一张时直接发送，多张时以合并转发的形式发送

// 云崽插件库：https://gitee.com/yhArcadia/Yunzai-Bot-plugins-index （gitee）   https://github.com/yhArcadia/Yunzai-Bot-plugins-index  （github）
// 渔糕就读的幼稚园：134086404

import plugin from "../../lib/plugins/plugin.js";
import YAML from "yaml";
import cfg from "../../lib/config/config.js";
import fetch from "node-fetch";
import {
    segment
} from "oicq";
import moment from "moment";
import os from "os";
import fs from "fs";
import {
    update
} from "../other/update.js";
import schedule from "node-schedule";
import path_, {
    parse
} from "path";
import {
    createRequire
} from "module";
const require = createRequire(
    import.meta.url);
let util = new update();
const __dirname = path_.resolve();
let path = path_.join(__dirname, "/resources/yuhuo/wocplus_video");
let wocadder = {};
let videolist = [];
let usedvideo = [];
let videolist_ = [];
let sourceChanger = {};
let wocRefreshTimer = 1;
let usedvideo_ = [];
const direction =
    "●wocplus\n随机发出一条视频，使用的是远程共享视频源\n\n●卧槽plus\n随机发出一条视频，使用的是你本地自行添加的视频库，需要自己慢慢添加\n\n●录入、收录\n对某条视频回复此命令，将其添加到本地视频库\n\n●删除\n1.对某条视频回复此命令，将其从本地视频库删除\n2. 对失效的远程视频源回复此命令，将其从远程视频源列表里删除\n\n●plus推送\n将本地视频库推送至gitee共享仓库以共享给其他用户使用\n※配置共享plus源教程：https://www.wolai.com/q7KFZcFqQu3smb5BonMzKg\n\n●开启、关闭定时推送\n开启定时推送后，将每小时自动推送本地视频库至gitee仓库\n\n●plus换源\n查看当前收录的远程共享视频源列表，发送对应序号更换至该源\n\n●卧槽、woc\n获取10张高质量动漫图片，以合并转发的形式\n（考虑到会覆盖闲心plugin的同名指令，默认不生效，如需使用请在第21行开启）\n\n●来几张？图、来[数字]个老婆、来个老婆\n获取指定数量张高质量动漫图片。一张时直接发送，多张时以合并转发的形式发送\n\n●[短视频分享链接]\n检测到短视频分享链接后解析并发出源视频\n支持链接类型：抖音/快手/火山/微博/虎牙/轻视频/梨视频/皮皮虾/皮皮搞笑/微视/最右/VUE Vlog/新片场/度小视/acfun";
// console.log(os.arch())
// console.log(os.platform())
// console.log(os.type())

// 短视频解析||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class jiexi extends plugin {
    constructor() {
        super({
            name: "jiexi",
            dsc: "短视频解析",
            event: "message",
            // 碎月网页截图优先级是1005
            priority: 1000,
            rule: [{
                // reg: '^(.*)https:(.*)$',
                reg: "^(.*)(?:(http|https)://)?((?:[\\w-]+\\.)+[a-z0-9]+)((?:/[^/?#]*)+)?(\\?[^#]+)?(#.+)?$",
                fnc: "jiexi",
            }, ],
        });
    }

    // 短视频解析==============================
    async jiexi(e) {
        var reg =
            /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
        let url = "";
        try {
            url = e.msg.match(reg)[0];
        } catch (error) {
            return false;
        }
        // let msg = e.msg.match(/^((https?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/)
        // let msg = e.msg.match(/https:(.*)/g)
        console.log("提取的url:", url);
        console.log("requestURL:", `https://api.xcboke.cn/api/juhe?url=${url}`);
        let videourl;
        // 尝试解析短视频
        try {
            let res = await (
                await fetch(`https://api.xcboke.cn/api/juhe?url=${url}`)
            ).json();
            console.log("短视频解析结果：", res);
            // if (res.code != 200) return false
            if (res.code == 200 && res.data.url != null) {
                videourl = res.data.url;
                if (videourl.indexOf("http") == -1) {
                    videourl = "http:".concat(videourl);
                }
            } else if (url.includes("v.kuaishou.com")) {
                console.log(
                    "解析失败，尝试独角兽接口：",
                    `http://ovooa.com/kuai.api?url=${url}&type=json`
                );
                let res = await (
                    await fetch(`http://ovooa.com/kuai.api?url=${url}&type=json`)
                ).json();
                console.log(res);
                if (res.text != "获取成功" || res.code != 1) {
                    console.log("独角兽解析失败，放行指令.....");
                    e.reply(["抖音解析失败：", res.text], true);
                    return false;
                }
                if (res.data.photos.length) {
                    console.log("抖音解析：图片");
                    this.douyinPhoto(res.data);
                    return true;
                } else {
                    videourl = res.data.url;
                }
            } else {
                // 需要解析短链接的判断
                if (url.includes("b23.tv")) {
                    let res = await (
                        await fetch(
                            `https://xiaobai.klizi.cn/API/other/url_restore.php?url=${url}`
                        )
                    ).json();

                    console.log(res);

                    if (
                        res.code == 302 &&
                        res.redirect_url &&
                        res.redirect_url.length &&
                        res.redirect_url[0].indexOf("https") != -1
                    ) {
                        url = res.redirect_url[0].split("?")[0];
                    }
                    console.log(url);
                }

                let res = await (
                    await fetch(
                        `https://xiaobai.klizi.cn/API/video/video_jx.php?url=${url}`
                    )
                ).json();
                console.log("短视频解析结果：", res);
                // if (res.code != 200) return false
                if (res.code == 200 && res.data.url != null) {
                    videourl = res.data.url;
                    if (videourl.indexOf("http") == -1) {
                        videourl = "http:".concat(videourl);
                    }
                } else {
                    console.log("解析失败，放行指令......");
                    return false;
                }
            }
        } catch (error) {
            console.log("解析失败，放行指令......");
            return false;
        }

        console.log("视频地址：", videourl);
        // 尝试下载短视频
        try {
            let response = await fetch(videourl);
            let buff = await response.arrayBuffer();

            await checkpath(path_.join(__dirname, "/resources/video"));
            fs.writeFile(
                "./resources/video/QwQ.mp4",
                Buffer.from(buff),
                "binary",
                function(err) {
                    console.log(err || "下载视频成功");
                    if (!err) {
                        // e.reply(segment.video(`file:///${_path}/resources/video/QwQ.mp4`));
                        e.reply([
                            segment.video(`file:///${__dirname}/resources/video/QwQ.mp4`),
                        ]);
                    }
                }
            );
        } catch (err) {
            return false;
        }
        return true;
    }

    // 以合并转发形式发送快手图片================================
    async douyinPhoto(data) {
        // console.log("待办：以合并转发形式发送快手图片")
        // 下载bgm
        try {
            let response = await fetch(data.url);
            let buff = await response.arrayBuffer();
            await checkpath(path_.join(__dirname, "/resources/video"));
            fs.writeFile(
                "./resources/video/kuaishouBGM.m4a",
                Buffer.from(buff),
                "binary",
                function(err) {
                    console.log(err || "下载快手BGM成功");
                }
            );
        } catch (err) {
            return false;
        }

        // // ffmpeg -i "./resources/video/kuaishouBGM.m4a" -y -acodec libmp3lame -aq 0 "./resources/video/kuaishouBGM.mp3"
        // // exec(`${ffmpeg} -y -i "${file}" -ac 1 -ar 8000 -f amr "${tmpfile}"`, async (error, stdout, stderr) => {
        //   // 使用ffmpeg将m4a转换为mp3
        //   util.execSync(`ffmpeg -i "./resources/video/kuaishouBGM.m4a" -y -acodec libmp3lame -aq 0 "./resources/video/kuaishouBGM.mp3"`, async (error, stdout, stderr) => {
        // 	try {
        // 		const amr = await fs.promises.readFile("./resources/video/kuaishouBGM.mp3")
        // 		resolve(amr)
        // 	} catch {
        //     console.log("BGM格式转换失败")
        //   }
        // })
        let msgList = [];
        const forwarder = {
            nickname: Bot.nickname,
            user_id: Bot.uin
        };
        msgList.push({
                message: [
                    segment.image(data.cover),
                    segment.text(
                        `标题：${data.title}\n用户名：${data.user}\n用户id：${data.userId}`
                    ),
                ],
                ...forwarder,
            }
            // {
            //   // message: segment.record(`file:///${__dirname}/resources/video/kuaishouBGM.mp3`),
            //   message: segment.record(`base64://${base64}`),
            //   ...forwarder,
            // }
        );
        for (let val of data.photos) {
            msgList.push({
                message: segment.image(val),
                ...forwarder,
            });
        }
        let res;
        let e = this.e;
        if (e.isGroup) res = await e.reply([await e.group.makeForwardMsg(msgList)]);
        else res = await e.reply([await e.friend.makeForwardMsg(msgList)]);
        console.log("res:", res);

        let bitMap = fs.readFileSync(
            `${__dirname}/resources/video/kuaishouBGM.m4a`
        );
        let base64 = Buffer.from(bitMap, "binary").toString("base64");
        e.reply(segment.record(`base64://${base64}`));

        if (!res) {
            e.reply("快手解析结果发送失败，可能被风控");
        }
        return true;
    }
}

// 卧槽plus(本地源)|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class wocplus extends plugin {
    constructor() {
        super({
            name: "wocplus",
            dsc: "神秘指令",
            event: "message",
            priority: 4998,
            rule: [{
                    reg: "^卧槽plus$",
                    fnc: "wocplus",
                },
                {
                    reg: "^录入|收录$",
                    fnc: "add",
                },
                {
                    reg: "^(新增|加入|录入|收录)(woc|卧槽)plus$",
                    fnc: "addwocplus",
                },
                {
                    reg: "^删除$",
                    fnc: "delwocplus",
                },
                {
                    reg: "",
                    fnc: "addvideolistener",
                },
                {
                    reg: "^plus推送$",
                    fnc: "pluspush",
                },
                {
                    reg: "^(开启|关闭)定时推送$",
                    fnc: "autopush",
                },
                {
                    reg: "^plus帮助$",
                    fnc: "help",
                },
            ],
        });
    }

    // 帮助================================
    async help(e) {
        this.e.reply(direction);
        return true;
    }

    // // 开启定时推送======================
    async autopush(e) {
        if (!e.isMaster) return false;
        if (e.msg == "开启定时推送") {
            let init = new wocplus_();
            await init.initfile();
            let res = YAML.parse(fs.readFileSync(`${path}/source.yaml`, "utf8"));
            res.autopush = true;
            let yaml = YAML.stringify(res);
            fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");
            e.reply("定时推送已开启，将会每小时会自动push至gitee仓库");
            return true;
        } else if (e.msg == "关闭定时推送") {
            let init = new wocplus_();
            await init.initfile();
            let res = YAML.parse(fs.readFileSync(`${path}/source.yaml`, "utf8"));
            res.autopush = false;
            let yaml = YAML.stringify(res);
            fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");
            e.reply("定时推送已关闭");
            return true;
        }
        return false;
    }

    // main======================
    async wocplus(e) {
        // cd
        let currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        let lastTime = await redis.get(`Yz:wcplus:${this.e.group_id}`);
        if (lastTime && (!e.isMaster || (e.isMaster && masterCD))) {
            let seconds = moment(currentTime).diff(moment(lastTime), "seconds");
            this.e.reply(`cd中，请等待${wocpluscd - seconds}秒后再使用`);
            return true;
        }
        // await redis.set(`Yz:wcplus:${this.e.group_id}`, currentTime, {
        //   EX: wocpluscd
        // })

        // 全局变量videolist中没有video时，从文件读取放入videolist
        if (!videolist || videolist.length == 0) {
            console.log("初始化list,存入全局变量");
            await this.initfile();
            videolist = JSON.parse(fs.readFileSync(`${path}/wocplus.json`, "utf8"));
        }

        // console.log("videolist:", videolist)
        if (videolist.length == 0) {
            e.reply("还没有收录视频哦~");
            return true;
        }
        // 生成随机数，发送视频
        let num = Number;
        do {
            num = Math.round(Math.random() * (videolist.length - 1));
        } while (usedvideo.includes(num));
        usedvideo.push(num);

        console.log("本次随机到第", num + 1, "/", videolist.length, "个视频");
        if (usedvideo.length > cdtimes || usedvideo.length >= videolist.length)
            usedvideo = usedvideo.slice(1);
        console.log("近期使用过的视频，下次不会再随机到:", usedvideo);
        // e.reply(videolist[num])

        let res = await e.reply([videolist[num]], false, {
            recallMsg: withdrawTimer,
        });
        // console.log("res:",res)
        if (!res) {
            e.reply("视频发送失败，可能被风控");
            return true;
        }
        currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        await redis.set(`Yz:wcplus:${this.e.group_id}`, currentTime, {
            EX: wocpluscd,
        });
        // await this.checkpath(path);
        // // 读取本地视频列表
        // let videos = [];
        // fs.readdirSync(path).forEach(fileName => videos.push(fileNamew));
        // // 从中随机取出一个视频
        // let randomFile = videos[Math.round(Math.random() * (videos.length - 1))]
        // // console.log(randomFile)
        // // 拼接出视频路径
        // let finalPath = path_.join(path, randomFile);
        // // console.log(finalPath)
        // // // 读取视频
        // // let bitMap = fs.readFileSync(finalPath);
        // // let base64 = Buffer.from(bitMap, 'binary').toString('base64');
        // e.reply([segment.video(finalPath)])
        return true;
    }

    // 录入视频(直接对视频回复“收录”)=================
    async add(e) {
        if (!e.isMaster) return false;
        if (!e.source) return false;
        // 获取引用的视频
        let video = await this.getReplyVideo(e);
        if (!video) return false;
        this.addvideo(video);
        return true;
    }

    // 删除视频=================
    async delwocplus(e) {
        if (!e.isMaster) return false;
        if (!e.source) return false;

        // 获取被引用的视频
        let video = await this.getReplyVideo(e);
        if (!video) return false;

        // 读出文件
        await this.initfile();
        videolist = JSON.parse(fs.readFileSync(`${path}/wocplus.json`, "utf8"));
        // 删除其中的相应视频，然后写入文件
        for (let i = 0; i < videolist.length; i++) {
            if (videolist[i].md5 == video.md5) {
                videolist.splice(i, 1);
                fs.writeFileSync(
                    `${path}/wocplus.json`,
                    JSON.stringify(videolist, null, "\t")
                );
                this.e.reply("删除成功");
                return true;
            }
        }
        e.reply("未收录该视频。。");
        return false;
    }

    // 添加视频===============
    async addwocplus(e) {
        if (!e.isMaster) return false;
        let video;
        // 如果是回复
        if (e.source) {
            video = await this.getReplyVideo(e);
        }
        // 如果该消息不是对视频回复
        if (!video) {
            if (wocadder[e.user_id]) {
                clearTimeout(wocadder[e.user_id]);
            }

            wocadder[e.user_id] = setTimeout(() => {
                if (wocadder[e.user_id]) {
                    delete wocadder[e.user_id];
                }
            }, 60000);

            e.reply([segment.at(e.user_id), "请发送视频"]);
            return true;
        } else {
            this.addvideo(video);
        }
        return true;
    }

    // 初始化文件==============
    async initfile() {
        await checkpath(path);
        if (!fs.existsSync(`${path}/wocplus.json`)) {
            fs.writeFileSync(`${path}/wocplus.json`, JSON.stringify([], null, "\t"));
        }
        if (!fs.existsSync(`${path}/.gitignore`)) {
            fs.writeFileSync(`${path}/.gitignore`, "*.yaml");
        }
    }

    // ============监听用户添加视频========
    async addvideolistener(e) {
        if (!wocadder[e.user_id]) return false;
        let video;
        for (let val of e.message) {
            if (val.type == "video") {
                video = val;
                break;
            }
        }
        console.log(video);
        if (video) {
            this.addvideo(video);
        }
        if (wocadder[e.user_id]) {
            clearTimeout(wocadder[e.user_id]);
            delete wocadder[e.user_id];
        }
        return false;
    }

    // 存视频==================================
    async addvideo(video) {
        // 读出文件
        await this.initfile();
        videolist = JSON.parse(fs.readFileSync(`${path}/wocplus.json`, "utf8"));
        // 查重
        for (let val of videolist) {
            if (val.md5 == video.md5) {
                this.e.reply("视频已存在");
                return true;
            }
        }
        // 添加进videolist，写入文件
        videolist.push(video);
        fs.writeFileSync(
            `${path}/wocplus.json`,
            JSON.stringify(videolist, null, "\t")
        );
        this.e.reply("收录成功");
        return true;
    }

    // // 递归检查并创建路径（如果路径不存在） =================
    // async checkpath(checkPath) {
    //   // 取上一级路径
    //   let symbol = "/"
    //   if (os.platform() == "win32")
    //     symbol = "\\"
    //   let tpath = checkPath.split(symbol)
    //   tpath.splice(-1)
    //   tpath = tpath.join(symbol)
    //   // console.log(tpath)
    //   // 如果不存在上一级路径
    //   if (!fs.existsSync(tpath)) {
    //     // 则递归处理
    //     await this.checkpath(tpath)
    //   }
    //   // 存在上一级路径时则创建本级路径
    //   // console.log("创建路径：", checkPath)
    //   if (!fs.existsSync(checkPath)) {
    //     fs.mkdirSync(checkPath);
    //   }
    // }

    // 获取被引用的视频===============================
    async getReplyVideo(e) {
        let reply;
        if (e.isGroup) {
            reply = (await e.group.getChatHistory(e.source.seq, 1)).pop() ? .message;
        } else {
            reply = (await e.friend.getChatHistory(e.source.time, 1)).pop() ? .message;
        }
        if (reply) {
            for (let val of reply) {
                if (val.type == "video") {
                    return val;
                }
            }
        }
        return false;
    }

    // 推送本地视频列表至gitee仓库==============================
    async pluspush(e) {
        if (!e.isMaster) return false;
        /** 检查git安装 */
        if (!(await util.checkGit())) return;
        let ret = await util.execSync(
            `cd ${path} && git add . && git commit -m "update wocVideoList"  && git push`,
            (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                }
                console.log(`stdout:${stdout}`);
                console.log(`stderr:${stderr}`);
            }
        );
        console.log(ret);
        e.reply(ret.stdout);
        return true;
    }
}

// 定时pluspush      秒 分 时 日 月 星期  ||||||||||||||||||||||||||||||||||||||||||||||||||||||
schedule.scheduleJob("0 0 * * * ?", async () => {
    // schedule.scheduleJob("0 * * * * ?",async ()=>{
    let init = new wocplus_();
    await init.initfile();
    let res = YAML.parse(fs.readFileSync(`${path}/source.yaml`, "utf8"));
    if (res.autopush == false) return false;
    try {
        if (!(await util.checkGit())) return;
        let ret = await util.execSync(
            `cd ${path} && git add . && git commit -m "update wocVideoList"  && git push`,
            (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    return true;
                }
                console.log(`stdout:${stdout}`);
                console.log(`stderr:${stderr}`);
            }
        );
        console.log(ret);
    } catch (err) {
        console.log(err);
    }
});

// 使用远程源||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class wocplus_ extends plugin {
    constructor() {
        super({
            name: "wocplus_",
            dsc: "神秘指令",
            event: "message",
            priority: 4997,
            rule: [{
                    reg: "^wocplus$",
                    fnc: "wocplus_",
                },
                {
                    reg: "^plus换源$",
                    fnc: "changeSource",
                },
                {
                    reg: "^plus换源https://gitee.com/(.*)/raw/master(.*)/wocplus.json$",
                    fnc: "addSource",
                },
                {
                    reg: "^[0-9]{1,2}$",
                    fnc: "selectSource",
                },
                {
                    reg: "^删除$",
                    fnc: "delSource",
                },
            ],
        });
    }

    // 删除源==========================
    async delSource(e) {
        if (!e.isMaster) return false;
        if (!e.source) return false;
        let reply;
        if (e.isGroup) {
            reply = await e.group.getChatHistory(e.source.seq, 1);
        } else {
            reply = await e.friend.getChatHistory(e.source.time, 1);
        }
        reply = reply[0];
        // console.log(reply)
        if (reply.sender.user_id != cfg.qq) return false;
        if (!reply.raw_message.includes("访问失败，请检查该plus源可用性"))
            return false;

        let url = reply.raw_message
            .replace("访问失败，请检查该plus源可用性：\n", "")
            .trim();
        // console.log("url:",url)
        await this.initfile();
        let res = YAML.parse(fs.readFileSync(`${path}/source.yaml`, "utf8"));
        for (let i = 0; i < res.source.length; i++) {
            if (res.source[i] == url) {
                if (res.using > i) res.using--;
                else if (res.using == i) res.using = 0;

                res.source.splice(i, 1);
                let yaml = YAML.stringify(res);
                fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");
                e.reply([
                    "已删除该源",
                    `${res.using == i ? `，plus源已切换为：${res.source[0]}` : ""}`,
                ]);
                return true;
            }
        }
        e.reply("未收录该源");
        return true;
    }

    // 用编号选择源===========================
    async selectSource(e) {
        if (!sourceChanger[e.user_id]) return false;
        // if (!e.isMaster) return false
        let num = e.msg * 1;
        console.log(num);
        await this.initfile();
        let res = YAML.parse(fs.readFileSync(`${path}/source.yaml`, "utf8"));

        if (num < 1 || num > res.source.length) {
            e.reply(`序号${num}不存在`);
            return true;
        }

        res.using = num - 1;
        // 获取该源收录的视频列表
        try {
            let raw = await fetch(res.source[res.using]);
            videolist_ = await raw.json();
        } catch (error) {
            console.log(error);
            e.reply(["访问失败，请检查该plus源可用性：\n", res.source[res.using]]);
            return true;
        }

        e.reply(
            `plus源已切换至[${res.source[res.using]
        .replace("https://gitee.com/", "")
        .replace(
          /\/raw\/master(.*)\/wocplus.json/,
          ""
        )}]，该plus源当前收录视频${videolist_.length}条`
        );
        let yaml = YAML.stringify(res);
        fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");

        if (sourceChanger[e.user_id]) {
            clearTimeout(sourceChanger[e.user_id]);
            delete sourceChanger[e.user_id];
        }
        return true;
    }

    // 新增源=========================
    async addSource(e) {
        if (!e.isMaster) return false;
        await this.initfile();
        let res = YAML.parse(fs.readFileSync(`${path}/source.yaml`, "utf8"));
        let newSource = e.msg.replace("plus换源", "").trim();
        if (res.source.includes(newSource)) {
            e.reply("该源已存在");
            return true;
        }
        res.source.push(newSource);
        res.using = res.source.length - 1;
        console.log(res);

        // 获取该源收录的视频列表
        try {
            let raw = await fetch(res.source[res.using]);
            videolist_ = await raw.json();
        } catch (error) {
            e.reply(["访问失败，请检查该plus源可用性：\n", res.source[res.using]]);
            return true;
        }

        e.reply(`添加成功，已启用该plus源。当前该源收录视频${videolist_.length}条`);
        let yaml = YAML.stringify(res);
        fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");
        return true;
    }

    // #plus换源===============================
    async changeSource(e) {
        if (!e.isMaster && !allowQYHY) return false;
        await this.initfile();
        let res = YAML.parse(fs.readFileSync(`${path}/source.yaml`, "utf8"));
        console.log(res);

        let sourcelist = "当前有如下plus源:\n\n";
        for (let i = 0; i < res.source.length; i++) {
            sourcelist = sourcelist.concat(
                `${i + 1}. ${res.source[i]
          .replace("https://gitee.com/", "")
          .replace(/\/raw\/master(.*)\/wocplus.json/, "")} ${
          i == res.using * 1 ? "[当前]" : ""
        }\n`
            );
        }
        sourcelist = sourcelist.concat(
            "\n请发送数字来选中要使用的源。\n或者发送新源以收录，指令格式：\nplus换源https://gitee.com/用户名/仓库名/raw/master/wocplus.json"
        );
        e.reply(sourcelist);

        // 开始等待用户后续指令
        if (sourceChanger[e.user_id]) {
            clearTimeout(sourceChanger[e.user_id]);
        }
        sourceChanger[e.user_id] = setTimeout(() => {
            if (sourceChanger[e.user_id]) {
                delete sourceChanger[e.user_id];
            }
        }, 60000);

        return true;
    }

    // main======================
    async wocplus_(e) {
        // cd
        let currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        let lastTime = await redis.get(`Yz:wcplus_:${this.e.group_id}`);
        if (lastTime && (!e.isMaster || (e.isMaster && masterCD))) {
            let seconds = moment(currentTime).diff(moment(lastTime), "seconds");
            this.e.reply(`cd中，请等待${wocpluscd_ - seconds}秒后再使用`);
            return true;
        }
        // await redis.set(`Yz:wcplus_:${this.e.group_id}`, currentTime, {
        //   EX: wocpluscd_
        // })

        if (!videolist_ || videolist_.length == 0 || wocRefreshTimer) {
            await this.initfile();
            let res = YAML.parse(fs.readFileSync(`${path}/source.yaml`, "utf8"));
            console.log(
                "初始化videolist,使用plus源：",
                res.source[res.using]
                .replace("https://gitee.com/", "")
                .replace("/raw/master/wocplus.json", "")
            );
            if (res.using * 1 >= res.source.length) {
                res.using = 0;
                let yaml = YAML.stringify(res);
                fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");
            }
            try {
                let raw = await fetch(res.source[res.using]);
                videolist_ = await raw.json();
            } catch (error) {
                e.reply([
                    "访问失败，请检查当前plus源可用性：\n",
                    res.source[res.using],
                ]);
                return true;
            }
            wocRefreshTimer = 0;
            setTimeout(() => {
                wocRefreshTimer = 1;
            }, 15 * 60 * 1000); //计时15分钟，定时从仓库获取视频列表
        }

        // 生成随机数，发送视频
        let num = Number;
        do {
            num = Math.round(Math.random() * (videolist_.length - 1));
        } while (usedvideo_.includes(num));
        usedvideo_.push(num);

        console.log("本次随机到第", num + 1, "/", videolist_.length, "个视频");
        if (usedvideo_.length > cdtimes_ || usedvideo_.length >= videolist_.length)
            usedvideo_ = usedvideo_.slice(1);
        console.log("近期使用过的视频，下次不会再随机到:", usedvideo_);
        // e.reply(videolist_[num])
        let res = await e.reply([videolist_[num]], false, {
            recallMsg: withdrawTimer,
        });
        // console.log("res:",res)
        if (!res) {
            e.reply("视频发送失败，可能被风控");
            return true;
        }
        currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        await redis.set(`Yz:wcplus_:${this.e.group_id}`, currentTime, {
            EX: wocpluscd,
        });
        return true;
    }

    // 初始化文件============-======
    async initfile() {
        await checkpath(path);
        if (!fs.existsSync(`${path}/source.yaml`)) {
            let data = {
                source: ["https://gitee.com/yhArcadia/woc/raw/master/wocplus.json"],
                using: 0,
                autopush: false,
                temp: {},
            };
            let yaml = YAML.stringify(data);
            fs.writeFileSync(`${path}/source.yaml`, yaml, "utf8");
            this.e.reply([
                "欢迎使用wocplus插件，以下是命令说明：\n\n",
                direction,
                "\n\n\n※您随时可以发送“plus帮助”来查看此说明",
            ]);
        }
    }
}

// 卧槽图库||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// let limit = 10
export class wallpaper extends plugin {
    constructor() {
        super({
            name: "wallpaper",
            dsc: "二次元壁纸合并转发",
            event: "message",
            priority: 4999,
            rule: [{
                    reg: "^(卧槽|woc)$",
                    fnc: "wallpaper",
                },
                {
                    reg: "^来(.*)(张|个)(((涩|色)*图)|(壁纸)|(老婆))$",
                    fnc: "wallpaper",
                },
            ],
        });
    }

    async wallpaper(e) {
        // console.log("|||||",Bot.nickname)
        // cd
        let currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        let lastTime = await redis.get(`Yz:wc:${this.e.group_id}`);
        if (lastTime && (!e.isMaster || (e.isMaster && masterCD))) {
            let seconds = moment(currentTime).diff(moment(lastTime), "seconds");
            this.e.reply(`cd中，请等待${cd - seconds}秒后再使用`);
            return true;
        }
        // await redis.set(`Yz:wc:${this.e.group_id}`, currentTime, {
        //   EX: cd
        // })

        // 获取当前群配置
        // let conf = cfg.getGroup(this.group_id);
        // console.log(conf)
        let dic = {
            一: 1,
            二: 2,
            两: 2,
            三: 3,
            四: 4,
            五: 5,
            六: 6,
            七: 7,
            八: 8,
            九: 9,
            十: 10,
            几: 0,
        };
        let num = e.msg.replace(/来|张|个|(色|涩)*图|(壁纸)|(老婆)/g, "");
        console.log(num);

        // 如果num不是纯数字
        if (!(!isNaN(parseFloat(num)) && isFinite(num))) {
            if (num.length < 2) num = dic[num];
            else num = 11;
        }
        // 0表示随机3~10张
        if (num == 0) num = Math.floor(Math.random() * 8 + 3);

        // 一张的话就直接发出去
        if (!num || num == 1) {
            e.reply([segment.image("https://iw233.cn/api.php?sort=iw233")], false, {
                recallMsg: wocwithdrawTimer,
            });
            return true;
        }

        if (e.msg.includes("卧槽") || e.msg.includes("woc")) {
            if (!iswoc) return false;
            this.e.reply("触发探索未知的神秘空间，请稍等...");
            num = 10;
        } else {
            this.e.reply(`${num > 10 ? "色批，一次最多十张！" : ""}探索中，请稍等`);
        }
        if (num > 10) num = 10;
        console.log(num);
        let msgList = [];
        const forwarder = botsender ?
            {
                nickname: Bot.nickname,
                user_id: Bot.uin
            } :
            {
                nickname: this.e.sender.card || this.e.user_id,
                user_id: this.e.user_id,
            };

        for (let i = 0; i < num; i++) {
            msgList.push({
                // message: segment.image("https://dev.iw233.cn/api.php?sort=random")
                message: segment.image(imageUrl),
                ...forwarder,
            });
            // await common.sleep(300)
        }

        let res;
        if (e.isGroup)
            res = await e.reply([await e.group.makeForwardMsg(msgList)], false, {
                recallMsg: wocwithdrawTimer,
            });
        else
            res = await e.reply([await e.friend.makeForwardMsg(msgList)], false, {
                recallMsg: wocwithdrawTimer,
            });
        console.log("res:", res);

        if (!res) {
            e.reply("别等了，你想要的已经被来自mht的神秘力量吞噬了");
            return true;
        }

        currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        await redis.set(`Yz:wc:${this.e.group_id}`, currentTime, {
            EX: cd,
        });

        return true;
    }
}

// 递归检查并创建路径（如果路径不存在） =======================
async function checkpath(checkPath) {
    // 取上一级路径
    let symbol = "/";
    if (os.platform() == "win32") symbol = "\\";
    let tpath = checkPath.split(symbol);
    tpath.splice(-1);
    tpath = tpath.join(symbol);
    // console.log(tpath)
    // 如果不存在上一级路径
    if (!fs.existsSync(tpath)) {
        // 则递归处理
        await checkpath(tpath);
    }
    // 存在上一级路径时则创建本级路径
    // console.log("创建路径：", checkPath)
    if (!fs.existsSync(checkPath)) {
        fs.mkdirSync(checkPath);
    }
}