// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    time_to_ive = 5000
    
    time_alive = 0

    @property
    damage : number = 0;

    @property
    damage_type : number = 0;

    @property
    bullet_speed : number = 0;
    // onLoad () {}

    start () {

    }

    update(dt) {
        if (!cc.isValid(this.node)) return

        this.time_alive += dt * 1000
        if (this.time_alive >= this.time_to_ive) this.node.destroy()
    }

}
