import { Item, ItemConsumable, ItemEquip } from "./Item";
import { Gold } from "./Drop";

export class MobModel {
    public Id: number;
    public Name: string;
    public Hp : number;
    public AttackMin : number;
    public AttackMax : number;
    public PhyDef : number;
    public MagDef : number;
    public Exp : number;
    public AttackRange : number;
    public AttackGap : number;    
    public MoveSpeed : number;
    public AlertDistance : number;

    public GoldDrop : Gold = new Gold();
    public ConsumeItemDropList : Array<ItemConsumable> = new Array();
    public EquipItemDropList : Array<ItemEquip> = new Array();

    public Rare : boolean;
    public RareConsumeItemDropList : Array<ItemConsumable> = new Array();
    public RareEquipItemDropList : Array<ItemConsumable> = new Array();

    public uuid : string;
    
    constructor(Id: number, Name: string, Model ? : MobModel) {
        this.Id = Id;
        this.Name = Name;
        if(Model != undefined){
            this.Hp = Model.Hp;
            this.AttackMin = Model.AttackMin;
            this.AttackMax = Model.AttackMax;
            this.PhyDef = Model.PhyDef;
            this.MagDef = Model.MagDef;
            this.Exp = Model.Exp;
            this.AttackGap = Model.AttackGap;
            this.MoveSpeed = Model.MoveSpeed;
            this.AlertDistance = Model.AlertDistance;
            this.GoldDrop = Model.GoldDrop;
            this.ConsumeItemDropList = Model.ConsumeItemDropList;
            this.EquipItemDropList = Model.EquipItemDropList;
            this.Rare = Model.Rare;
            this.RareConsumeItemDropList = Model.RareConsumeItemDropList;
            this.RareEquipItemDropList = Model.RareEquipItemDropList;
        }
    }
}