import MathHelpers from "../MathUtilities";
import { ItemConsumable, ItemEquip } from "./Item";

export class Drop {
    public Id: number;
    public Name: string;
    public GoldP1 : number;
    public GoldP2 : number;
    public GoldP3 : number;
    public ConsumP1 : number;
    public ConsumP2 : number;
    public ConsumP3 : number;    
    public EquipP1 : number;
    public EquipP2 : number;
    public EquipP3 : number;

    constructor(Id: number, Name: string, GoldP1: number, GoldP2: number, 
        GoldP3: number,ConsumP1: number, ConsumP2: number, ConsumP3: number, 
        EquipP1: number, EquipP2: number,EquipP3: number) {
        this.Id = Id;
        this.Name = Name;
        this.GoldP1 = GoldP1;
        this.GoldP2 = GoldP2;
        this.GoldP3 = GoldP3;
        this.ConsumP1 = ConsumP1;
        this.ConsumP2 = ConsumP2;
        this.ConsumP3 = ConsumP3;
        this.EquipP1 = EquipP1;
        this.EquipP2 = EquipP2;
        this.EquipP3 = EquipP3;
    }

    static getGoldDrop(amount: number,chance : Drop) {

        let gold_1 = amount * 1;
        let gold_2 = amount * 2;
        let gold_3 = amount * 4;
        
        let total_weight :number = chance.GoldP1 + chance.GoldP2 + chance.GoldP3;
        let weight_result :number= MathHelpers.getRandomInt(total_weight);
        let gold_drop :number = 0;
        if(weight_result <= chance.GoldP1){
            gold_drop = MathHelpers.getRandomInt(gold_1);
        }else if( weight_result > chance.GoldP1 && weight_result < (chance.GoldP1 + chance.GoldP2)){
            gold_drop = MathHelpers.getRandomInt(gold_2);
        }else{
            gold_drop = MathHelpers.getRandomInt(gold_3);
        }
        let goldname :string = '';
        if(gold_drop < 100){
            goldname = 'golds/coin_01d';
        }else if(gold_drop < 200){
            goldname = 'golds/coin_02d';
        }else if(gold_drop < 400){
            goldname = 'golds/coin_03d';
        }else if(gold_drop < 700){
            goldname = 'golds/coin_04d';
        }else if(gold_drop < 1500){
            goldname = 'golds/coin_05d';
        }
        
        let gold_model : Gold = new Gold();
        gold_model.IconPath = "assets/images/items/" + goldname, gold_drop+1;
        gold_model.Amount = gold_drop+1;
        return gold_model;
    }
    static getConsumDrop(droplist : Array<ItemConsumable>, chance : Drop) {        
        let result : Array<ItemConsumable> = new Array();
        let base_amount = 1;
        let amount_1 = base_amount;
        let amount_2 = (base_amount+1)*2;
        let amount_3 = (base_amount+2)*2;

        let total_weight :number = chance.ConsumP1 + chance.ConsumP2 + chance.ConsumP3;
        let weight_result :number= MathHelpers.getRandomInt(total_weight);
        let amount_drop :number = 0;
        if(weight_result <= chance.ConsumP1){
            amount_drop = MathHelpers.getRandomInt(amount_1);
        }else if( weight_result > chance.ConsumP1 && weight_result < (chance.ConsumP1 + chance.ConsumP2)){
            amount_drop = MathHelpers.getRandomInt(amount_2);
        }else{
            amount_drop = MathHelpers.getRandomInt(amount_3);
        }
        //for test
        amount_drop = 1;

        for(let i = 0; i < amount_drop; i++){
            result.push(droplist[MathHelpers.getRandomInt(droplist.length)]);
        }
        return result;
    }
    static getEquipDrop(droplist : Array<ItemEquip>, chance : Drop) {        
        let result : Array<ItemEquip> = new Array();
        let base_amount = 0;
        let amount_1 = base_amount;
        let amount_2 = (base_amount+1)*2;
        let amount_3 = (base_amount+2)*2;

        let total_weight :number = chance.EquipP1 + chance.EquipP2 + chance.EquipP3;
        let weight_result :number= MathHelpers.getRandomInt(total_weight);
        let max_drop :number = 0;
        if(weight_result <= chance.EquipP1){
            max_drop = MathHelpers.getRandomInt(amount_1);
        }else if( weight_result > chance.EquipP1 && weight_result < (chance.EquipP1 + chance.EquipP2)){
            max_drop = MathHelpers.getRandomInt(amount_2);
        }else{
            max_drop = MathHelpers.getRandomInt(amount_3);
        }
        //random different consume type
        let amount_drop = MathHelpers.getRandomInt(max_drop);
        //for test
        amount_drop = 1;
        for(let i = 0; i < amount_drop; i++){
            result.push(droplist[MathHelpers.getRandomInt(droplist.length)]);
        }
        return result;
    }
}

export class Gold{
    public Amount : number;
    public IconPath : string;
}