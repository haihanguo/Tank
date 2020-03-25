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
        this.attachTouchEvent();
        
        this.game_node = this.node.parent.getComponent('game');
        this.mobs_level = 1;
        //setup mob properties
        //this.node.parent.getComponent('game').getItem();
        this.health_point = 100;
        this.speed = 50;
        
        
        this.ai_status = MathUtilities.AiStatus.idle;
        this.node.getComponent(cc.Animation).play("slime_idle");
        this.alart_distance = 400;
        this.attack_distance = 50;

        //setup drops
        this.drop_list = new Array();

        this.drop_chance = this.game_node.getDrop('normaldrop');
        this.drop_list.push(this.getGoldDrop(this.drop_chance));

        let consum_droplist = this.getConsumDrop(this.drop_chance);
        if(consum_droplist.length > 0){
            this.drop_list = this.drop_list.concat(consum_droplist);
        }
        let equip_droplist = this.getEquipDrop(this.drop_chance);
        if(equip_droplist.length > 0){
            this.drop_list = this.drop_list.concat(equip_droplist);
        }
        console.log(this.drop_list);


        
        //this.node.parent.getComponent('game').item_list;
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
