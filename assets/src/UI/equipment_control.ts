// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ItemEquip, EquipType } from "../models/Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class equipment_control extends cc.Component {

    @property(cc.Node)
    player_bag_panel :cc.Node = null;

    @property(cc.Node)
    player_equipment_area :cc.Node = null;

    @property(cc.Node)
    equipment_item_pool :cc.Node = null;

    @property(cc.Prefab)
    equipped_item : cc.Prefab = null;

    
    @property(cc.SpriteFrame)
    released_back : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    pressed_back : cc.SpriteFrame = null;


    private selectedNode : cc.Node = null;
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
    }
    updateUnequipmentButton(status : boolean){
        this.unequip_button.getComponent(cc.Button).interactable= status;
    }
    onLoad () {
        this.unequip_button = this.node.getChildByName("unequip_button");
    }

    start () {

    }

    // update (dt) {}
}
