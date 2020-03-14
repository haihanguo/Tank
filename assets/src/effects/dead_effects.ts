// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class dead_effects extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    private start_time = null;
    onLoad () {
        this.node.getComponent(cc.Animation).play();
        this.start_time = new Date().getTime();
    }

    start () {

    }

    update (dt) {
        let curr_time = new Date().getTime();
        //console.log(this.node.getComponent(cc.Animation).defaultClip.duration, curr_time - this.start_time);
        if((curr_time - this.start_time) > (this.node.getComponent(cc.Animation).defaultClip.duration*5000)){
            console.log('destory!');
            this.node.destroy();
        }
            
    }
}
