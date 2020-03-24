// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import * as MathUtilities from './../MathUtilities'
import MathHelpers from './../MathUtilities'
import { Drop } from '../models/Drop';

//enum AiStatus {move, attack, idle};
@ccclass
export default class enemy extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    // Collider callbacks

    @property(cc.Prefab)
    aim_effect: cc.Prefab = null;
    @property(cc.Prefab)
    dead_effect: cc.Prefab = null;
    @property(cc.Prefab)
    flying_health_point = null;
    @property(cc.Prefab)
    item_drop : cc.Prefab = null;

    private basepath : string = 'assets/images/items/';
    public aimed : boolean = false;
    public on_move : boolean = false;
    public ai_status : MathUtilities.AiStatus = null;
    public time : number = null;
    public face_to_target : string = "right";

    public gold_drop_amount :  number = 0;

    public health_point :number = 0;
    public speed : number = 0;
    public attack_gap : number = 0;
    public alart_distance : number = 0;
    public attack_distance : number = 0;
    public mobs_level : number = 0;

    public drop_chance : Drop;
    public drop_list;
    
    onCollisionEnter(other, self) {
        if (other.node.name === "fireball") { 
            this.health_point -= 20;
            this.flyHealthPoint(20);
            other.node.destroy();
        }
    }
    onLoad () {
        this.node.zIndex = -1;        
        console.log('add enemy');
        
    }
    attachTouchEvent(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.changeAimedStatus, this);
    }
    start () {
        
    }
    setupVerlocity(speed_scale? : number){
        if(speed_scale == null){
            speed_scale = 1;
        }
        var target_dir : number = this.lookAtObj(this.node.getParent().getChildByName('player').getPosition());
        this.faceToTargetFaceDirection()
        var body : cc.RigidBody = this.node.getComponent(cc.RigidBody)
        body.linearVelocity = cc.v2(Math.cos(target_dir) * this.speed * speed_scale, Math.sin(-target_dir) *  this.speed * speed_scale);
    }
    faceToTargetFaceDirection(){
        if(this.face_to_target == "left"){
            if(this.node.scaleX < 0){
                this.node.scaleX *= -1;
            }
        }else{
            if(this.node.scaleX > 0){
                this.node.scaleX *= -1;
            }
        }
    }
    enemyMove(){
        this.setupVerlocity();
        this.playAnimation();
    }
    enemyAttack(){
        this.physicAttackPlayer();
    }
    enemyIdle(){
        this.setupVerlocity(0);
    }
    physicAttackPlayer(){
        let player : cc.Node = this.node.getParent().getChildByName('player');
        if(player.getComponent("player").shield_point > 50){
            player.getComponent("player").shield_point -= 50;
        }else{
            var attact_point_left :number = 0;
            attact_point_left = 50 - player.getComponent("player").shield_point;
            player.getComponent("player").shield_point = 0;
            player.getComponent("player").health_point -= attact_point_left;
        }     

        let attack_dir = player.getPosition().subtract(this.node.getPosition());
        attack_dir = attack_dir.normalizeSelf();
        player.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(attack_dir.x, attack_dir.y), player.convertToWorldSpaceAR(player.getPosition()), true);
        
    }
    update(dt) {

    }
    flyHealthPoint(show_number : number){
        let flying_health_point : cc.Node = cc.instantiate(this.flying_health_point);        
        flying_health_point.getComponent(cc.Label).string = "-" + show_number;
        flying_health_point.setPosition(this.node.getPosition());
        this.node.parent.addChild(flying_health_point);        
    }
    lookAtObj(target : cc.Vec2){        
        var dx : number= target.x - this.node.x;
        var dy : number = target.y - this.node.y;
        if(dx > 0){
            this.face_to_target = "left";
        }else{
            this.face_to_target = "right";
        }
        this.face_to_target
        //console.log(dx, dy);
        var dir: cc.Vec2 = cc.v2(dx,dy);
        var angle: number = dir.signAngle(cc.v2(1,0));
        return angle;
    }
    playAnimation(){
        //console.log('play!');
        var slime_animation : cc.Animation = this.node.getComponent(cc.Animation);
        if(this.ai_status === MathUtilities.AiStatus.move){
            if(slime_animation.getAnimationState('slime_move').isPlaying === false){
                slime_animation.play('slime_move')
            }
        }else if(this.ai_status === MathUtilities.AiStatus.idle){
            if(slime_animation.getAnimationState('slime_idle').isPlaying === false){
                slime_animation.play('slime_idle')
            }
        }else if(this.ai_status === MathUtilities.AiStatus.attack){
            if(slime_animation.getAnimationState('slime_attack').isPlaying === false){
                slime_animation.play('slime_attack')
            }
        }
    }
    checkHealthPoint(){
        if (this.health_point <= 0){
            const dead_effect : cc.Node = cc.instantiate(this.dead_effect);
            dead_effect.setPosition(this.node.getPosition());
            this.node.parent.addChild(dead_effect);

            //const item_drop : cc.Node = cc.instantiate(this.item_drop);
            //item_drop.getComponent('drops').setDropDetails('gold', this.gold_drop_amount);
            //item_drop.setPosition(this.node.getPosition());
            //this.node.parent.addChild(item_drop);


            this.node.destroy()
        }else{
            return;
        } 
    }
    getDropDetails(){

    }
    addAimed(){        
        const aim_icon : cc.Node = cc.instantiate(this.aim_effect);
        this.node.addChild(aim_icon);
        
        this.node.getParent().getChildByName('player').getComponent('player').aimed_enemy = this.node;
        console.log(this.node, this.node.uuid, this.node.getParent().getChildByName('player').getComponent('player').aimed_enemy);
    }
    removeAimed(){
        this.node.getChildByName('aimed').destroy();
        this.node.getParent().getChildByName('player').getComponent('player').aimed_enemy = null;
    }
    setAimed(playerAim : boolean){
        if(playerAim){
            this.aimed = true;
        }else{
            this.aimed = false;
        }
    }
    changeAimedStatus(){
        //see if there is an enemy is aimed
        let aimed_enemy : cc.Node[] = this.node.parent.children.filter(function (e){
            return e.getChildByName("aimed");
        });
        //there is an aimed enemy
        if(aimed_enemy.length > 0){
            //if it is self
            if(aimed_enemy[0].uuid === this.node.uuid){
                this.removeAimed();
            }else{
                aimed_enemy[0].getComponent('enemy').removeAimed();
                this.addAimed();                
            }
        }else{
            this.addAimed();
        }
        
    }

    getGoldDrop(chance : Drop) {

        let base_gold = 10;
        let gold_1 = (this.mobs_level + base_gold) * 10;
        let gold_2 = (this.mobs_level + base_gold) * 20;
        let gold_3 = (this.mobs_level + base_gold) * 40;

        let total_weight :number = chance.GoldP1 + chance.GoldP2 + chance.GoldP3;
        let weight_result :number= MathHelpers.getRandomInt(total_weight);
        let gold_drop :number = 0;
        if(weight_result <= chance.GoldP1){
            gold_drop = MathHelpers.getRandomInt(gold_1);
        }else if( weight_result > chance.GoldP1 && weight_result < (chance.GoldP1 + chance.GoldP2)){
            gold_drop = MathHelpers.getRandomInt(gold_2);
        }else{
            gold_drop = MathHelpers.getRandomInt(gold_3);
        }
        let goldname :string = '';
        if(gold_drop < 100){
            goldname = 'golds/coin_01d';
        }else if(gold_drop < 200){
            goldname = 'golds/coin_02d';
        }else if(gold_drop < 400){
            goldname = 'golds/coin_03d';
        }else if(gold_drop < 700){
            goldname = 'golds/coin_04d';
        }else if(gold_drop < 1500){
            goldname = 'golds/coin_05d';
        }
        
        let item_drop : cc.Node = cc.instantiate(this.item_drop);
        item_drop.getComponent('drops').setGoldDropDetails(this.basepath+goldname, gold_drop+1);
        return item_drop;
    }

    getConsumDrop(chance : Drop) {

        let result = new Array();

        let base_amount = 1;
        let amount_1 = base_amount;
        let amount_2 = (base_amount+1)*2;
        let amount_3 = (base_amount+2)*2;

        let total_weight :number = chance.ConsumP1 + chance.ConsumP2 + chance.ConsumP3;
        let weight_result :number= MathHelpers.getRandomInt(total_weight);
        let amount_drop :number = 0;
        if(weight_result <= chance.ConsumP1){
            amount_drop = MathHelpers.getRandomInt(amount_1);
        }else if( weight_result > chance.ConsumP1 && weight_result < (chance.ConsumP1 + chance.ConsumP2)){
            amount_drop = MathHelpers.getRandomInt(amount_2);
        }else{
            amount_drop = MathHelpers.getRandomInt(amount_3);
        }

        //random different consume type
        let hp_drop = MathHelpers.getRandomInt(amount_drop);
        let mp_drop = amount_drop - hp_drop;

        for(let i = 0; i < hp_drop; i++){
            let item_drop : cc.Node = cc.instantiate(this.item_drop);
            item_drop.getComponent('drops').setDropDetails(101);
            result.push(item_drop);
        }
        for(let i = 0; i < mp_drop; i++){
            let item_drop : cc.Node = cc.instantiate(this.item_drop);
            item_drop.getComponent('drops').setDropDetails(104);
            result.push(item_drop);
        }
        return result;
    }

    onDestroy(){
        if(this.node.getParent().getChildByName('player').getComponent('player').aimed_enemy === this.node){
            this.node.getParent().getChildByName('player').getComponent('player').aimed_enemy = null;
        }
        this.node.getParent().getChildByName('player').getComponent('player').exp_amount += 10;
        this.node.getParent().getChildByName('player').getComponent('player').updateExpAmount();
        this.dropItem();
    }

    dropItem(){
        this.drop_list.forEach(element => {
            element.setPosition(this.node.getPosition());
            this.node.getParent().addChild(element);
        });
        
    }
}
