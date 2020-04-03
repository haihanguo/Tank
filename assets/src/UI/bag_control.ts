// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ItemType, Item, ItemEquip, ItemConsumable, EquipType } from "../models/Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    bagitem : cc.Prefab = null;


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
    player_equip_panel :cc.Node = null;


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
        this.equip_button = this.item_desc_area.getChildByName("equip_item_button");
        this.distory_button = this.item_desc_area.getChildByName("destory_item_button");
    }

    start () {

    }

    openCloseBag(){
        if(this.node.active === true){
            this.node.setPosition(0,0);
            if(this.player_equip_panel.active === true){
                this.player_equip_panel.setPosition(0,0);
            }
            this.node.active = false;
        }else{
            //open bag --check status panel
            this.node.active = true;
            if(this.player_equip_panel.active === true){
                this.node.setPosition(-150,0);
                this.player_equip_panel.setPosition(180,0);
            }else{
                this.node.setPosition(0,0);
            }
            //console.log(this.item_desc_area.getChildByName("destory_item_button"));
        }
        this.equipbag.active = true;
        this.consumebag.active = false;

        //reset bag
        this.updateItemButton(false);
        if(this.selectedNode != null){
            this.selectedNode.parent.getComponent(cc.Sprite).spriteFrame = this.released_back;
        }
        this.selectedNode = null;
        this.updateItemDesc();
    }

    addItem(item_node : cc.Node, source : string){     
        let picked_item : cc.Node = null; 
        if(this.bag_item_pool.childrenCount === 0){
            picked_item = cc.instantiate(this.bagitem);
        }else{
            picked_item = this.bag_item_pool.children[0];
            picked_item.removeFromParent();
        }
        picked_item.getChildByName("item_sprite").getComponent(cc.Sprite).spriteFrame = item_node.getChildByName('item_sprite').getComponent(cc.Sprite).spriteFrame;
        picked_item.getChildByName("item_sprite").setScale(2);
        picked_item.getComponent("bagitem").setItemDetails(item_node, source);
        if(picked_item.getComponent("bagitem").getItem().ItemType === ItemType.Equip){
            for (const iterator of this.equipbag.getChildByName("view").getChildByName("content").children) {
                if(iterator.children.length === 0){
                    iterator.addChild(picked_item);
                    console.log(this.equipbag.getChildByName("view").getChildByName("content"))
                    return true;
                }
            }            
        }else if(picked_item.getComponent("bagitem").getItem().ItemType === ItemType.Consumable){
            for (const iterator of this.consumebag.getChildByName("view").getChildByName("content").children) {
                if(iterator.children.length === 0){
                    iterator.addChild(picked_item);
                    return true;;
                }
            }     
        }
        return false;
        
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
            if(detailed_item.LevelRequire != 0)
                detailed_attribute += "等级 "+ detailed_item.LevelRequire;
            if(detailed_item.PhyAttackMin != 0 || detailed_item.PhyAttackMax != 0)
                detailed_attribute += " 攻击 "+ detailed_item.PhyAttackMin + " - " + detailed_item.PhyAttackMax;
            if(detailed_item.MagAttackMin != 0 || detailed_item.MagAttackMax != 0)
                detailed_attribute += " 魔力 "+ detailed_item.MagAttackMin + " - " + detailed_item.MagAttackMax;
            if(detailed_item.DefenceMin != 0 || detailed_item.DefenceMax != 0)
                detailed_attribute += " 防御 "+ detailed_item.DefenceMin + " - " + detailed_item.DefenceMax;
            if(detailed_item.MoveSpeed != 0)
                detailed_attribute += " 速度 "+ detailed_item.MoveSpeed;
            if(detailed_item.Luck != 0)
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
        //call player panel add item
        if(this.player_equip_panel.getComponent("equipment_control").equipItem(this.selectedNode)){
            this.selectedNode.parent.getComponent(cc.Sprite).spriteFrame = this.released_back;
            //remove node and add to pool
            this.selectedNode.removeFromParent(true);
            this.bag_item_pool.addChild(this.selectedNode);
            this.selectedNode = null;
            this.updateItemButton(false);
        }else{
            return
        }


    }
    // update (dt) {}
}
