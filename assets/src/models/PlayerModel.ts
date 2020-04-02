import { ItemEquip } from "./Item";

export class PlayerModel {
    public Id: string;
    public Level: number;
    public MaxHp: number;
    public MaxMana: number;
    public PhyAttackMin: number;
    public PhyAttackMax: number;
    public MagAttackMin: number;
    public MagAttackMax: number;
    public AttackSpeed: number;
    public Accurate: number;
    public MoveSpeed: number;
    public Luck: number;
    public Exp: number;
    public ExpToNext: number;
    public Gold: number;
    public EquipmentItem : Array<ItemEquip>;
    public BagItem : BagItem;
    
    public BaseAccurate : number;
    public BaseMoveSpeed : number;
    public BaseAttackSpeed: number;

    constructor(Id: string) {
        this.Id = Id;
        this.Level = 1;        
        this.MaxHp = 20;
        this.MaxMana = 20;
        this.PhyAttackMin = 0;
        this.PhyAttackMax = 1;
        this.MagAttackMin = 0;
        this.MagAttackMax = 1;
        this.AttackSpeed = 0;
        this.Accurate = 0;
        this.MoveSpeed = 0;
        this.Luck = 0;
        this.Exp = 0;
        this.ExpToNext = 100;
        this.Gold = 0; 

        this.BaseAccurate = 50;
        this.BaseMoveSpeed = 200;
        this.BaseAttackSpeed = 1000;

        this.EquipmentItem = null;
        this.BagItem = null;
    }
    static updateStatus(player: PlayerModel) {
        let additionalAttributes : EquipmentAttributes = new EquipmentAttributes();
        player.EquipmentItem.forEach(element => {     
            additionalAttributes.MaxHp += element.;
            additionalAttributes.Luck += element.Luck;
            additionalAttributes.Luck += element.Luck;
            additionalAttributes.Luck += element.Luck;
            additionalAttributes.Luck += element.Luck;
            additionalAttributes.Luck += element.Luck;       
            additionalAttributes.Luck += element.Luck;
        });
        return player;
    }
    
}
export class BagItem{
    public Items;
}

export class EquipmentAttributes{
    public MaxHp: number;
    public MaxMana: number;
    public PhyAttackMin: number;
    public PhyAttackMax: number;
    public MagAttackMin: number;
    public MagAttackMax: number;
    public AttackSpeed: number;
    public Accurate: number;
    public MoveSpeed: number;
    public Luck: number;

}

