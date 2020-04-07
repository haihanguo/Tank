// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import joystick from "../UI/joystick"
import fire_control from "../UI/fire_control"
import MathHelpers, * as MathUtilities from './../MathUtilities'
import { ItemType } from "../models/Item";
import { PlayerModel } from "../models/PlayerModel";
import { Spell } from "../models/Spell";

const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {



    @property
    health_point :number = 100;
    @property
    shield_point : number = 100;

    @property(cc.Node)
    game: cc.Node = null;

    @property(cc.Node)
    spell_pool: cc.Node = null;

    @property(cc.Node)
    camera: cc.Node = null;

    @property(joystick)
    stick: joystick = null;

    @property(fire_control)
    aim_control: fire_control = null;    

    @property(cc.Node)
    status_bar: cc.Node = null;

    @property(cc.Prefab)
    flying_health_point = null;

    @property(cc.Node)
    bag : cc.Node = null;

    @property
    degree: number = 0;    

    @property
    auto_aim : boolean = false;

    @property(cc.Node)
    status_text: cc.Node = null;


    //player status
    private Player : PlayerModel = null;

    private offset: cc.Vec2 = cc.v2(0,0);
    private body: cc.RigidBody = null;
    private aim_lock: boolean = true;
    public aimed_enemy : cc.Node = null;
    public move_lock : boolean = false;

    public gold_amount :number = 0;
    public exp_amount : number = 0;

    public speed: number = 0;
    
    private current_spell : Spell = null;

    onLoad () {
        this.node.zIndex = 0;
        this.body = this.getComponent(cc.RigidBody);
        this.initialPlayer();
        this.current_spell = {...this.game.getComponent("game").getSpell(1)};
        this.setInGameSpell();      
        console.log(this.current_spell);      
    }

    start () {
        if(this.camera != null){
            this.offset = this.camera.getPosition().subtract(this.node.getPosition());
        }
        
    }
    onCollisionEnter(other, self) {
        if (other.node.name === "dropitem"){
            let item = other.node.getComponent("dropitem");
            if(item.drop_type === "gold"){
                this.gold_amount += item.drop_amount;
                item.picked = true;
            }else if(item.drop_type ==="item"){
                this.bag.getComponent("bag_control").addItem(other.node, "dropitem");                
            }
            other.node.destroy();        
        }
    }
    update (dt) {
        this.movePlayer();
        this.updatePlayerLiveStatus();
    }
    movePlayer(){        
        if(this.camera != null){
            this.camera.setPosition(this.node.x + this.offset.x, this.node.y + this.offset.y);
        }

        this.flipPlayer();

        if(this.move_lock){
            this.body.linearVelocity = cc.v2(0,0);
            return;
        }
        let vx: number = this.Player.InGameAttributes.MoveSpeed * this.stick.dir.x;
        let vy: number = this.Player.InGameAttributes.MoveSpeed * this.stick.dir.y;
        this.body.linearVelocity = cc.v2(vx, vy);

        
        if(this.stick.dir.x === 0 && this.stick.dir.y === 0){
            this.body.linearVelocity = cc.v2(0,0);
            return;
        }
    }
    getPlayerFaceDirection(){        
        if(this.node.scaleX > 0){
            return 1;                         
        }else{
            return -1;            
        }
    }
    flipPlayer(player_angel? : number){
        //flip player image if angle > 180
        let r: number = Math.atan2(this.stick.dir.y, this.stick.dir.x);
        this.degree = r * 180 / Math.PI;

        if(player_angel == null){
            if(this.body.linearVelocity.x > 0){
                if(this.node.scaleX < 0){
                    this.node.scaleX *= -1.0;
                }
            }else if(this.body.linearVelocity.x < 0){
                if(this.node.scaleX > 0){
                    this.node.scaleX *= -1.0;
                }
            }
        }else{
            if(player_angel < 90 && player_angel > -90){
                if(this.node.scaleX < 0){
                    this.node.scaleX *= -1.0;
                }
            }else{
                if(this.node.scaleX > 0){
                    this.node.scaleX *= -1.0;
                }
            }
        }        
    }
    aimLock(){
        console.log('rotation locked!');
        this.aim_lock = true;
    }
    aimUnlock(){
        console.log('rotation unlocked!');
        this.aim_lock = false;
    }
    getAutoAimStatus(){
        return this.auto_aim;
    }
    playerShoot(){
        //console.log(this.aimed_enemy);
        if(this.aimed_enemy != null){
            if(this.Player.Mp > this.current_spell.ManaCost){
                this.castSpell();
            }else{
                this.setPlayerText("我没有足够的法力值...");
            }         
        }else{
            this.setPlayerText("我需要一个目标...");
        }
    }
    setInGameSpell(){
        let current_mag = MathHelpers.getRandomIntWithLuck((this.Player.InGameAttributes.MagAttackMax - this.Player.InGameAttributes.MagAttackMin), this.Player.InGameAttributes.Luck)+this.Player.InGameAttributes.MagAttackMin;
        this.current_spell.InGameDamage = this.current_spell.Damage + current_mag * this.current_spell.AttributeWeight;
        //console.log(current_mag, this.current_spell.InGameDamage);
    }
    castSpell(){
        let new_spell : cc.Node = null;
        this.spell_pool.children.forEach(element => {
            if(element.getChildByName(this.current_spell.ScriptName)!= null){
                new_spell = cc.instantiate(element);
                return;
            }            
        });
        if(new_spell === null){
            //no spell found
            return;
        }
        new_spell.active = true;
        new_spell.setPosition(this.node.getPosition());
        this.setInGameSpell();
        new_spell.getComponent(this.current_spell.ScriptName).setSpell(this.current_spell);
        //set spell angel
        let angle : number = MathHelpers.lookAtObj(this.aimed_enemy.getPosition(), this.node.getPosition());
        //console.log(angle* 180 / Math.PI);
        this.flipPlayer(angle * 180 / Math.PI);
        new_spell.getComponent(this.current_spell.ScriptName).aimed_enemy = this.aimed_enemy;
        if(this.getPlayerFaceDirection() === -1 ){
            new_spell.angle = 360 - angle * 180 / Math.PI; 
        }else{
            new_spell.angle = - angle * 180 / Math.PI; 
        }
        this.game.addChild(new_spell);
        new_spell.getComponent(this.current_spell.ScriptName).cast();
        this.Player.Mp -= this.current_spell.ManaCost;
    }
    setPlayerText(text : string){
        this.status_text.getComponent('status_text').setText(this.getPlayerFaceDirection(), text);
    }
    attacked(attackPoint : number){
        attackPoint = attackPoint - MathHelpers.getRandomInt(this.Player.InGameAttributes.DefenceMax - this.Player.InGameAttributes.DefenceMin) + this.Player.InGameAttributes.DefenceMin;
        if(attackPoint > 0){
            this.Player.Hp -= attackPoint;
            this.flyHealthPoint(attackPoint);
        }else{
            this.Player.Hp --;
            this.flyHealthPoint(1);
        }
    }
    flyHealthPoint(show_number : number){
        let flying_health_point : cc.Node = cc.instantiate(this.flying_health_point);        
        flying_health_point.getComponent(cc.Label).string = "-" + show_number;
        flying_health_point.setPosition(this.node.getPosition());
        this.node.parent.addChild(flying_health_point);        
    }

    getClosestEnemy(){
        let enemies : cc.Node[] = this.game.children.filter(function (e){
            return e.name == 'slime';
        });
        let min_distance : number = 200;
        let closest_enemy : cc.Node = null;
        enemies.forEach(function(value){
            let enemy_distance : number = MathHelpers.distanceToObj(value.getPosition(), this.node);
            if(enemy_distance < min_distance){
                min_distance = enemy_distance;
                closest_enemy = value;
            }
        }, this);
        return closest_enemy;
    }
    initialPlayer(){
        this.Player = new PlayerModel(this.node.uuid);
        this.updatePlayerStatus();
    }
    getPlayer(){
        return this.Player;
    }
    getLoadedSpell(){
        return this.current_spell;
    }
    gainExp(amount : number){
        this.Player.Exp += amount;
    }
    updatePlayerStatus(){
        this.Player.BaseAttributes = PlayerModel.getBaseAttribute(this.Player.Level);
        this.Player.EquipmentAttributes = PlayerModel.getEquipmentAttribute(this.Player.EquipmentItem);
        this.Player.InGameAttributes = PlayerModel.getInGameAttribute(this.Player.BaseAttributes, this.Player.EquipmentAttributes);
    }
    updatePlayerLiveStatus(){
        this.status_bar.getChildByName('hp_bar').getComponent(cc.Sprite).fillStart =  this.Player.Hp / this.Player.InGameAttributes.MaxHp;
        this.status_bar.getChildByName('mp_bar').getComponent(cc.Sprite).fillStart =  this.Player.Mp / this.Player.InGameAttributes.MaxMana;
        this.status_bar.getChildByName('exp_bar').getComponent(cc.Sprite).fillStart = this.Player.Exp / this.Player.ExpToNext;
        //this.health_bar.getComponent(cc.Sprite).fillRange = this.Player.Hp / this.Player.InGameAttributes.MaxHp;
    }
}
