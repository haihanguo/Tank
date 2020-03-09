// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import joystick from "./joystick"
import fire_control from "./fire_control"
import * as MathUtilities from './MathUtilities'

const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {

    @property
    speed: number = 0;

    @property(cc.Node)
    camera: cc.Node = null;

    @property(joystick)
    stick: joystick = null;

    @property(fire_control)
    aim_control: fire_control = null;

    @property(cc.Prefab)
    normal_bullet: cc.Prefab = null
    
    private offset: cc.Vec2 = cc.v2(0,0);
    private body: cc.RigidBody = null;
    // LIFE-CYCLE CALLBACKS:
    @property
    degree: number = 0;

    @property
    rotation_lock: boolean = true;

    onLoad () {
        this.node.zIndex = 0;
        this.body = this.getComponent(cc.RigidBody)
    }

    start () {
        if(this.camera != null){
            this.offset = this.camera.getPosition().subtract(this.node.getPosition());
        }
        
    }
    
    update (dt) {

        this.movePlayer();     
        //rotation clockwise
        //degree = 360 - degree;
        //degree = degree + 90;
        //this.node.rotation = degree;
        //angle counterclockwise 
        //console.log(this.degree);
               
    }

    movePlayer(){
        if(this.camera != null){
            this.camera.setPosition(this.node.x + this.offset.x, this.node.y + this.offset.y);
        }
        if(this.stick.dir.x === 0 && this.stick.dir.y === 0){
            this.body.linearVelocity = cc.v2(0,0);
            return;
        }
        var vx: number = this.speed * this.stick.dir.x;
        var vy: number = this.speed * this.stick.dir.y;
        this.body.linearVelocity = cc.v2(vx, vy);

        //if(this.rotation_lock == false){

        //}
        //flip player image if angle > 180
        var r: number = Math.atan2(this.stick.dir.y, this.stick.dir.x);
        this.degree = r * 180 / Math.PI;
        //console.log(this.node.getChildByName('handgun').angle);
        this.flipPlayer();
        if(this.getPlayerFaceDirection() === 'left'){
            this.node.getChildByName('handgun').angle = 180 - this.degree; 
        }else{
            this.node.getChildByName('handgun').angle = this.degree; 
        }
    }
    getPlayerFaceDirection(){        
        if(this.node.scaleX > 0){
            return 'right';                         
        }else{
            return 'left';            
        }
    }

    flipPlayer(){
        var player_weapon :cc.Node = this.node.getChildByName('handgun');
        var player_wepeon_firepoint : cc.Node = player_weapon.getChildByName('firepoint');
        //check if gun point position x larger than gun position x
        //console.log(player_weapon.angle);
        if(player_weapon.convertToWorldSpaceAR(player_wepeon_firepoint.getPosition()).x - player_weapon.convertToWorldSpaceAR(player_weapon.getPosition()).x > 0){
            if(!(player_weapon.angle > 80 && player_weapon.angle < 100)){
                if(this.node.scaleX < 0){
                    this.node.scaleX *= -1.0;
                }
            }            
        }else{
            if(!(player_weapon.angle > 80 && player_weapon.angle < 100)){
                if(this.node.scaleX > 0){
                    this.node.scaleX *= -1.0;
                }
            }
        }
    }
    creatBullet() {
        var player_weapon :cc.Node = this.node.getChildByName('handgun');
        var player_wepeon_firepoint : cc.Node = player_weapon.getChildByName('firepoint');
        var firepoint_world_position :cc.Vec2 = player_wepeon_firepoint.convertToWorldSpaceAR(player_wepeon_firepoint.getPosition());
        var firepoint_player_position : cc.Vec2 = this.node.convertToNodeSpaceAR(firepoint_world_position);

        
        var angle :number = player_weapon.angle;
        var offset : number = 50;
        firepoint_player_position.x += offset * MathUtilities.sind(-angle+90)
        firepoint_player_position.y += offset * MathUtilities.cosd(angle+90)

        var bullet_position : cc.Vec2 = firepoint_player_position;
        const new_bullet : cc.Node = cc.instantiate(this.normal_bullet);
        console.log(player_weapon.angle, firepoint_player_position.x, firepoint_player_position.y, bullet_position.x, bullet_position.y);
        new_bullet.setPosition(bullet_position);
        //new_bullet.setScale(0.33);
        new_bullet.angle = angle;
        const bullet_body : cc.RigidBody = new_bullet.getComponent(cc.RigidBody);
        //bullet_body.linearVelocity = cc.v2(MathUtilities.sind(-new_bullet.angle) * new_bullet.getComponent('normal_bullet').bullet_speed, MathUtilities.cosd(new_bullet.angle) * new_bullet.getComponent('normal_bullet').bullet_speed);	
        if(this.getPlayerFaceDirection() === "left"){
            new_bullet.scaleX *= -1.0;
        }
        this.node.addChild(new_bullet);

        //var playerPosition : cc.Vec2 = this.node.getPosition();
        //var angle :number = this.node.angle-90;

        //console.log(this.node.getChildByName('body').getContentSize());
        //console.log(playerPosition.x, playerPosition.y, angle);
        //console.log(playerPosition.x + MathUtilities.sind(angle+45)*(playerWidth/2) , playerPosition.y + MathUtilities.cosd(angle)*(playerHeight/2));



        //var bulletPosition : cc.Vec2 = cc.v2(playerPosition.x + MathUtilities.sind(angle+180)*((playerWidth)/2) , 
        //                                    playerPosition.y + MathUtilities.cosd(angle)*((playerHeight+15)/2)).add(cc.v2(10*MathUtilities.sind(angle+90),10*MathUtilities.sind(180-angle)));
        //console.log(bulletPosition.x, bulletPosition.y);
		//const newBullet = cc.instantiate(this.normal_bullet)
        //newBullet.setPosition(bulletPosition);
        //newBullet.angle = angle;
        //const body = newBullet.getComponent(cc.RigidBody);
        //console.log(this.degree);
		//body.linearVelocity = cc.v2(MathUtilities.sind(-newBullet.angle) * newBullet.getComponent('normal_bullet').bullet_speed, MathUtilities.cosd(newBullet.angle) * newBullet.getComponent('normal_bullet').bullet_speed);	
        //this.node.parent.addChild(newBullet);
    }

    lock_rotation(){
        console.log('rotation locked!');
        this.rotation_lock = true;
    }
    unlock_rotation(){
        console.log('rotation unlocked!');
        this.rotation_lock = false;
    }
    playerShoot(){
        this.creatBullet();
    }
}
