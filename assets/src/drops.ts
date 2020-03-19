// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class drops extends cc.Component {

    @property({type:cc.AudioClip})
    pickup_sound : cc.AudioClip = null;

    public drop_type : string = null;
    public drop_amount : number = null;

    onLoad(){
        this.node.zIndex = -2;
        this.setDropSprite();
    }
    start () {
        
    }
    onDestroy(){
        console.log('picked');
        cc.audioEngine.playEffect(this.pickup_sound, false);
    }

    setDropDetails(drop_type : string, drop_amount? : number){
        this.drop_type = drop_type;
        this.drop_amount = drop_amount;
    }

    setDropSprite(){
        let gold_amount :string = '';
        let sprite_path : string = '';
        let self : cc.Node = this.node;
        if(this.drop_type === "gold"){
            if(this.drop_amount < 1000){
                gold_amount = 'small';
            }else if(this.drop_amount < 3000){
                gold_amount = 'mid';
            }else{
                gold_amount = 'large';
            }
        }
        sprite_path = "assets/images/drops/golds/gold_"+gold_amount;
        var image = cc.url.raw("resources/texture/game/newsprite.png");
        
        cc.loader.loadRes(sprite_path, cc.SpriteFrame, function (err, spriteFrame) {
            console.log(self, spriteFrame);
            self.getChildByName('drop_sprite').getComponent(cc.Sprite).spriteFrame = spriteFrame;
             
        });
    }
    // update (dt) {}
}
