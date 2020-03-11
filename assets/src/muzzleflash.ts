// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class muzzleflash extends cc.Component {



    onLoad () {
        this.getComponent(cc.Animation).play();
        
    }

    start () {
        
    }

    update (dt) {
        if(this.getComponent(cc.Animation).getAnimationState('muzzleflash').isPlaying == false)
        this.node.destroy();
    }
}
