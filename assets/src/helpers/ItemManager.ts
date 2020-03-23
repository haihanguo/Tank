import {Item, ItemType, ItemEquip, ItemConsumable, EquipType} from '../models/Item'

export class ItemManager extends cc.Component{
    public IniItemList(){
        var itemList = new Array();
        cc.loader.loadRes('./ItemJSON', function (err, jsonAsset) {
            for(let json_item of jsonAsset.json){
                let id : number = json_item.id;
                let name: string = json_item.name;
                let desc: string = json_item.desc;
                let capacity :number = json_item.capacity;
                let price: number = json_item.price;
                let icon_path : string = json_item.icon;

                let type : string = json_item.type;
                let item : Item = null;
                if(type === ItemType.Equip.toString()){
                    let equiptype : EquipType = json_item.equiptype;
                    let phyatkmin : number = json_item.phyatkmin;
                    let phyatkmax : number = json_item.phyatkmax;
                    let magatkmin : number = json_item.magatkmin;
                    let magatkmax : number = json_item.magatkmax;
                    let defmin : number = json_item.defmin;
                    let defmax : number = json_item.defmax;
                    let speed : number = json_item.speed;
                    let luck : number = json_item.luck;

                    item = new ItemEquip(id, name, desc, capacity, parseInt(type), price, icon_path, equiptype, phyatkmin,phyatkmax, magatkmin,magatkmax, defmin,defmax, speed, luck);
                    itemList.push(item);
                }else if(type === ItemType.Consumable.toString()){
                    let hp :number = json_item.hp;
                    let mp :number = json_item.mp;
                    let rs : number = json_item.rs;
                    let stack : number = json_item.stack;
                    item = new ItemConsumable(id, name, desc, capacity, parseInt(type), price, icon_path, hp, mp, rs, stack);
                    itemList.push(item);
                }
            }            
        }); 
        return itemList;       
    }
}