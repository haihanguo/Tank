// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ItemEquip, EquipType } from "../models/Item";
import { PlayerModel } from "../models/PlayerModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class equipment_control extends cc.Component {

    @property(cc.Node)
    player : cc.Node = null;

    @property(cc.Node)
    player_bag_panel :cc.Node = null;

    @property(cc.Node)
    player_equipment_area :cc.Node = null;

    @property(cc.Node)
    player_attributes :cc.Node = null;

    @property(cc.Node)
    equipment_item_pool :cc.Node = null;

    @property(cc.Prefab)
    equipped_item : cc.Prefab = null;

    
    @property(cc.SpriteFrame)
    released_back : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    pressed_back : cc.SpriteFrame = null;


    private selectedNode : cc.Node = null;
    private player_model : PlayerModel = null;
    private unequip_button;


    openCloseStatus(){
        if(this.node.active){
            this.node.setPosition(0,0);
            if(this.player_bag_panel.active === true){
                this.player_bag_panel.setPosition(0,0);
            }
            this.node.active = false;
        }else{
            if(this.player_bag_panel.active === true){
                this.player_bag_panel.setPosition(-150,0);
                this.node.setPosition(180,0);
            }else{
                this.node.setPosition(0,0);
            }
            this.node.active = true;
            //console.log(this.item_desc_area.getChildByName("destory_item_button"));
        }
        this.updateUnequipmentButton(false);
        if(this.selectedNode != null){
            this.selectedNode.parent.getComponent(cc.Sprite).spriteFrame = this.released_back;
        }
        
        this.selectedNode = null;
        
    }

    equipItem(item : cc.Node){
        //debugger
        if(item === null){
            return;
        }
        let detailed_item : ItemEquip = item.getComponent("bagitem").getItem();
        let equip_area : string = "";
        switch (detailed_item.EquipType) {
            case EquipType.Helmet:
                equip_area = "head";
                break;
            case EquipType.Armor:
                equip_area = "chest";
                break;
            case EquipType.Belt:
                equip_area = "waist";
                break;
            case EquipType.Shoes:
                equip_area = "foot";
                break;
            case EquipType.Weapon:
                equip_area = "weapon1";
                break;
            case EquipType.OffHandWeapon:
                equip_area = "weapon2";
                break;
            case EquipType.Necklace:
                    equip_area = "neck";
                    break;
            case EquipType.Ring:
                equip_area = "ring";
                break;
            default:
                return;
        }
        //check if node empty
        //console.log(this.player_equip_area.getChildByName(equip_area));
        if(equip_area === "ring"){
            let ring_slot1 : number = this.player_equipment_area.getChildByName("ring1").childrenCount;
            let ring_slot2 : number = this.player_equipment_area.getChildByName("ring2").childrenCount;
            equip_area = "ring1";
            if(ring_slot1 > 1 && ring_slot2 === 1){
                equip_area = "ring2";
            }
        }
        if(this.player_equipment_area.getChildByName(equip_area).childrenCount > 1){
            this.unequipItem(null, equip_area);
        }        
        this.addEquipmentToPanel(item, equip_area);
        this.updatePlayerStatus("equip", detailed_item)
        return true;
    }

    addEquipmentToPanel(item : cc.Node, area : string){
        let equipped_item : cc.Node = null
        if(this.equipment_item_pool.childrenCount === 0){
            equipped_item = cc.instantiate(this.equipped_item);
        }else{
            equipped_item = this.equipment_item_pool.children[0];
            equipped_item.removeFromParent();
        }            
        equipped_item.getChildByName("item_sprite").getComponent(cc.Sprite).spriteFrame = item.getChildByName('item_sprite').getComponent(cc.Sprite).spriteFrame;
        equipped_item.getChildByName("item_sprite").setScale(0.8);
        equipped_item.getComponent("equippeditem").setItemDetails(item, "bagitem");
        this.player_equipment_area.getChildByName(area).addChild(equipped_item);
    }
    itemClicked(item_node : cc.Node){
        if(this.selectedNode === null){
            this.selectedNode = item_node;
        }else{
            //get bagitem_background node
            this.selectedNode.parent.getComponent(cc.Sprite).spriteFrame = this.released_back;
            this.selectedNode = item_node;
        }
        this.selectedNode.parent.getComponent(cc.Sprite).spriteFrame = this.pressed_back;
        this.updateUnequipmentButton(true);
    }
    unequipItem(event: cc.Event, area : string, customEventData ? : string){
        if(area != undefined){
            this.selectedNode = this.player_equipment_area.getChildByName(area).children[1];
        }
        if(this.selectedNode === null){
            return;
        }
        //call bag panel add item
        let detailed_item : ItemEquip = this.selectedNode.getComponent("equippeditem").getItem();
        if(this.player_bag_panel.getComponent("bag_control").addItem(this.selectedNode, "equippeditem")){
            this.selectedNode.parent.getComponent(cc.Sprite).spriteFrame = this.released_back;
            //remove node and add to pool
            this.selectedNode.removeFromParent();
            this.equipment_item_pool.addChild(this.selectedNode);
            this.selectedNode = null;
        }else{
            return
        }
        this.updateUnequipmentButton(false);        
        this.updatePlayerStatus("remove", detailed_item)
    }
    updateUnequipmentButton(status : boolean){
        this.unequip_button.getComponent(cc.Button).interactable= status;
    }
    updatePlayerStatus(action : string, item : ItemEquip){
        this.player_model = this.player.getComponent("player").getPlayer();
        if(action === "equip"){
            this.player_model.EquipmentItem.push(item);
        }else if(action === "remove"){
            let unequippeditem = this.player_model.EquipmentItem.filter(function (e){
                return e.uuid == item.uuid;
            });
            if(unequippeditem != null){
                this.player_model.EquipmentItem.splice(this.player_model.EquipmentItem.indexOf(item))
            }            
        }
        this.player.getComponent("player").updatePlayerStatus();
        this.updatePlayerAttributePanel("all");
    }
    updatePlayerAttributePanel(action : string){
        let layout = this.player_attributes.getChildByName("attributes_layout");
        
        let level = "等级 ： "+this.player_model.Level;       
        let exp = "经验 ： "+this.player_model.Exp+" / "+this.player_model.ExpToNext;
        let health = "生命： " + this.player_model.Hp+ " / " + this.player_model.InGameAttributes.MaxHp;
        let mana = "魔法： " + this.player_model.Mp+ " / " + this.player_model.InGameAttributes.MaxMana;
        let gold = "金币 ： "+this.player_model.Gold;

        layout.getChildByName("level").getComponent(cc.Label).string = level;
        layout.getChildByName("exp").getComponent(cc.Label).string = exp;
        layout.getChildByName("health_point").getComponent(cc.Label).string = health;
        layout.getChildByName("magic_point").getComponent(cc.Label).string = mana;            
        layout.getChildByName("gold").getComponent(cc.Label).string = gold;
        if(action === "realtime"){
            return;
        }
        let phy_attack = "攻击： " + this.player_model.InGameAttributes.PhyAttackMin+ " - " + this.player_model.InGameAttributes.PhyAttackMax;
        let mag_attack = "魔力： " + this.player_model.InGameAttributes.MagAttackMin+ " - " + this.player_model.InGameAttributes.MagAttackMax;
        let def = "防御： " + this.player_model.InGameAttributes.DefenceMin+ " - " + this.player_model.InGameAttributes.DefenceMax;
        let accurate = "准确 ： "+(this.player_model.InGameAttributes.Accurate-50);
        let move_speed = "移动速度 ： "+Math.floor(this.player_model.InGameAttributes.MoveSpeed/100);
        let attack_speed = "攻击速度 ： "+Math.floor(this.player_model.InGameAttributes.AttackSpeed/1000);
        let luck = "幸运 ： "+this.player_model.InGameAttributes.Luck;
        layout.getChildByName("attack").getComponent(cc.Label).string = phy_attack;
        layout.getChildByName("magic").getComponent(cc.Label).string = mag_attack;
        layout.getChildByName("defence").getComponent(cc.Label).string = def;
        layout.getChildByName("accurate").getComponent(cc.Label).string = accurate;
        layout.getChildByName("move_speed").getComponent(cc.Label).string = move_speed;
        layout.getChildByName("attack_speed").getComponent(cc.Label).string = attack_speed;
        layout.getChildByName("luck").getComponent(cc.Label).string = luck;
    }
    onLoad () {
        this.unequip_button = this.node.getChildByName("unequip_button");
        this.player_model = this.player.getComponent("player").getPlayer();
        this.updatePlayerAttributePanel("all");
    }
    start () {

    }

    // update (dt) {}
}
