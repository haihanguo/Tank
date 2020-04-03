import { ItemEquip } from "./Item";

export class PlayerModel {
    public Id: string;
    public Level: number;

    public BaseAttributes : Attributes;
    public EquipmentAttributes : Attributes;
    public InGameAttributes : Attributes;

    public Hp : number;
    public Mp : number;
    
    public Exp: number;
    public ExpToNext: number;
    public Gold: number;
    public EquipmentItem : Array<ItemEquip>;
    public BagItem : BagItem;

    constructor(Id: string) {
        this.Id = Id;
        this.Level = 1;
        this.BaseAttributes = PlayerModel.getBaseAttribute(this.Level);
        this.Hp = this.BaseAttributes.MaxHp;
        this.Mp = this.BaseAttributes.MaxMana;
        
        this.EquipmentAttributes = new Attributes();
        this.InGameAttributes = new Attributes(); 
        this.Exp = 0;
        this.ExpToNext = 100;
        this.Gold = 0; 
        this.EquipmentItem = new Array<ItemEquip>();
        this.BagItem = null;
    }

    static getBaseAttribute(level : number) {
        let Initial = new Attributes(); 
        Initial.MaxHp = 20 + level*5;
        Initial.MaxMana = 20 + level*8;
        Initial.DefenceMin = 0 + Math.floor(level/5); 
        Initial.DefenceMax = 1 + Math.floor(level/5);
        Initial.PhyAttackMin = 0 + Math.floor(level/5);
        Initial.PhyAttackMax = 1 + Math.floor(level/5);
        Initial.MagAttackMin = 0 + Math.floor(level/5);
        Initial.MagAttackMax = 1 + Math.floor(level/5);
        Initial.AttackSpeed = 1000;
        Initial.Accurate = 50;
        Initial.MoveSpeed = 200;
        Initial.Luck = 0;
        return Initial;
    }

    static getInGameAttribute(BaseAttributes : Attributes, EquipmentAttributes : Attributes) {
        let InGameAttributes = new Attributes(); 
        InGameAttributes.Accurate = BaseAttributes.Accurate + EquipmentAttributes.Accurate;
        InGameAttributes.AttackSpeed = BaseAttributes.AttackSpeed + EquipmentAttributes.AttackSpeed;
        InGameAttributes.DefenceMax = BaseAttributes.DefenceMax + EquipmentAttributes.DefenceMax;
        InGameAttributes.DefenceMin = BaseAttributes.DefenceMin + EquipmentAttributes.DefenceMin;
        InGameAttributes.Luck = BaseAttributes.Luck + EquipmentAttributes.Luck;
        InGameAttributes.MagAttackMax = BaseAttributes.MagAttackMax + EquipmentAttributes.MagAttackMax;
        InGameAttributes.MagAttackMin = BaseAttributes.MagAttackMin + EquipmentAttributes.MagAttackMin;
        InGameAttributes.MaxHp = BaseAttributes.MaxHp + EquipmentAttributes.MaxHp;
        InGameAttributes.MaxMana = BaseAttributes.MaxMana + EquipmentAttributes.MaxMana;
        InGameAttributes.MoveSpeed = BaseAttributes.MoveSpeed + EquipmentAttributes.MoveSpeed;
        InGameAttributes.PhyAttackMax = BaseAttributes.PhyAttackMax + EquipmentAttributes.PhyAttackMax;
        InGameAttributes.PhyAttackMin = BaseAttributes.PhyAttackMin + EquipmentAttributes.PhyAttackMin;
        return InGameAttributes;
    }
    static getEquipmentAttribute(EquipmentItem : Array<ItemEquip>) {
        let EquipmentAttributes = new Attributes();
        if(EquipmentItem === null) return EquipmentAttributes;
        EquipmentItem.forEach(element => {
            EquipmentAttributes.Accurate+= element.Accurate ;
            EquipmentAttributes.AttackSpeed+= element.AttackSpeed ;
            EquipmentAttributes.DefenceMax+= element.DefenceMax ;
            EquipmentAttributes.DefenceMin+= element.DefenceMin ;
            EquipmentAttributes.Luck+= element.Luck ;
            EquipmentAttributes.MagAttackMax+= element.MagAttackMax ;
            EquipmentAttributes.MagAttackMin+= element.MagAttackMin ;
            EquipmentAttributes.MaxHp+= element.Hp ;
            EquipmentAttributes.MaxMana+= element.Mp ;
            EquipmentAttributes.MoveSpeed+= element.MoveSpeed ;
            EquipmentAttributes.PhyAttackMax+= element.PhyAttackMax ;
            EquipmentAttributes.PhyAttackMin+= element.PhyAttackMin ;
        });       
        return EquipmentAttributes;
    }
}
export class BagItem{
    public Items;
}

export class Attributes{
    public MaxHp: number = 0;
    public MaxMana: number = 0;
    public  DefenceMin : number = 0; 
    public  DefenceMax : number = 0;
    public PhyAttackMin: number = 0;
    public PhyAttackMax: number = 0;
    public MagAttackMin: number = 0;
    public MagAttackMax: number = 0;
    public AttackSpeed: number = 0;
    public Accurate: number = 0;
    public MoveSpeed: number = 0;
    public Luck: number = 0;
}

