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

    public distance_to_player : number = null;
    public ready_attack : boolean = false;
    onLoad () {
        this.attachTouchEvent()
        this.ai_status = MathUtilities.AiStatus.idle;
        this.node.getComponent(cc.Animation).play("slime_idle");
    }

    start () {

        this.time = new Date().getTime();
    }

    update(dt) {
        this.checkHealthPoint();
        this.distance_to_player = this.distanceToObj(this.node.getParent().getChildByName('player').getPosition());
        if(this.distance_to_player >= 600){
            this.ai_status = MathUtilities.AiStatus.idle;
            this.enemyIdle();
            if(!this.node.getComponent(cc.Animation).getAnimationState('slime_idle').isPlaying){
                this.node.getComponent(cc.Animation).play("slime_idle");
            }
        }else if(this.ai_status === MathUtilities.AiStatus.move || (this.distance_to_player < 400 && this.distance_to_player > 20)){
            console.log(this.distance_to_player);
            this.enemyMove();
            this.ai_status = MathUtilities.AiStatus.move;
            this.node.getComponent(cc.Animation).getAnimationState('slime_move').play;
        }else if(this.ai_status === MathUtilities.AiStatus.attack){
            if(this.node.getChildByName('exclamation_point').getChildByName('exclamation')== null){
                const prepare_attack_effect : cc.Node = cc.instantiate(this.prepare_attack_effect);
                this.node.getChildByName('exclamation_point').addChild(prepare_attack_effect);
            }
        }
    }
}
