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
    enemy: cc.Prefab = null
	@property(cc.Node)
    player: cc.Node = null

    @property enemy_spawn_min_x = 0;
    @property enemy_spawn_max_x = 0;
    @property enemy_spawn_min_y = 0;
    @property enemy_spawn_max_y = 0;
    @property enemy_min_velocity = 0;
    @property enemy_max_velocity = 0;
	// FACTORY

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
    }

    start () {        
        this.create_enemy();
        //this.create_enemy();
    }
	
    create_enemy() {        
            const x :number = this.rand_in_range(this.enemy_spawn_min_x, this.enemy_spawn_max_x);
            const y :number = this.rand_in_range(this.enemy_spawn_min_y, this.enemy_spawn_max_y);
            //const angle = Math.random() * 360
            
            var angle : number = Math.random() * 360; 
            const velocity = this.rand_in_range(this.enemy_min_velocity, this.enemy_max_velocity);
    
            const node = cc.instantiate(this.enemy);
            node.setPosition(cc.v2(x, y))
            
            //const body = node.getComponent(cc.RigidBody)
            //body.linearVelocity = cc.v2(MathUtilities.cosd(angle) * velocity, MathUtilities.sind(angle) * velocity)  
            //console.log(angle)
            //node.angle = angle;
            //node.angle = angle * Math.PI / 180;
            this.node.addChild(node)
    }

    schedule_create_zombie() {
        cc.director.getScheduler().schedule(this.create_enemy, this, 1 + Math.random(), false);
    }

    rand_in_range(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
    update(dt){
        let enemies : cc.Node[] = this.node.children.filter(function (e){
            return e.name == 'slime';
        });
        if(enemies.length < 10){
            this.create_enemy();
            //this.create_enemy();
        }
        //this.player.getComponent('player').flipPlayer();
        //this.player.getComponent('player').movePlayer();
    }
}
