// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import enemy from './enemy'
import * as MathUtilities from './../MathUtilities'
const {ccclass, property} = cc._decorator;
@ccclass
export default class slime extends enemy {


    onLoad () {

    }

    start () {
        this.ai_status = MathUtilities.AiStatus.idle;
        this.time = new Date().getTime();
    }

    update(dt) {
        if(this.aimed && this.node.getChildByName('aimed') == null){
            this.addAimed();
        }else if(!this.aimed && this.node.getChildByName('aimed') != null){
            this.removeAimed();
        }
        this.checkHealthPoint();
        console.log(this.ai_status);
        if (this.ai_status == MathUtilities.AiStatus.move) {
            this.enemyMove();
            let newTime = new Date().getTime();
            if ((newTime - this.time) >= this.attack_gap * 1000) {
                this.attackPlayer();//攻击玩家
                this.ai_status = MathUtilities.AiStatus.attack;
                this.time = newTime;
            }
        }else if (this.ai_status == MathUtilities.AiStatus.attack) {
            //this.enemyMove();
            let newTime = new Date().getTime();
            if ((newTime - this.time) >= 0.2 * 1000) {
                this.time = newTime;
                this.ai_status = MathUtilities.AiStatus.idle;//变更为行走状态
                //this.node.getComponent(cc.Animation).play("monster2_1");//播放动画
            }
        }else if(this.ai_status == MathUtilities.AiStatus.idle){
            this.enemyIdle();
            let newTime = new Date().getTime();
            if ((newTime - this.time) >= 0.5 * 1000) {
                this.time = newTime;
                this.ai_status = MathUtilities.AiStatus.move;//变更为行走状态
                //this.node.getComponent(cc.Animation).play("monster2_1");//播放动画
            }
        }
    }
}
