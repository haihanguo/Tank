// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import enemy from './enemy'
import * as MathUtilities from './../MathUtilities'
import MathHelpers from './../MathUtilities'

const {ccclass, property} = cc._decorator;
@ccclass
export default class slime extends enemy {

    public distance_to_player : number = null;
    public ready_attack : boolean = false;
    onLoad () {
        this.node.zIndex = -1;
        this.gold_drop_amount = MathHelpers.getGoldDrop(80,150,15,400,5,600);
        this.attachTouchEvent()
        this.ai_status = MathUtilities.AiStatus.idle;
        this.node.getComponent(cc.Animation).play("slime_idle");
        this.alart_distance = 400;
        this.attack_distance = 50;
    }

    start () {
        this.time = new Date().getTime();
    }

    update(dt) {
        this.checkHealthPoint();
        this.distance_to_player = MathHelpers.distanceToObj(this.node.getParent().getChildByName('player').getPosition(), this.node.getPosition());

        //console.log(new Date().getTime() - this.time, this.ready_attack, this.distance_to_player)
        if(new Date().getTime() - this.time > this.attack_gap * 1000){
            this.ready_attack = true;
        }

        
        if(this.distance_to_player >= this.alart_distance){
            this.ai_status = MathUtilities.AiStatus.idle;
            this.enemyIdle();            
        }else if(this.distance_to_player < (this.alart_distance-150) && this.distance_to_player > this.attack_distance && this.node.getComponent(cc.Animation).getAnimationState('slime_attack').isPlaying === false){
            this.ai_status = MathUtilities.AiStatus.move;
            this.enemyMove();            
        }else if(this.distance_to_player <= this.attack_distance && this.ready_attack){
            this.time = new Date().getTime();
            this.ready_attack = false;
            this.ai_status = MathUtilities.AiStatus.attack            
            this.enemyAttack();
        }else if(this.node.getComponent(cc.Animation).getAnimationState('slime_attack').isPlaying === false){
            this.ai_status = MathUtilities.AiStatus.move;
            this.enemyMove(); 
        }
        this.playAnimation();
    }
}
