// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class bagitem extends cc.Component {

    private released_color : cc.Color = cc.color(255, 255, 255, 255);
    private pressed_color : cc.Color = cc.color(168, 168, 168, 255);

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.on_item_pressed, this);
        //this.fire_button.on(cc.Node.EventType.TOUCH_MOVE, this.on_aim_moved, this);
        //this.node.on(cc.Node.EventType.TOUCH_END, this.on_aim_canceled, this);
        //this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.on_aim_canceled, this);
    }

    start () {

    }

    on_item_pressed(): void{
        this.node.color.set(this.pressed_color);
    }
    // update (dt) {}
}
