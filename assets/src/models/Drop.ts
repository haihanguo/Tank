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
}