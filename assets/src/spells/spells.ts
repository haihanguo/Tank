// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Spell } from "../models/Spell";
import { PlayerModel } from "../models/Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class spells extends cc.Component {

    time_to_ive = 2000
    
    time_alive = 0    

    public spell_model : Spell = null;
    public ingame_spell_model : Spell = null;
    public aimed_enemy : cc.Node = null;
    public aimed_angel : number = 0;

    setSpell(spell_model : Spell){
        this.spell_model =  {...spell_model};
    }
    getSpell(){
        return this.spell_model;
    }
    //update(dt) {
        //if (!cc.isValid(this.node)) return
        //this.time_alive += dt * 1000
        //if (this.time_alive >= this.time_to_ive) this.node.destroy()
    //}
}
