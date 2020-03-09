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
    max_range: number = 0;

    @property
    min_range: number = 0;

    @property
    fire_button_pressed: boolean = false;

    @property
    pressed_time : number = 0;

    public dir : cc.Vec2 = cc.v2(0,0);
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log('firecontrol setup!');
        this.dir = cc.v2(0,100);
        this.fire_button.on(cc.Node.EventType.TOUCH_START, this.on_aim_pressed, this);
        this.fire_button.on(cc.Node.EventType.TOUCH_MOVE, this.on_aim_moved, this);
        this.fire_button.on(cc.Node.EventType.TOUCH_END, this.on_aim_canceled, this);
        this.fire_button.on(cc.Node.EventType.TOUCH_CANCEL, this.on_aim_canceled, this);
    }

    start () {

    }

    on_aim_pressed(): void{
        this.player.getComponent('player').lock_rotation();
        console.log('on_aim_pressed');
        this.player.getComponent('player').playerShoot();
        this.pressed_time = 0;
        this.fire_button_pressed = true;
    }
    on_aim_moved(e: cc.Touch): void{
        if(!(this.pressed_time < 0.02)){
            this.player.getComponent('player').lock_rotation();
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
    
            this.fire_button.setPosition(pos);

            var r: number = Math.atan2(this.dir.y, this.dir.x);
            var player_degree: number = r * 180 / Math.PI;

            this.player.getComponent('player').flipPlayer();
            if(this.player.getComponent('player').getPlayerFaceDirection() === 'left'){
                this.player.getChildByName('handgun').angle = 180 - player_degree; 
            }else{
                this.player.getChildByName('handgun').angle = player_degree; 
            }  
        }

    }
    on_aim_canceled(): void{
        this.player.getComponent('player').unlock_rotation();
        //this.dir = cc.v2(0,0);
        this.fire_button.setPosition(cc.v2(0,0));

        console.log('on_aim_canceled');
        this.fire_button_pressed = false;
    }
    update (dt) {
        if(this.fire_button_pressed){
            this.pressed_time +=dt;
            //console.log(this.pressed_time);
            if(this.pressed_time >= 0.5){
                this.player.getComponent('player').playerShoot();
                this.pressed_time = 0;
            } 
        }        
    }
}
