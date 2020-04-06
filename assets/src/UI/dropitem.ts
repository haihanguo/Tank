// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ItemEquip, ItemConsumable, Item, ItemType } from "../models/Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class dropitem extends cc.Component {
    
    time_to_ive = 25000
    
    time_alive = 0

    @property({type:cc.AudioClip})
    pickup_sound : cc.AudioClip = null;
    
    public drop_type : string = null;
    public drop_amount : number = null;
    public picked : boolean = false;

    private item;

    onLoad(){
        this.node.zIndex = -2;
        //this.setDropSprite();
    }
    start () {
        
    }
    onDestroy(){
        if(this.picked){
            cc.audioEngine.playEffect(this.pickup_sound, false);
        }        
    }

    setGoldDropDetails(iconpath : string, goldamount : number){
        let sprite_path : string = "";
        this.drop_type = "gold";
        this.drop_amount = goldamount;

        let self : cc.Node = this.node;        
        sprite_path = iconpath;        
        cc.loader.loadRes(sprite_path, cc.SpriteFrame, function (err, spriteFrame) {
            self.getChildByName('item_sprite').getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    }

    setItemDropDetails(drop : Item, uuid : string, sprite : cc.SpriteFrame){
        drop.uuid = uuid;
        this.drop_type = "item";
        this.item = drop;
        this.node.getChildByName('item_sprite').getComponent(cc.Sprite).spriteFrame = sprite;
        //this.setItemDropSprite();
    }

    setItemDropSprite(){
        let sprite_path : string = '';
        let self : cc.Node = this.node;        
        sprite_path = this.item.IconPath;
        console.log("dropitem initial...");
        console.log(self);      
        //this.node.getChildByName('item_sprite').getComponent(cc.Sprite).spriteFrame
        //cc.loader.loadRes(sprite_path, cc.SpriteFrame, function (err, spriteFrame) {
        //    self.getChildByName('item_sprite').getComponent(cc.Sprite).spriteFrame = spriteFrame;
        //});
    }
    getItem(){
        return this.item;
    }
    update (dt) {
        if (!cc.isValid(this.node)) return
        this.time_alive += dt * 1000
        if (this.time_alive >= this.time_to_ive) this.node.destroy()
    }
}
