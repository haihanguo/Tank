// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Item, ItemType } from "../models/Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class bagitem extends cc.Component {

    @property(cc.SpriteFrame)
    released_back : cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    pressed_back : cc.SpriteFrame = null;
    private pressed_color : cc.Color = cc.color(168, 168, 168, 255);

    private item_type : ItemType = null;
    private item : Item = null;

    setItemDetails(item : cc.Node, source : string){
        this.item =  item.getComponent(source).getItem();               
    }

    onLoad () {        
         
    }

    start () {

    }

    getItem(){
        return this.item;
    }
    on_item_pressed(): void{
        this.node.parent.parent.parent.parent.parent.getComponent("bag_control").itemClicked(this.node);
    }
    // update (dt) {}
}
