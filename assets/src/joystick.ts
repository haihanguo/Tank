// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class joystick extends cc.Component {

    @property(cc.Node)
    stick: cc.Node = null;

    @property
    max_range: number = 0;

    @property
    min_range: number = 0;
    // LIFE-CYCLE CALLBACKS:

    public dir : cc.Vec2 = cc.v2(0,0);

    onLoad () {
        this.stick.setPosition(cc.v2(0,0));
        this.stick.on(cc.Node.EventType.TOUCH_MOVE, this.on_stick_move, this);
        this.stick.on(cc.Node.EventType.TOUCH_END,function(){
            this.on_stick_end();
        }, this);

        this.stick.on(cc.Node.EventType.TOUCH_CANCEL,function(){
            this.on_stick_end();
        }, this)
    }

    on_stick_move(e: cc.Touch): void {
        var screen_pos: cc.Vec2 = e.getLocation();
        var pos : cc.Vec2 = this.node.convertToNodeSpaceAR(screen_pos);

        var len: number = pos.len();

        if(len <= this.min_range){
            return
        }

        if(len > this.max_range){
            pos.x = pos.x * this.max_range / len;
            pos.y = pos.y * this.max_range / len;
        } 

        this.dir.x = pos.x/len;
        this.dir.y = pos.y/len;


        this.stick.setPosition(pos);
    }

    on_stick_end(): void{
        this.dir = cc.v2(0,0);
        this.stick.setPosition(cc.v2(0,0));
    }
    start () {

    }

    // update (dt) {}
}
