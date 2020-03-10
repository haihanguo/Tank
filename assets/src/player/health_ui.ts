// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class health_ui extends cc.Component {

    @property(cc.Node)
    healthbar: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {        
        this.node.getChildByName('health_ui_bar').getComponent(cc.Sprite).fillStart = 1;
    }

    start () {

    }

    // update (dt) {}
}
