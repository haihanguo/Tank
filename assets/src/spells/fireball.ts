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


    onLoad() {


    }
    start () {
        var fly_to_position = this.aimed_enemy.getPosition();
        console.log(fly_to_position, this.aimed_angel);
        
        this.node.runAction(cc.moveTo(0.3, fly_to_position, 0));
    }

    update (dt) {}
}
