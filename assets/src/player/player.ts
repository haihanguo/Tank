// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import joystick from "../UI/joystick"
import fire_control from "../UI/fire_control"
import * as MathUtilities from './../MathUtilities'

const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {

    @property
    speed: number = 0;

    @property
    health_point :number = 100;
    @property
    shield_point : number = 100;

    @property(cc.Node)
    camera: cc.Node = null;

    @property(joystick)
    stick: joystick = null;

    @property(fire_control)
    aim_control: fire_control = null;

    @property(cc.Node)
    number_ui : cc.Node = null;
    

    @property(cc.Node)
    health_bar: cc.Node = null;


    @property(cc.Prefab)
    normal_bullet: cc.Prefab = null
    @property(cc.Prefab)
    muzzle_flash: cc.Prefab = null

    @property
    degree: number = 0;    

    @property
    auto_aim : boolean = false;

    @property(cc.Node)
    status_text: cc.Node = null;

    private offset: cc.Vec2 = cc.v2(0,0);
    private body: cc.RigidBody = null;
    private aim_lock: boolean = true;
    public aimed_enemy : cc.Node = null;
    public move_lock : boolean = false;

    public gold_amount :number = 0;
    public exp_amount : number = 0;

    onLoad () {
        this.node.zIndex = 0;
        this.body = this.getComponent(cc.RigidBody);
        
    }

    start () {
        if(this.camera != null){
            this.offset = this.camera.getPosition().subtract(this.node.getPosition());
        }
        
    }
    onCollisionEnter(other, self) {
        if (other.node.name === "dropitem"){
            let item = other.node.getComponent("drops");
            if(item.drop_type === "gold"){
                this.gold_amount += other.node.getComponent("drops").drop_amount;
                other.node.getComponent("drops").picked = true;
                this.updateGoldAmount();
                other.node.destroy();
            }            
        }
    }
    update (dt) {
        this.movePlayer();     
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
        let vx: number = this.speed * this.stick.dir.x;
        let vy: number = this.speed * this.stick.dir.y;
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
        console.log(this.aimed_enemy);
        if(this.aimed_enemy != null){
            this.castSpell();
        }else{
            this.spellTargetNotFound();
        }
    }
    castSpell(){        
        //console.log(this.node.getPosition());
        const new_spell : cc.Node = cc.instantiate(this.normal_bullet);
        new_spell.setPosition(this.node.getPosition());
        
        //set spell angel
        let angle : number = this.lookAtObj(this.aimed_enemy.getPosition());
        console.log(angle* 180 / Math.PI);
        this.flipPlayer(angle * 180 / Math.PI);

        new_spell.getComponent('fireball').aimed_enemy = this.aimed_enemy;
        if(this.getPlayerFaceDirection() === -1 ){
            new_spell.angle = 360 - angle * 180 / Math.PI; 
        }else{
            new_spell.angle = - angle * 180 / Math.PI; 
        }
        this.node.getParent().addChild(new_spell);
    }
    spellTargetNotFound(){
        this.status_text.getComponent('status_text').setText(this.getPlayerFaceDirection(), 'I need a target...');
    }  
    getClosestEnemy(){
        let enemies : cc.Node[] = this.node.parent.children.filter(function (e){
            return e.name == 'slime';
        });
        let min_distance : number = 200;
        let closest_enemy : cc.Node = null;
        enemies.forEach(function(value){
            let enemy_distance : number = this.distanceToObj(value.getPosition());
            if(enemy_distance < min_distance){
                min_distance = enemy_distance;
                closest_enemy = value;
            }
        }, this);
        return closest_enemy;
    }
    updateGoldAmount(){
        this.number_ui.getChildByName('gold').getComponent(cc.Label).string = "Gold: "+this.gold_amount;
    }
    updateExpAmount(){
        this.number_ui.getChildByName('exp').getComponent(cc.Label).string = "Exp: "+this.exp_amount;
    }
    lookAtObj(target : cc.Vec2){        
        let dx : number= target.x - this.node.x;
        let dy : number = target.y - this.node.y;
        //console.log(dx, dy);
        let dir: cc.Vec2 = cc.v2(dx,dy);
        let angle: number = dir.signAngle(cc.v2(1,0));
        return angle;
    }
	distanceToObj(target : cc.Vec2){
        let dx : number= target.x - this.node.x;
        let dy : number = target.y - this.node.y;
        let distance : number = Math.sqrt((dx*dx)+(dy*dy));
        return distance;
    } 
}
