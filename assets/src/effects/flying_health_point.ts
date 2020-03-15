// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class flying_health_point extends cc.Component {

    onLoad () {
        
        
        cc.tween(this.node)
            .to(1, { position: cc.v2(this.node.getPosition().x, this.node.getPosition().y+30)})
            .start();

        this.scheduleOnce(function () {
            this.node.destroy();
        }, 1);
    }

    start () {
        
    }

    update (dt) {

    }
}
