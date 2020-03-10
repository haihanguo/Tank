// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class shield_ui extends cc.Component {

    @property(cc.Sprite)
    shieldbar: cc.Sprite = null;

    @property(cc.Node)
    player: cc.Node = null;

    private timer : number = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {        
        this.shieldbar.fillStart = 0;
    }

    start () {

    }

    update (dt) {
        this.timer += dt;
        //console.log(this.timer, this.shieldbar.fillStart);
        if(this.timer >= 3 && this.shieldbar.fillStart < 1){
            //console.log(this.timer, this.shieldbar.fillStart);
            this.shieldbar.fillStart += 0.2;
            this.timer = 0;
        }
    }
}
