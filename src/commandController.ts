import { ShipController } from './shipController';
import { Game } from './game';

export class CommandController {
  ships: ShipController[];
  ship1: ShipController;
  ship2: ShipController;
  ship3: ShipController;
  ship4: ShipController;
  ship5: ShipController;
  private readonly game: Game;
  public log: any;

  constructor(ships: ShipController[], game: Game) {
    this.ships = ships;
    this.ship1 = ships[0];
    this.ship2 = ships[1];
    this.ship3 = ships[2];
    this.ship4 = ships[3];
    this.ship5 = ships[4];
    this.game = game;
    this.log = {};
  }

  get elapsedTimeFromLastFrame() {
    return this.game.elapsedTimeFromLastFrame;
  }

  get totalElapsedTime() {
    return this.game.totalElapsedTime;
  }

  get scenarioWidth() {
    return this.game.context.canvas.width;
  }

  get scenarioHeight() {
    return this.game.context.canvas.height;
  }
}
