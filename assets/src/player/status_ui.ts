// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayerModel } from "../models/PlayerModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class health_ui extends cc.Component {

    onLoad () {        
        this.node.getChildByName('hp_bar').getComponent(cc.Sprite).fillStart = 1;
        this.node.getChildByName('mp_bar').getComponent(cc.Sprite).fillStart = 1;
        this.node.getChildByName('exp_bar').getComponent(cc.Sprite).fillStart = 0;
    }

    start () {

    }

    //update (dt) {
        
    //}
}
