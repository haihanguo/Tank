// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class fire_control extends cc.Component {

    @property(cc.Node)
    fire_button: cc.Node = null;

    @property(cc.Node)
    player: cc.Node = null;

    @property
    fire_button_pressed: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log('firecontrol setup!');
        this.fire_button.on(cc.Node.EventType.TOUCH_START, this.on_aim_pressed, this);
        this.fire_button.on(cc.Node.EventType.TOUCH_END, this.on_aim_canceled, this);
        this.fire_button.on(cc.Node.EventType.TOUCH_CANCEL, this.on_aim_canceled, this);
    }

    start () {

    }

    on_aim_pressed(): void{
        console.log('on_aim_pressed');
        this.player.getComponent('player').createBullet();
        this.fire_button_pressed = true;
    }
    on_aim_canceled(): void{
        console.log('on_aim_canceled');
        this.fire_button_pressed = false;
    }
    // update (dt) {}
}
