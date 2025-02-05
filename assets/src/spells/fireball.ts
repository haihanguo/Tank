// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import spells from "./spells";

const {ccclass, property} = cc._decorator;

@ccclass
export default class fireball extends spells {

    @property
    spell_name : String = "";
    
    onLoad() {
        
    }
    //start () {
    //    
    //}
    cast(){
        var fly_to_position = this.aimed_enemy.getPosition();
        cc.tween(this.node)
        .to(0.3, { position: fly_to_position})
        .start();
    }

    //update (dt) {}
}
