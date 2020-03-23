export class Mob {
    public Id: number;
    public Name: string;
    public Hp : number;
    public AttackMin : number;
    public AttackMax : number;
    public Defence : number;
    public Exp : number;
    public AttackGap : number;    
    public Speed : number;

    constructor(Id: number, Name: string, Hp: number, AttackMin: number, 
        AttackMax: number,Defence: number, Exp: number, Speed: number, AttackGap: number) {
        this.Id = Id;
        this.Name = Name;
        this.Hp = Hp;
        this.AttackMin = AttackMin;
        this.AttackMax = AttackMax;
        this.Defence = Defence;
        this.AttackGap = AttackGap;
        this.Exp = Exp;
        this.Speed = Speed;
    }
}