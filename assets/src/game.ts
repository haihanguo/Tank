// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import * as MathUtilities from './MathUtilities'
import {Item, ItemType, ItemEquip, ItemConsumable, EquipType} from './models/Item'
import {Mob} from './models/Mobs'

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
    
    @property(cc.JsonAsset)
    items_Json_file : cc.JsonAsset = null;

    @property(cc.JsonAsset)
    mobs_Json_file : cc.JsonAsset = null;

    private item_list;
    private mob_list;
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.node.zIndex = -5;
        this.iniItemList();
        this.iniMobList();
        console.log(this.item_list, this.mob_list);
    }

    start () {
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
    rand_in_range(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
    update(dt){
        let enemies : cc.Node[] = this.node.children.filter(function (e){
            return e.name == 'slime';
        });
        if(enemies.length < 10){
            //this.create_enemy();
            //this.create_enemy();
        }
        //this.player.getComponent('player').flipPlayer();
        //this.player.getComponent('player').movePlayer();
    }
    iniItemList(){
        this.item_list = new Array;
            for(let json_item of this.items_Json_file.json){
                let id : number = json_item.id;
                let name: string = json_item.name;
                let desc: string = json_item.desc;
                let capacity :number = json_item.capacity;
                let price: number = json_item.price;
                let icon_path : string = json_item.icon;

                let type : string = json_item.type;
                let item : Item = null;
                if(type === ItemType.Equip.toString()){
                    let equiptype : EquipType = json_item.equiptype;
                    let phyatkmin : number = json_item.phyatkmin;
                    let phyatkmax : number = json_item.phyatkmax;
                    let magatkmin : number = json_item.magatkmin;
                    let magatkmax : number = json_item.magatkmax;
                    let defmin : number = json_item.defmin;
                    let defmax : number = json_item.defmax;
                    let speed : number = json_item.speed;
                    let luck : number = json_item.luck;

                    item = new ItemEquip(id, name, desc, capacity, parseInt(type), price, icon_path, equiptype, phyatkmin,phyatkmax, magatkmin,magatkmax, defmin,defmax, speed, luck);
                    this.item_list.push(item);
                }else if(type === ItemType.Consumable.toString()){
                    let hp :number = json_item.hp;
                    let mp :number = json_item.mp;
                    let rs : number = json_item.rs;
                    let stack : number = json_item.stack;
                    item = new ItemConsumable(id, name, desc, capacity, parseInt(type), price, icon_path, hp, mp, rs, stack);
                    this.item_list.push(item);
                }
            }
    }
    getItem(item_id : number){
        for(let item of this.item_list){
            if(item.Id === item_id){
                return item;
            }
        }
    }
    iniMobList(){
        this.mob_list = new Array;
            for(let json_item of this.mobs_Json_file.json){
                let id : number = json_item.id;
                let name: string = json_item.name;
                let hp: number = json_item.hp;
                let atkmin :number = json_item.atkmin;
                let atkmax: number = json_item.atkmax;
                let def : number = json_item.def;
                let exp : number = json_item.exp;
                let speed : number = json_item.speed;
                let attackgap : number = json_item.attackgap;

                let mob : Mob = null;
                mob = new Mob(id, name, hp, atkmin, atkmax, def, exp, speed, attackgap);
                this.mob_list.push(mob);
            }
    }
    getMob(mob_id : number){
        for(let mob of this.mob_list){
            if(mob.Id === mob_id){
                return mob;
            }
        }
    }
}
