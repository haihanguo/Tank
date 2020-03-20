	const { cos, sin, PI } = Math
	
	const rad = deg => deg * PI / 180;
	export const cosd = deg => cos(rad(deg));
	export const sind = deg => sin(rad(deg));
	export const clamp = (val, min, max) => val < min ? min : val > max ? max : val
	export enum AiStatus {move, attack, idle};


	export default class MathHelpers {
		
		static getGoldDrop(weight1:number, val1: number, weight2:number, val2: number, weight3: number, val3: number) {
			let total_weight :number = weight1 + weight2 + weight3;
			let weight_result :number= this.getRandomInt(total_weight);
			let gold_drop :number = 0;
			if(weight_result <= weight1){
				gold_drop = this.getRandomInt(val1);
			}else if( weight_result > weight1 && weight_result < (weight1 + weight2)){
				gold_drop = this.getRandomInt(val2);
			}else{
				gold_drop = this.getRandomInt(val3);
			}
			return gold_drop;
		}
		static getRandomInt(val: number) {
			return Math.floor(Math.random() * Math.floor(val));
		}
		static lookAtObj(target : cc.Vec2, self : cc.Vec2){        
			var dx : number= target.x - self.x;
			var dy : number = target.y - self.y;
			var dir: cc.Vec2 = cc.v2(dx,dy);
			var angle: number = dir.signAngle(cc.v2(1,0));
			return angle;
		}
		static distanceToObj(target : cc.Vec2, self : cc.Vec2){
			var dx : number= target.x - self.x;
			var dy : number = target.y - self.y;
			var distance : number = Math.sqrt((dx*dx)+(dy*dy));
			return distance;
		}
	}