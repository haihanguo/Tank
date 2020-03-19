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

    onLoad () {

    }

    start () {

    }

    setText(direction : number, text : string){
        if(direction < 0 && this.node.scaleX > 0){
            this.node.scaleX *= -1;
        }else if(direction > 0 && this.node.scaleX < 0){            
            this.node.scaleX *= -1;
        }
        this.node.getComponent(cc.Label).string = text;
        this.scheduleOnce(function(){ 
            this.node.getComponent(cc.Label).string = ""; 
        },2);
    }
    // update (dt) {}
}
