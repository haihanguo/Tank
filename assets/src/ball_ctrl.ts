// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import joystick from "./joystick"

const {ccclass, property} = cc._decorator;

@ccclass
export default class ball_ctrl extends cc.Component {

    @property
    speed: number = 0;

    @property(cc.Node)
    camera: cc.Node = null;

    @property(joystick)
    stick: joystick = null;

    private offset: cc.Vec2 = cc.v2(0,0);
    private body: cc.RigidBody = null;
    // LIFE-CYCLE CALLBACKS:

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
        var degree: number = r * 180 / Math.PI;
        
        //rotation clockwise
        degree = 360 - degree;
        degree = degree + 90;
        this.node.rotation = degree;
        //angle counterclockwise 
        //this.node.angle = degree - 90;
    }
}
