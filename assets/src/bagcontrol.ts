// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ItemType, Item, ItemEquip, ItemConsumable, EquipType } from "./models/Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    bagitem : cc.Prefab = null;
    @property(cc.Prefab)
    equipped_item : cc.Prefab = null;

    @property(cc.Node)
    equipbag : cc.Node = null;

    @property(cc.Node)
    consumebag: cc.Node = null;

    @property(cc.SpriteFrame)
    released_back : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    pressed_back : cc.SpriteFrame = null;

    @property(cc.Node)
    item_desc_area :cc.Node = null;

    @property(cc.Node)
    player_equip_area :cc.Node = null;


    @property(cc.Node)
    bag_item_pool : cc.Node = null;

    private isActive : boolean = false;
    private selectedNode : cc.Node = null;
    private equip_button;
    private distory_button;

    openEquipBag(){
        this.equipbag.active = true;
        this.equipbag.getComponent(cc.ScrollView).scrollToTop();
        this.equip_button.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = "装上";
        this.consumebag.active = false;
        this.removeSelected();
    }

    openConsumeBag(){
        this.consumebag.active = true;
        this.consumebag.getComponent(cc.ScrollView).scrollToTop();
        this.equip_button.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = "使用";
        this.equipbag.active = false;
        this.removeSelected();
    }

    onLoad () {
        this.node.active = false;
        this.equip_button = this.item_desc_area.getChildByName("equip_item_button");
        this.distory_button = this.item_desc_area.getChildByName("destory_item_button");
    }

    start () {

    }

    openCloseBag(){
        if(this.node.active){
            this.selectedNode = null;
            this.node.active = false;
        }else{
            this.node.active = true;
            this.equipbag.active = true;
            this.consumebag.active = false;
            this.updateItemButton(false);
            //console.log(this.item_desc_area.getChildByName("destory_item_button"));
        }
    }

    addItem(item_node : cc.Node){
        let picked_item = cc.instantiate(this.bagitem);
        picked_item.getChildByName("item_sprite").getComponent(cc.Sprite).spriteFrame = item_node.getChildByName('drop_sprite').getComponent(cc.Sprite).spriteFrame;
        picked_item.getChildByName("item_sprite").setScale(2);
        picked_item.getComponent("bagitem").setItemDetails(item_node);
        if(picked_item.getComponent("bagitem").getItem().ItemType === ItemType.Equip){
            for (const iterator of this.equipbag.getChildByName("view").getChildByName("content").children) {
                if(iterator.children.length === 0){
                    iterator.addChild(picked_item);
                    console.log(this.equipbag.getChildByName("view").getChildByName("content"))
                    return;
                }
            }            
        }else if(picked_item.getComponent("bagitem").getItem().ItemType === ItemType.Consumable){
            for (const iterator of this.consumebag.getChildByName("view").getChildByName("content").children) {
                if(iterator.children.length === 0){
                    iterator.addChild(picked_item);
                    return;
                }
            }     
        }
        
    }

    removeSelected(){
        this.selectedNode = null;
        this.updateItemDesc();
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
        this.updateItemDesc();
        this.updateItemButton(true);
    }

    updateItemDesc(){
        if(this.selectedNode === null){
            this.item_desc_area.getChildByName("item_name").getComponent(cc.Label).string = "";
            this.item_desc_area.getChildByName("item_attributes").getComponent(cc.Label).string = "";
            this.item_desc_area.getChildByName("item_desc").getComponent(cc.Label).string = "";
            return;
        }
        let item : Item = this.selectedNode.getComponent("bagitem").getItem();
        let detailed_attribute : string = "";
        if(item.ItemType === ItemType.Equip){
            let detailed_item : ItemEquip = this.selectedNode.getComponent("bagitem").getItem();
            if(detailed_item.Level != undefined)
                detailed_attribute += "等级 "+ detailed_item.Level;
            if(detailed_item.PhysicAttackMin != undefined && detailed_item.PhysicAttackMax != undefined)
                detailed_attribute += " 攻击 "+ detailed_item.PhysicAttackMin + " - " + detailed_item.PhysicAttackMax;
            if(detailed_item.MagicAttackMin != undefined && detailed_item.MagicAttackMax != undefined)
                detailed_attribute += " 魔力 "+ detailed_item.MagicAttackMin + " - " + detailed_item.MagicAttackMax;
            if(detailed_item.DefenceMin != undefined && detailed_item.DefenceMax != undefined)
                detailed_attribute += " 防御 "+ detailed_item.DefenceMin + " - " + detailed_item.DefenceMax;
            if(detailed_item.Speed != undefined)
                detailed_attribute += " 速度 "+ detailed_item.Speed;
            if(detailed_item.Luck != undefined)
                detailed_attribute += " 幸运 "+ detailed_item.Luck;
        }else if(item.ItemType === ItemType.Consumable){
            let detailed_item : ItemConsumable = this.selectedNode.getComponent("bagitem").getItem(); 
        }
        this.item_desc_area.getChildByName("item_name").getComponent(cc.Label).string = item.Name;
        this.item_desc_area.getChildByName("item_attributes").getComponent(cc.Label).string = detailed_attribute;
        this.item_desc_area.getChildByName("item_desc").getComponent(cc.Label).string = item.Description;
    }

    updateItemButton(status : boolean){
        this.equip_button.getComponent(cc.Button).interactable= status;
        this.distory_button.getComponent(cc.Button).interactable= status;
    }

    equipItem(){
        if(this.selectedNode === null){
            return;
        }
        let detailed_item : ItemEquip = this.selectedNode.getComponent("bagitem").getItem();
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
        if(this.player_equip_area.getChildByName(equip_area).childrenCount === 0){
            let equipped_item = cc.instantiate(this.equipped_item);
            equipped_item.getChildByName("item_sprite").getComponent(cc.Sprite).spriteFrame = this.selectedNode.getChildByName('item_sprite').getComponent(cc.Sprite).spriteFrame;
            equipped_item.getChildByName("item_sprite").setScale(0.8);
            //equipped_item.getComponent("bagitem").setItemDetails(item_node);
            this.player_equip_area.getChildByName(equip_area).addChild(equipped_item);
            this.selectedNode.parent.getComponent(cc.Sprite).spriteFrame = this.released_back;

            //remove node and add to pool
            this.selectedNode.removeFromParent(false);
            this.bag_item_pool.addChild(this.selectedNode);
            this.selectedNode = null;
        }        
    }
    // update (dt) {}
}
