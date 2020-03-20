// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    private isActive : boolean = false;
    onLoad () {
        this.node.active = false;
    }

    start () {

    }

    openCloseBag(){
        if(this.node.active){
            this.node.active = false;
        }else{
            this.node.active = true;
        }
    }
    // update (dt) {}
}
