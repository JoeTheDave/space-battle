import './index.css';
import { Game } from './game';

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
new Game(canvas);
