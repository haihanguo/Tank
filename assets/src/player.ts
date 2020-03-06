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

    onLoad () {
        this.body = this.getComponent(cc.RigidBody)
    }

    start () {
        if(this.camera != null){
            this.offset = this.camera.getPosition().subtract(this.node.getPosition());
        }
        
    }
    
    update (dt) {

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

        var r: number = Math.atan2(this.stick.dir.y, this.stick.dir.x);
        this.degree = r * 180 / Math.PI;
        
        //rotation clockwise
        //degree = 360 - degree;
        //degree = degree + 90;
        //this.node.rotation = degree;
        //angle counterclockwise 
        this.node.angle = this.degree - 90;        
    }

    createBullet() {
        var playerPosition : cc.Vec2 = this.node.getPosition();
        var angle :number = this.node.angle;
        var playerHeight :number = this.node.getChildByName('tank-body').getContentSize().height;
        var playerWidth :number = this.node.getChildByName('tank-body').getContentSize().width;
        console.log(this.node.getChildByName('tank-body').getContentSize());
        console.log(playerPosition.x, playerPosition.y);
        console.log(playerPosition.x + MathUtilities.sind(angle+180)*(playerWidth/2) , playerPosition.y + MathUtilities.cosd(angle)*(playerHeight/2));



        var bulletPosition : cc.Vec2 = cc.v2(playerPosition.x + MathUtilities.sind(angle+180)*(playerWidth/2+30) , playerPosition.y + MathUtilities.cosd(angle)*(playerHeight/2+30));
		const newBullet = cc.instantiate(this.normal_bullet)
        newBullet.setPosition(bulletPosition);
        newBullet.angle = angle;
        const body = newBullet.getComponent(cc.RigidBody);
        //console.log(this.degree);
		body.linearVelocity = cc.v2(MathUtilities.sind(-angle) * newBullet.getComponent('normal_bullet').bullet_speed, MathUtilities.cosd(angle) * newBullet.getComponent('normal_bullet').bullet_speed);	
        this.node.parent.addChild(newBullet);      
	}
}
