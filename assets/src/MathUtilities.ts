	const { cos, sin, PI } = Math
	
	const rad = deg => deg * PI / 180;
	export const cosd = deg => cos(rad(deg));
	export const sind = deg => sin(rad(deg));
	export const clamp = (val, min, max) => val < min ? min : val > max ? max : val
	export enum AiStatus {move, attack, idle};