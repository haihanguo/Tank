// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import * as MathUtilities from './MathUtilities'
import {Item, ItemType, ItemEquip, ItemConsumable, EquipType} from './models/Item'
import {Mob, MobModel} from './models/Mob'
import {Drop} from './models/Drop'

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

    @property(cc.JsonAsset)
    drops_Json_file : cc.JsonAsset = null;

    private item_list;
    private mob_list;
    private drop_list;
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.node.zIndex = -5;
        this.iniItemList();
        console.log('item list loaded...');
        this.iniMobList();
        console.log('mob list loaded...');
        this.iniDropList();
        console.log('drop list loaded...');
        console.log(this.item_list, this.mob_list, this.drop_list);
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
        if(enemies.length < 1){
            this.create_enemy();
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
               
                if(type === ItemType.Equip.toString()){
                    let item : ItemEquip = null;
                    item = new ItemEquip(id, name, desc, capacity, parseInt(type), price, icon_path);
                    item.EquipType = json_item.equiptype === undefined ? null : json_item.equiptype;
                    item.Hp = json_item.hp === undefined ? 0 : json_item.hp;
                    item.Mp = json_item.mp === undefined ? 0 : json_item.mp;
                    item.PhyAttackMin = json_item.phyatkmin === undefined ? 0 : json_item.phyatkmin;
                    item.PhyAttackMax = json_item.phyatkmax === undefined ? 0 : json_item.phyatkmax;
                    item.MagAttackMin = json_item.magatkmin === undefined ? 0 : json_item.magatkmin;
                    item.MagAttackMax = json_item.magatkmax === undefined ? 0 : json_item.magatkmax;
                    item.DefenceMin = json_item.defmin === undefined ? 0 : json_item.defmin;
                    item.DefenceMax = json_item.defmax === undefined ? 0 : json_item.defmax;
                    item.MoveSpeed = json_item.speed === undefined ? 0 : json_item.speed;
                    item.LevelRequire = json_item.level === undefined ? 0 : json_item.level;
                    item.Luck = json_item.luck === undefined ? 0 : json_item.luck;
                    this.item_list.push(item);
                }else if(type === ItemType.Consumable.toString()){
                    let item : ItemConsumable = null;
                    let hp :number = json_item.hp;
                    let mp :number = json_item.mp;
                    let rs : number = json_item.rs;
                    let stack : number = json_item.stack;
                    item = new ItemConsumable(id, name, desc, capacity, parseInt(type), price, icon_path, hp, mp, rs, stack);
                    this.item_list.push(item);
                }
            }
    }
    getItemByID(item_id : number){
        for(let item of this.item_list){
            if(item.Id === item_id){
                return item;
            }
        }
    }
    getItemByName(item_name : string){
        for(let item of this.item_list){
            if(item.Name === item_name){
                return item;
            }
        }
    }
    iniMobList(){
        this.mob_list = new Array;
        for(let json_item of this.mobs_Json_file.json){
            let id : number = json_item.id;
            let name: string = json_item.name;
            let mob : MobModel = new MobModel(id, name);
            mob.Hp = json_item.hp;
            mob.AttackMin = json_item.atkmin;
            mob.AttackMax = json_item.atkmax;
            mob.PhyDef = json_item.phy_def;
            mob.MagDef = json_item.mag_def;
            mob.Exp = json_item.exp;
            mob.AttackRange = json_item.attack_range;
            mob.GoldDrop.Amount = json_item.gold_drop;
            mob.Rare = json_item.rare;
            mob.MoveSpeed = json_item.move_speed;
            mob.AttackGap = json_item.attackgap;
            let consume_list = json_item.consume_list;
            consume_list.forEach(element => {
                mob.ConsumeItemDropList.push(this.getItemByID(element));
            });
            let equip_list = json_item.equip_list;
            equip_list.forEach(element => {
                mob.EquipItemDropList.push(this.getItemByID(element));
            });
            console.log('mob1 loaded...');
            console.log(mob);
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
    iniDropList(){
        this.drop_list = new Array;
            for(let json_item of this.drops_Json_file.json){
                let id : number = json_item.id;
                let name: string = json_item.name;
                let gold_p1: number = json_item.gold_p1;
                let gold_p2 :number = json_item.gold_p2;
                let gold_p3: number = json_item.gold_p3;
                let consumable_p1 : number = json_item.consumable_p1;
                let consumable_p2 : number = json_item.consumable_p2;
                let consumable_p3 : number = json_item.consumable_p3;
                let equip_p1 : number = json_item.equip_p1;
                let equip_p2 : number = json_item.equip_p2;
                let equip_p3 : number = json_item.equip_p3;

                let drop : Drop = null;
                drop = new Drop(id, name, gold_p1, gold_p2, gold_p3, consumable_p1, consumable_p2, consumable_p3, equip_p1, equip_p2, equip_p3);
                this.drop_list.push(drop);
            }
    }
    getDrop(name : string){
        for(let drop of this.drop_list){
            if(drop.Name === name){
                return drop;
            }
        }
    }
}
