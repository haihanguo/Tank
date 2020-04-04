// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import enemy from './enemy'
import * as MathUtilities from './../MathUtilities'
import MathHelpers from './../MathUtilities'
import { Mob, MobModel } from '../models/Mob';
import { Drop, Gold } from '../models/Drop';

const {ccclass, property} = cc._decorator;
@ccclass
export default class slime extends enemy {

    private distance_to_player : number = null;
    private ready_attack : boolean = false;

    onLoad () {
        debugger
        this.node.zIndex = -1;
        this.attachTouchEvent();        
        this.game_node = this.node.parent.getComponent('game');
        this.mob_model = this.game_node.getMob(101);
        this.in_game_mob = new MobModel(this.mob_model.Id, this.mob_model.Name, this.mob_model);

        this.ai_status = MathUtilities.AiStatus.idle;
        this.node.getComponent(cc.Animation).play("slime_idle");
        
        this.drop_list = new Array();
        //setup drops
        this.drop_chance = this.game_node.getDrop('normaldrop');
        this.in_game_mob.GoldDrop = Drop.getGoldDrop(this.in_game_mob.GoldDrop.Amount, this.drop_chance);
        this.in_game_mob.ConsumeItemDropList = Drop.getConsumDrop(this.in_game_mob.ConsumeItemDropList, this.drop_chance);
        this.in_game_mob.EquipItemDropList = Drop.getEquipDrop(this.in_game_mob.EquipItemDropList, this.drop_chance);
        //this.node.parent.getComponent('game').item_list;
    }

    start () {
        this.time = new Date().getTime();
    }

    update(dt) {
        this.checkHealthPoint();
        this.distance_to_player = MathHelpers.distanceToObj(this.node.getParent().getChildByName('player').getPosition(), this.node.getPosition());

        //console.log(new Date().getTime() - this.time, this.ready_attack, this.distance_to_player)
        if(new Date().getTime() - this.time > this.in_game_mob.AttackGap * 1000){
            this.ready_attack = true;
        }

        
        if(this.distance_to_player >= this.in_game_mob.AlertDistance){
            this.ai_status = MathUtilities.AiStatus.idle;
            this.enemyIdle();            
        }else if(this.distance_to_player < (this.in_game_mob.AlertDistance-150) && this.distance_to_player > this.in_game_mob.AttackRange && this.node.getComponent(cc.Animation).getAnimationState('slime_attack').isPlaying === false){
            this.ai_status = MathUtilities.AiStatus.move;
            this.enemyMove();            
        }else if(this.distance_to_player <= this.in_game_mob.AttackRange && this.ready_attack){
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
