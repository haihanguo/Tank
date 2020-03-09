// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import * as MathUtilities from './MathUtilities'

const {ccclass, property} = cc._decorator;

@ccclass
export default class game extends cc.Component {

	@property(cc.Prefab)
    zombie: cc.Prefab = null

    @property zombieSpawnMinX = 0
    @property zombieSpawnMaxX = 0
    @property zombieSpawnMinY = 0
    @property zombieSpawnMaxY = 0
    @property zombieMinVelocity = 0
    @property zombieMaxVelocity = 0
	// FACTORY

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
    }

    start () {        
        //this.create_zombie();
    }
	
    create_zombie() {        
            const x :number = this.rand_in_range(this.zombieSpawnMinX, this.zombieSpawnMaxX)
            const y :number = this.rand_in_range(this.zombieSpawnMinY, this.zombieSpawnMaxY)
            //const angle = Math.random() * 360
            
            var angle : number = Math.random() * 360; 
            const velocity = this.rand_in_range(this.zombieMinVelocity, this.zombieMaxVelocity)
    
            const node = cc.instantiate(this.zombie)    
            node.setPosition(cc.v2(x, y))
            
            //const body = node.getComponent(cc.RigidBody)
            //body.linearVelocity = cc.v2(MathUtilities.cosd(angle) * velocity, MathUtilities.sind(angle) * velocity)  
            //console.log(angle)
            //node.angle = angle;
            //node.angle = angle * Math.PI / 180;
            this.node.addChild(node)
    }

    schedule_create_zombie() {
        cc.director.getScheduler().schedule(this.create_zombie, this, 1 + Math.random(), false);
    }

    rand_in_range(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
    update(dt){
        const zombies = this.node.getChildByName("zombie");
        if(zombies == null || !zombies.isValid){
            //this.create_zombie();
        }
    }
}
