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
import { MobModel } from '../models/Mob';
import { PlayerModel } from '../models/PlayerModel';
import { Spell } from '../models/Spell';

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
    public mob_model : MobModel = null;
    public in_game_mob : MobModel = null;

    public aimed : boolean = false;
    public on_move : boolean = false;
    public ai_status : MathUtilities.AiStatus = null;
    public time : number = null;
    public face_to_target : string = "right";

    public game_node;
    public drop_chance : Drop;
    public drop_list;
    
    onCollisionEnter(other, self) {
        if (other.node.name === "spell") { 
            let spell_name = other.node.children[0].name;
            let spell : Spell = other.node.getComponent(spell_name).getSpell();
            this.in_game_mob.Hp -= spell.InGameDamage;
            this.flyHealthPoint(spell.InGameDamage);
            other.node.destroy();
            //this.node.
        }
    }
    attachTouchEvent(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.changeAimedStatus, this);
    }
    onLoad () {
        this.node.zIndex = -1;        
        console.log('add enemy');
        
    }
    start () {
        
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
    enemyIdle(){
        this.setupVerlocity(0);
    }
    enemyAttack(){
        console.log(this.in_game_mob.AttackRange);
        if(this.in_game_mob.AttackRange <= 50){
            this.meleeAttackPlayer();
        }        
    }
    setupVerlocity(speed_scale? : number){
        if(speed_scale == null){
            speed_scale = 1;
        }
        var target_dir : number = this.lookAtObj(this.node.getParent().getChildByName('player').getPosition());
        this.faceToTargetFaceDirection()
        var body : cc.RigidBody = this.node.getComponent(cc.RigidBody)
        body.linearVelocity = cc.v2(Math.cos(target_dir) * this.in_game_mob.MoveSpeed * speed_scale, Math.sin(-target_dir) *  this.in_game_mob.MoveSpeed * speed_scale);
    }
    meleeAttackPlayer(){
        let player : cc.Node = this.node.getParent().getChildByName('player');
        let attack_point = MathHelpers.getRandomInt(this.in_game_mob.AttackMax - this.in_game_mob.AttackMin) + this.in_game_mob.AttackMin;
        console.log(attack_point);
        player.getComponent("player").attacked(attack_point);  
    }
    getDropDetails(){

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
        if (this.in_game_mob.Hp <= 0){
            const dead_effect : cc.Node = cc.instantiate(this.dead_effect);
            dead_effect.setPosition(this.node.getPosition());
            this.node.parent.addChild(dead_effect);
            this.node.destroy()
        }else{
            return;
        } 
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

        let gold_1 = (this.mob_model.GoldDrop.Amount) * 1;
        let gold_2 = (this.mob_model.GoldDrop.Amount) * 2;
        let gold_3 = (this.mob_model.GoldDrop.Amount) * 4;

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
        item_drop.getComponent('dropitem').setGoldDropDetails(this.basepath+goldname, gold_drop+1);
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
        //for test
        //amount_drop = 5;
        //random different consume type
        let hp_drop = MathHelpers.getRandomInt(amount_drop);
        let mp_drop = amount_drop - hp_drop;

        
        for(let i = 0; i < hp_drop; i++){
            let item_drop : cc.Node = cc.instantiate(this.item_drop);
            item_drop.getComponent('dropitem').setItemDropDetails(this.game_node.getItemByID(101), item_drop.uuid);
            result.push(item_drop);
        }
        for(let i = 0; i < mp_drop; i++){
            let item_drop : cc.Node = cc.instantiate(this.item_drop);
            item_drop.getComponent('dropitem').setItemDropDetails(this.game_node.getItemByID(104), item_drop.uuid);
            result.push(item_drop);
        }
        return result;
    }
    getEquipDrop(chance : Drop) {
        
        let result = new Array();

        let base_amount = 0;
        let amount_1 = base_amount;
        let amount_2 = (base_amount+1)*2;
        let amount_3 = (base_amount+2)*2;

        let total_weight :number = chance.EquipP1 + chance.EquipP2 + chance.EquipP3;
        let weight_result :number= MathHelpers.getRandomInt(total_weight);
        let max_drop :number = 0;
        if(weight_result <= chance.EquipP1){
            max_drop = MathHelpers.getRandomInt(amount_1);
        }else if( weight_result > chance.EquipP1 && weight_result < (chance.EquipP1 + chance.EquipP2)){
            max_drop = MathHelpers.getRandomInt(amount_2);
        }else{
            max_drop = MathHelpers.getRandomInt(amount_3);
        }

        //random different consume type
        let amount_drop = MathHelpers.getRandomInt(max_drop);

        //for test
        //amount_drop = 5;
        for(let i = 0; i < amount_drop; i++){
            //item type code
            //2 weapon 3 armor 4 helmet 5 necklace 6 ring
            //generate random type:
            let typecode = MathHelpers.getRandomInt(4)+2;
            //generate random item
            //we only have 1 now
            let itemcode = 1;
            //generate random additional attributes
            //TODO
            let itemid = typecode.toString() + "0" + itemcode.toString();
            let item_drop : cc.Node = cc.instantiate(this.item_drop);
            item_drop.getComponent('dropitem').setItemDropDetails(this.game_node.getItemByID(Number(itemid)), item_drop.uuid);
            result.push(item_drop);
        }
        return result;
    }

    onDestroy(){
        if(this.node.getParent().getChildByName('player').getComponent('player').aimed_enemy === this.node){
            this.node.getParent().getChildByName('player').getComponent('player').aimed_enemy = null;
        }
        this.node.getParent().getChildByName('player').getComponent('player').gainExp(10);
        this.dropItem();
    }

    dropItem(){

        let item_drop : cc.Node = cc.instantiate(this.item_drop);
        item_drop.getComponent('dropitem').setGoldDropDetails(this.in_game_mob.GoldDrop.IconPath, this.in_game_mob.GoldDrop.Amount);
        this.drop_list.push(item_drop);

        this.in_game_mob.ConsumeItemDropList.forEach(element => {
            item_drop = cc.instantiate(this.item_drop);
            item_drop.getComponent('dropitem').setItemDropDetails(element, item_drop.uuid, this.game_node.getComponent("game").getItemSprite(element.Name));
            this.drop_list.push(item_drop);
        });

        this.in_game_mob.EquipItemDropList.forEach(element => {
            item_drop = cc.instantiate(this.item_drop);
            item_drop.getComponent('dropitem').setItemDropDetails(element, item_drop.uuid, this.game_node.getComponent("game").getItemSprite(element.Name));
            this.drop_list.push(item_drop);
        });

        let item_count = 0;
        let position_x = this.node.getPosition().x;
        let position_y = this.node.getPosition().y
        this.drop_list.forEach(element => {
            element.setPosition(cc.v2(MathUtilities.drop_array[item_count][0]*MathUtilities.drop_space+position_x, MathUtilities.drop_array[item_count][1]*MathUtilities.drop_space+position_y));
            this.node.getParent().addChild(element);
            item_count++;
        });
    }
}
