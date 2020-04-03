
    export class Item {
        public Id: number;
        public Name: string;
        public Description: string;
        
        public Capacity : number;
        public ItemType : ItemType;

        public Price : number;
        public IconPath : string;
        public uuid : string;
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
        
        public  Hp : number = 0;
        public  Mp : number = 0;
        public  PhyAttackMin : number = 0;
        public  PhyAttackMax : number = 0;
        public  MagAttackMin : number = 0;   
        public  MagAttackMax : number = 0;  
        public  DefenceMin : number = 0; 
        public  DefenceMax : number = 0;
        public  Accurate: number = 0;
        public  MoveSpeed: number = 0;
        public  AttackSpeed : number = 0;
        public  LevelRequire : number = 0;
        public  Luck : number = 0;

        constructor(Id: number, Name: string, Description: string, Capacity: number, ItemType: number, Price: number, IconPath: string) { 
            super(Id, Name, Description, Capacity, ItemType, Price, IconPath);
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