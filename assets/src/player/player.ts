// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import joystick from "./../joystick"
import fire_control from "./../fire_control"
import * as MathUtilities from './../MathUtilities'

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
    @property(cc.Prefab)
    muzzle_flash: cc.Prefab = null

    @property
    degree: number = 0;    

    @property
    auto_aim : boolean = true;

    private offset: cc.Vec2 = cc.v2(0,0);
    private body: cc.RigidBody = null;
    private aim_lock: boolean = true;
    private aimed_enemy_uid : string = "";

    onLoad () {
        this.node.zIndex = 0;
        this.body = this.getComponent(cc.RigidBody);
    }

    start () {
        if(this.camera != null){
            this.offset = this.camera.getPosition().subtract(this.node.getPosition());
        }
        
    }
    
    update (dt) {
        this.flipPlayer();
        this.movePlayer();                       
    }

    movePlayer(){        
        if(this.camera != null){
            this.camera.setPosition(this.node.x + this.offset.x, this.node.y + this.offset.y);
        }

        let vx: number = this.speed * this.stick.dir.x;
        let vy: number = this.speed * this.stick.dir.y;
        this.body.linearVelocity = cc.v2(vx, vy);

        //console.log(this.node.getChildByName('handgun').angle);
        this.autoAim();        
        this.rotateWeapon();

        if(this.stick.dir.x === 0 && this.stick.dir.y === 0){
            this.body.linearVelocity = cc.v2(0,0);
            return;
        }
    }

    rotateWeapon(){
        if(this.aim_lock === false){
            if(this.getPlayerFaceDirection() === 'left'){
                this.node.getChildByName('handgun').angle = 180 - this.degree; 
            }else{
                this.node.getChildByName('handgun').angle = this.degree; 
            }
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
        //flip player image if angle > 180
        let r: number = Math.atan2(this.stick.dir.y, this.stick.dir.x);
        this.degree = r * 180 / Math.PI;

        let player_weapon :cc.Node = this.node.getChildByName('handgun');
        let player_wepeon_firepoint : cc.Node = player_weapon.getChildByName('firepoint');
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
        let player_weapon :cc.Node = this.node.getChildByName('handgun');
        let player_wepeon_firepoint : cc.Node = player_weapon.getChildByName('firepoint');
        let firepoint_world_position :cc.Vec2 = player_weapon.convertToWorldSpaceAR(player_wepeon_firepoint.getPosition());
        let firepoint_player_position : cc.Vec2 = this.node.convertToNodeSpaceAR(firepoint_world_position);
        
        let angle :number = player_weapon.angle;

        let bullet_position : cc.Vec2 = firepoint_player_position;
        const new_bullet : cc.Node = cc.instantiate(this.normal_bullet);
        //console.log(player_weapon.angle, firepoint_player_position.x, firepoint_player_position.y, bullet_position.x, bullet_position.y);
        new_bullet.setPosition(bullet_position.x * 0.5, bullet_position.y * 0.5);
        new_bullet.angle = angle;
        const bullet_body : cc.RigidBody = new_bullet.getComponent(cc.RigidBody);
        bullet_body.linearVelocity = cc.v2(MathUtilities.sind(-(new_bullet.angle+270)) * new_bullet.getComponent('normal_bullet').bullet_speed, 
                                            MathUtilities.cosd(new_bullet.angle+270) * new_bullet.getComponent('normal_bullet').bullet_speed);	
        if(this.getPlayerFaceDirection() === "right"){
            bullet_body.linearVelocity = cc.v2(MathUtilities.sind(-(new_bullet.angle+270)) * new_bullet.getComponent('normal_bullet').bullet_speed, 
                                            MathUtilities.cosd(new_bullet.angle+270) * new_bullet.getComponent('normal_bullet').bullet_speed);            
        }else{
            //new_bullet.scaleX *= -1.0;
            bullet_body.linearVelocity = cc.v2(MathUtilities.sind((new_bullet.angle+270)) * new_bullet.getComponent('normal_bullet').bullet_speed, 
                                            MathUtilities.cosd(new_bullet.angle+270) * new_bullet.getComponent('normal_bullet').bullet_speed);	
        }
        this.node.addChild(new_bullet);
        this.createMuzzleflash(firepoint_player_position, new_bullet.angle);

    }

    createMuzzleflash(flash_position : cc.Vec2, flash_angel : number){
        const new_flash : cc.Node = cc.instantiate(this.muzzle_flash);
        new_flash.setPosition(flash_position.x * 1.5, flash_position.y * 1.5);
        new_flash.angle = flash_angel;
        this.node.addChild(new_flash);
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
        this.creatBullet();
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
    getClosestEnemy(){
        let enemies : cc.Node[] = this.node.parent.children.filter(function (e){
            return e.name == 'slime';
        });
        let min_distance : number = 500;
        let closest_enemy : cc.Node = null;
        enemies.forEach(function(value){
            let enemy_distance : number = this.distanceToObj(value.getPosition();
            if(enemy_distance < min_distance){
                min_distance = enemy_distance;
                closest_enemy = value;
            }
        }, this);
        return closest_enemy;
    }
    autoAim(){        
        let closest_enemy : cc.Node = this.getClosestEnemy();
        //console.log(closest_enemy);
        let angle: number = 0;
        let distance: number = 0;
        if(closest_enemy != null){
            //check if aimed the same enemy
            if(closest_enemy.uuid != this.aimed_enemy_uid){
                //new aim target
                if(this.aimed_enemy_uid != ''){
                    //remove old aim
                    let last_aimed_enemy : cc.Node = this.node.parent.getChildByUuid(this.aimed_enemy_uid);
                    if(last_aimed_enemy != null){
                        last_aimed_enemy.getComponent('slime').setAimed(false);
                    }
                }
                //add new aim
                closest_enemy.getComponent('slime').setAimed(true);
                this.aimed_enemy_uid = closest_enemy.uuid;
            }
            
            this.aim_lock = true;
            angle = this.lookAtObj(closest_enemy.getPosition());
            distance = this.distanceToObj(closest_enemy.getPosition());
        }else{
            this.aim_lock = false;
        }
        //console.log(angle * 180 / Math.PI, distance);
        if(this.getPlayerFaceDirection() === 'left'){
            this.node.getChildByName('handgun').angle = angle * 180 / Math.PI + 180; 
        }else{
            this.node.getChildByName('handgun').angle = - angle * 180 / Math.PI; 
        }
    }

}
