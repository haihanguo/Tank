import { ItemEquip } from "./Item";

export class PlayerModel {
    public Id: number;
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
    public EquipmentItem : PlayerEquipment;
    public BagItem : BagItem;
    
    constructor(Id: number) {
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
        this.EquipmentItem = null;
        this.BagItem = null;
    }
}

export class PlayerEquipment{
    public Head : ItemEquip;
    public Chest : ItemEquip;
    public Waist : ItemEquip;
    public Foot : ItemEquip;
    public Hand : ItemEquip;
    public Offhand : ItemEquip;
    public Neck : ItemEquip;
    public Finger1 : ItemEquip;
    public Finger2 : ItemEquip;
}

export class BagItem{
    public Items;
}