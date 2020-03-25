import { Drop } from "./models/Drop";

	const { cos, sin, PI } = Math
	
	const rad = deg => deg * PI / 180;
	export const cosd = deg => cos(rad(deg));
	export const sind = deg => sin(rad(deg));
	export const clamp = (val, min, max) => val < min ? min : val > max ? max : val
	export enum AiStatus {move, attack, idle};
	export const drop_space = 30;
	export const drop_array :number[][] = [[0,0], 
	[1,0],[1,-1], [0,-1], 
	[-1,-1], [-1,0], [-1,1], 
	[0,1], [1,1], 
	[2,1], [2,0], [2,-1], [2,-2], 
	[1,-2], [0,-2],[-1,-2],[-2,-2],
	[-2,-1],[-2,0],[-2,1],[-2,2],
	[-1,2],[0,2],[1,2],[2,2]];
	export default class MathHelpers {
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