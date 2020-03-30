
    export class Item {
        public Id: number;
        public Name: string;
        public Description: string;
        
        public Capacity : number;
        public ItemType : ItemType;

        public Price : number;
        public IconPath : string;

        constructor(Id: number, Name: string, Description: string, Capacity: number, ItemType: number, Price: number, IconPath: string) {
            this.Id = Id;
            this.Name = Name;
            this.Description = Description;
            this.Capacity = Capacity;
            this.ItemType = ItemType;
            this.Price = Price;
            this.IconPath = IconPath;
        }
    }
    export class ItemEquip extends Item
    {
        public EquipType: EquipType;
    
        public  PhysicAttackMin : number;
        public  PhysicAttackMax : number;
        public  MagicAttackMin : number;   
        public  MagicAttackMax : number;  
        public  DefenceMin : number; 
        public  DefenceMax : number;
        public  Speed : number;
        public  Level : number;
        public  Luck : number;

        constructor(Id: number, Name: string, Description: string, Capacity: number, ItemType: number, Price: number, IconPath: string, 
            EquipType: EquipType, PhysicAttackMin : number, PhysicAttackMax : number, MagicAttackMin : number, MagicAttackMax : number, 
            DefenceMin : number, DefenceMax : number, Speed : number,Level : number, Luck : number) { 
            super(Id, Name, Description, Capacity, ItemType, Price, IconPath);
            this.EquipType = EquipType;
            this.PhysicAttackMin = PhysicAttackMin;
            this.PhysicAttackMax = PhysicAttackMax;
            this.MagicAttackMin = MagicAttackMin;
            this.MagicAttackMax = MagicAttackMax;
            this.DefenceMin = DefenceMin;
            this.DefenceMax = DefenceMax;
            this.Speed = Speed;
            this.Level = Level;
            this.Luck =Luck;
        }
    }


    export class ItemConsumable extends Item
    {
        public  HpRecover : number;
        public  MpRecover : number;   
        public  RecoverSpeed : number; 
        public  Stack : number;

        constructor(Id: number, Name: string, Description: string, Capacity: number, ItemType: number, Price: number, IconPath: string, 
            HpRecover : number, MpRecover : number, RecoverSpeed : number, Stack : number) { 
            super(Id, Name, Description, Capacity, ItemType, Price, IconPath);
            this.HpRecover = HpRecover;
            this.MpRecover = MpRecover;
            this.RecoverSpeed = RecoverSpeed;
            this.Stack = Stack;
        }
    }

    export enum ItemType
    {
        Equip,      
        Consumable
    }

    export enum EquipType {
    Weapon = "Weapon",
    Helmet = "Helmet",
    Armor = "Armor",
    Necklace = "Necklace",
    Ring = "Ring",
    Belt = "Belt",
    Shoes = "Shoes",
    OffHandWeapon = "OffHandWeapon"
}