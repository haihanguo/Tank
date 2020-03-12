// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import * as MathUtilities from './../MathUtilities'
//enum AiStatus {move, attack, idle};
@ccclass
export default class enemy extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    // Collider callbacks
    @property
    health_point :number = 0;

    @property
    speed : number = 0;

    @property
    attack_gap : number = 0;

    @property(cc.Prefab)
    aim_icon: cc.Prefab = null


    public aimed : boolean = false;
    public on_move : boolean = false;
    public ai_status : MathUtilities.AiStatus = null;
    public time : number = null;

	onBeginContact(contact, selfCollider, otherCollider) {
        //console.log(otherCollider.node);
		if (otherCollider.node.name === "tank_bullet") {
			this.health_point -= 20;
			otherCollider.node.destroy();
		}else if(otherCollider.node.name === "player" && this.ai_status ==MathUtilities.AiStatus.attack){
            console.log('attacked!');
            otherCollider.node.getComponent("player").health_point -= 10;
            //selfCollider.node.destroy();
        }
	}
    onLoad () {

    }

    start () {

    }

    setupVerlocity(speed_scale? : number){
        if(speed_scale == null){
            speed_scale = 1;
        }
        var target_dir : number = this.lookAtObj(this.node.getParent().getChildByName('player').getPosition());
        var body : cc.RigidBody = this.node.getComponent(cc.RigidBody)
        body.linearVelocity = cc.v2(Math.cos(target_dir) * this.speed * speed_scale, Math.sin(-target_dir) *  this.speed * speed_scale);
    }


    enemyMove(){
        this.setupVerlocity();
        this.playAnimation();
    }
    attackPlayer(){
        this.physicAttackPlayer();
    }
    enemyIdle(){
        this.setupVerlocity(0);
    }
    physicAttackPlayer(){
        this.setupVerlocity(10);
    }
    update(dt) {
        //if(this.aimed && this.node.getChildByName('aimed') == null){
        //    this.addAimed();
        //}else if(!this.aimed && this.node.getChildByName('aimed') != null){
        //    this.removeAimed();
        //}
        //this.setupVerlocity();
        //this.playAnimation();
        //this.checkHealthPoint();
        //console.log(this.distanceToObj(this.node.getParent().getChildByName('player').getPosition()));
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

    playAnimation(){
        var slime_animation : cc.Animation = this.node.getComponent(cc.Animation);
        if(this.ai_status == MathUtilities.AiStatus.move){
            if(slime_animation.getAnimationState('slime_move').isPlaying === false){
                slime_animation.play('slime_move')
            }
        }else if(this.ai_status == MathUtilities.AiStatus.idle){
            if(slime_animation.getAnimationState('slime_idle').isPlaying === false){
                slime_animation.play('slime_idle')
            }
        }else if(this.ai_status == MathUtilities.AiStatus.attack){
            //if(slime_animation.getAnimationState('slime_attack').isPlaying === false){
            //    slime_animation.play('slime_attack')
            //}
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
}
