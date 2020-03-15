// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class drops extends cc.Component {

    @property(cc.AudioClip)
    coin_audio : cc.AudioClip = null;

    start () {
        
    }
    onDestroy(){
        console.log('picked');
        cc.audioEngine.playEffect(this.coin_audio, false);
    }
    // update (dt) {}
}
