// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import * as MathUtilities from './../MathUtilities'

const {ccclass, property} = cc._decorator;

@ccclass
export default class slime extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    // Collider callbacks
    @property
    health_point :number = 0;

    @property
    speed : number = 200;

    @property(cc.Prefab)
    aim_icon: cc.Prefab = null

    private aimed : boolean = false;
    private onMove : boolean = false;

	onBeginContact(contact, selfCollider, otherCollider) {
        console.log(otherCollider.node);
		if (otherCollider.node.name === "tank_bullet") {
			this.health_point -= 20;
			otherCollider.node.destroy();
		}else if(otherCollider.node.name === "background"){
            //selfCollider.node.destroy();
        }
	}
    // onLoad () {}

    start () {

    }
    lookAtObj(target : cc.Vec2){        
        var dx : number= target.x - this.node.x;
        var dy : number = target.y - this.node.y;
        //console.log(dx, dy);
        var dir: cc.Vec2 = cc.v2(dx,dy);
        var angle: number = dir.signAngle(cc.v2(1,0));
        return angle;
    }
    distanceToObj(target : cc.Vec2){
        var dx : number= target.x - this.node.x;
        var dy : number = target.y - this.node.y;
        var distance : number = (dx*dx)+(dy*dy);
        return distance;
    }
    setupVerlocity(){
        var target_dir : number = this.lookAtObj(this.node.getParent().getChildByName('player').getPosition());
        //this.node.angle = 360 - target_dir / Math.PI * 180;
        var body : cc.RigidBody = this.node.getComponent(cc.RigidBody)
        body.linearVelocity = cc.v2(Math.cos(target_dir) * this.speed, Math.sin(-target_dir) *  this.speed);
    }
    playAnimation(){
        var body : cc.RigidBody = this.node.getComponent(cc.RigidBody)
        if(body.linearVelocity != cc.v2(0.0)){
            var slime_animation : cc.Animation = this.node.getComponent(cc.Animation);
            if(slime_animation.getAnimationState('slime_move').isPlaying === false){
                slime_animation.play('slime_move')
            }
        }
    }
    checkHealthPoint(){
        if (this.health_point <= 0){
            this.node.destroy()
        }else{
            return;
        } 
    }
    addAimed(){
        const aim_icon : cc.Node = cc.instantiate(this.aim_icon);
        this.node.addChild(aim_icon);
    }
    removeAimed(){
        this.node.getChildByName('aimed').destroy();
    }
    setAimed(playerAim : boolean){
        if(playerAim){
            this.aimed = true;
        }else{
            this.aimed = false;
        }
    }
    update(dt) {
        if(this.aimed && this.node.getChildByName('aimed') == null){
            this.addAimed();
        }else if(!this.aimed && this.node.getChildByName('aimed') != null){
            this.removeAimed();
        }
        this.setupVerlocity();
        this.playAnimation();
        this.checkHealthPoint();
        //console.log(this.distanceToObj(this.node.getParent().getChildByName('player').getPosition()));
    }
}
