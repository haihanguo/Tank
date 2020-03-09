// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import * as MathUtilities from './MathUtilities'

const {ccclass, property} = cc._decorator;

@ccclass
export default class zombie extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    // Collider callbacks
    @property
    health_point :number = 0;

    @property
    move : boolean = false;

    @property
    speed : number = 200;

	onBeginContact(contact, selfCollider, otherCollider) {
        console.log(otherCollider.node);
		if (otherCollider.node.name === "tank_bullet") {
			this.health_point -= 20;
			otherCollider.node.destroy();
		}else if(otherCollider.node.name === "background"){
            selfCollider.node.destroy();
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
    update(dt) {
        var target_dir : number = this.lookAtObj(this.node.getParent().getChildByName('player').getPosition());
        this.node.angle = 360 - target_dir / Math.PI * 180;
        const body = this.node.getComponent(cc.RigidBody)
        body.linearVelocity = cc.v2(Math.cos(target_dir) * this.speed, Math.sin(-target_dir) *  this.speed);

        if(body.linearVelocity != cc.v2(0.0)){
            var zombie_animation : cc.Animation = this.node.getComponent(cc.Animation);
            if(zombie_animation.getAnimationState('zombie_move').isPlaying === false){
                zombie_animation.play('zombie_move')
            }
        }

        if (this.health_point <= 0){
            this.node.destroy()
        }else{
            return;
        } 
    }
}
