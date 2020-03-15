// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class enable_phy extends cc.Component {

    @property
    is_debug: boolean = false;

    @property(cc.Vec2)
    gravity: cc.Vec2 = cc.v2(0,-320);

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = this.gravity;
        cc.director.getCollisionManager().enabled = true;

        if(this.is_debug){
            // enable all debug draw info
            var Bits: any = cc.PhysicsManager.DrawBits;
            cc.director.getPhysicsManager().debugDrawFlags = 
            Bits.e_aabbBit |
            Bits.e_pairBit |
            Bits.e_centerOfMassBit |
            Bits.e_jointBit |
            Bits.e_shapeBit;
        }else{
            cc.director.getPhysicsManager().debugDrawFlags = 0;
        }



    }

    start () {

    }

    // update (dt) {}
}
