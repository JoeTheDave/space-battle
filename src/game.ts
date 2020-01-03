import blueShip from './assets/blue-ship.svg';
import redShip from './assets/red-ship.svg';
import { Ship } from './ship';
import { ShipController } from './shipController';
import { CommandController } from './commandController';
import commandScript from './commandScripts/command1';

const radiansToDegrees = (radians: number) => (radians * 180) / Math.PI;
const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export class Game {
  context: CanvasRenderingContext2D;
  startTime: number;
  timestamp: number;
  elapsedTimeFromLastFrame: number;
  totalElapsedTime: number;

  readonly energyTransferPerSecond = 10;
  readonly reserveEnergyRate = 10;
  readonly shipSize: number = 30;
  readonly maxShipThrust: number = 10;
  readonly maxRotationalThrust: number = 360;

  ships: Ship[];
  blueFleetCommandController: CommandController;
  redFleetCommandController: CommandController;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to create context');
    }
    this.context = ctx;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.save();
    this.timestamp = new Date().getTime();
    this.startTime = this.timestamp;
    this.elapsedTimeFromLastFrame = 0;
    this.totalElapsedTime = 0;

    this.ships = [
      new Ship(blueShip, 'blue', 1, 120, 140, 110),
      new Ship(blueShip, 'blue', 2, 100, 220, 110),
      new Ship(blueShip, 'blue', 3, 80, 300, 110),
      new Ship(blueShip, 'blue', 4, 60, 380, 110),
      new Ship(blueShip, 'blue', 5, 40, 460, 110),

      new Ship(
        redShip,
        'red',
        1,
        ctx.canvas.width - 120,
        ctx.canvas.height - 140,
        290,
      ),
      new Ship(
        redShip,
        'red',
        2,
        ctx.canvas.width - 100,
        ctx.canvas.height - 220,
        290,
      ),
      new Ship(
        redShip,
        'red',
        3,
        ctx.canvas.width - 80,
        ctx.canvas.height - 300,
        290,
      ),
      new Ship(
        redShip,
        'red',
        4,
        ctx.canvas.width - 60,
        ctx.canvas.height - 380,
        290,
      ),
      new Ship(
        redShip,
        'red',
        5,
        ctx.canvas.width - 40,
        ctx.canvas.height - 460,
        290,
      ),
    ];

    const bluefleet = this.ships.filter((ship) => ship.squad === 'blue');
    this.blueFleetCommandController = new CommandController(
      bluefleet.map((ship) => new ShipController(ship)),
      this,
    );

    const redfleet = this.ships.filter((ship) => ship.squad === 'red');
    this.redFleetCommandController = new CommandController(
      redfleet.map((ship) => new ShipController(ship)),
      this,
    );

    window.requestAnimationFrame(() => this.nextFrame());
  }

  clear() {
    this.context.save();
    this.context.fillStyle = 'rgba(255, 255, 255, 1)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }

  drawShip(ship: Ship) {
    this.context.save();
    this.context.translate(ship.xPosition, ship.yPosition);
    this.context.fillStyle = 'rgba(32, 32, 32, 1)';
    this.context.font = '12px serif';
    this.context.fillText(`${ship.id}`, -25, -15);
    this.context.rotate(degreesToRadians(ship.heading));
    this.context.drawImage(
      ship.graphic,
      0 - this.shipSize / 2,
      0 - this.shipSize / 2,
      this.shipSize,
      this.shipSize,
    );
    this.context.restore();
  }

  drawEllapsedTime() {
    this.context.save();
    this.context.translate(0, 0);
    this.context.font = '20px serif';
    this.context.fillStyle = 'rgba(100, 100, 100, 1)';
    this.context.fillText(`Time: ${this.totalElapsedTime}`, 10, 20);
    this.context.fillText(
      `Frame Rate: ${this.elapsedTimeFromLastFrame}`,
      10,
      40,
    );
    this.context.restore();
  }

  drawShipConsole(ship: Ship) {
    this.context.save();

    this.context.beginPath();
    this.context.strokeStyle = 'rgba(100, 100, 100, 1)';
    if (ship.squad === 'blue') {
      this.context.translate(
        (ship.id - 1) * 180,
        this.context.canvas.height - 225,
      );
    } else {
      this.context.translate(
        this.context.canvas.width - (6 - ship.id) * 180,
        0,
      );
    }

    this.context.rect(0, 0, 180, 225);
    this.context.stroke();

    this.context.font = '14px serif';
    this.context.fillStyle = 'rgba(100, 100, 100, 1)';
    this.context.fillText(`${ship.squad.toUpperCase()}-${ship.id}`, 5, 15);
    this.context.fillText('Hull:', 7, 30);
    this.context.fillText('Shield:', 7, 45);
    this.context.fillText('Weapon:', 7, 60);
    this.context.fillText(`Heading:`, 7, 75);
    if (ship.hullIntegrity) {
      this.context.fillText(
        `${ship.heading.toFixed(2)}°@${ship.velocity.toFixed(1)}`,
        70,
        76,
      );
    }

    this.context.fillText('Sensors:', 7, 90);
    this.context.fillText('Energy:', 7, 105);

    this.context.fillText('Energy Allocation', 5, 125);
    this.context.fillText('Repairs:', 7, 140);
    this.context.fillText('Shields:', 7, 155);
    this.context.fillText('Weapons:', 7, 170);
    this.context.fillText('Thrusters:', 7, 185);
    this.context.fillText('Sensors:', 7, 200);
    this.context.fillText('Reserves:', 7, 215);

    this.drawConsoleBar(70, 20, ship.hullIntegrity, -1, 'rgba(59, 255, 0, 1)');
    this.drawConsoleBar(70, 35, ship.shieldCharge, -1, 'rgba(0, 255, 183, 1)');
    this.drawConsoleBar(70, 50, ship.weaponCharge, -1, 'rgba(255, 0, 26, 1)');
    this.drawConsoleBar(
      70,
      95,
      ship.energyReserves,
      -1,
      'rgba(242, 0, 255, 1)',
    );
    this.drawConsoleBar(
      70,
      130,
      ship.repairsEnergyAllocation,
      ship.repairsTargetEnergyAllocation,
      'rgba(162, 0, 255, 1)',
    );
    this.drawConsoleBar(
      70,
      145,
      ship.shieldsEnergyAllocation,
      ship.shieldsTargetEnergyAllocation,
      'rgba(162, 0, 255, 1)',
    );
    this.drawConsoleBar(
      70,
      160,
      ship.weaponsEnergyAllocation,
      ship.weaponsTargetEnergyAllocation,
      'rgba(162, 0, 255, 1)',
    );
    this.drawConsoleBar(
      70,
      175,
      ship.thrustersEnergyAllocation,
      ship.thrustersTargetEnergyAllocation,
      'rgba(162, 0, 255, 1)',
    );
    this.drawConsoleBar(
      70,
      190,
      ship.sensorsEnergyAllocation,
      ship.sensorsTargetEnergyAllocation,
      'rgba(162, 0, 255, 1)',
    );
    this.drawConsoleBar(
      70,
      205,
      ship.reserveEnergyAllocation,
      ship.reserveTargetEnergyAllocation,
      'rgba(162, 0, 255, 1)',
    );

    this.context.restore();
  }

  drawConsoleBar(
    x: number,
    y: number,
    value: number,
    setting: number,
    color: string,
  ) {
    this.context.save();
    this.context.strokeStyle = 'rgba(100, 100, 100, 1)';
    this.context.rect(x, y + 1, 102, 10);
    this.context.stroke();
    this.context.fillStyle = color;
    this.context.fillRect(x + 1, y + 2, value, 8);
    if (value !== setting && setting !== -1) {
      this.context.fillStyle = 'rgba(255, 152, 26, 1)';
      this.context.fillRect(x + setting, y + 2, 2, 8);
    }

    this.context.restore();
  }

  transferShipPower(ship: Ship) {
    const energyTargetKeys = [
      'repairs',
      'shields',
      'weapons',
      'thrusters',
      'sensors',
      'reserve',
    ];
    const inFlowKeys = energyTargetKeys.filter(
      (key) =>
        ((ship as any)[`${key}TargetEnergyAllocation`] as number) >
        ((ship as any)[`${key}EnergyAllocation`] as number),
    );
    const inFlowRate = this.energyTransferPerSecond / inFlowKeys.length;
    const outFlowKeys = energyTargetKeys.filter(
      (key) =>
        ((ship as any)[`${key}TargetEnergyAllocation`] as number) <
        ((ship as any)[`${key}EnergyAllocation`] as number),
    );
    const outFlowRate = this.energyTransferPerSecond / outFlowKeys.length;

    inFlowKeys.forEach((key) => {
      ((ship as any)[`${key}EnergyAllocation`] as number) +=
        inFlowRate * this.elapsedTimeFromLastFrame;
      if (
        ((ship as any)[`${key}EnergyAllocation`] as number) >
        ((ship as any)[`${key}TargetEnergyAllocation`] as number)
      ) {
        ((ship as any)[`${key}EnergyAllocation`] as number) = (ship as any)[
          `${key}TargetEnergyAllocation`
        ] as number;
      }
    });
    outFlowKeys.forEach((key) => {
      ((ship as any)[`${key}EnergyAllocation`] as number) -=
        outFlowRate * this.elapsedTimeFromLastFrame;

      if (
        ((ship as any)[`${key}EnergyAllocation`] as number) <
        ((ship as any)[`${key}TargetEnergyAllocation`] as number)
      ) {
        ((ship as any)[`${key}EnergyAllocation`] as number) = (ship as any)[
          `${key}TargetEnergyAllocation`
        ] as number;
      }
    });

    if (ship.reserveEnergyAllocation > 0) {
      ship.energyReserves = Math.min(
        ship.energyReserves +
          (ship.reserveEnergyAllocation / 100) *
            this.reserveEnergyRate *
            this.elapsedTimeFromLastFrame,
        100,
      );
    }
    if (ship.totalEnergyAllocation > 100) {
      const overage = ship.totalEnergyAllocation - 100;
      const burnRate =
        (overage / 100) *
        this.reserveEnergyRate *
        this.elapsedTimeFromLastFrame;
      if (ship.energyReserves > 0) {
        ship.energyReserves = Math.max(0, ship.energyReserves - burnRate);
      } else {
        ship.hullIntegrity = Math.max(0, ship.hullIntegrity - burnRate);
      }
    }
    ship.maxThrust =
      this.maxShipThrust * (ship.thrustersEnergyAllocation / 100);
    ship.thruster = Math.min(ship.thruster, ship.maxThrust);
  }

  maneuverShip(ship: Ship) {
    // Angular correction
    const angularDifference =
      ((ship.targetHeading - ship.heading + 180) % 360) - 180;
    const correctionAngle =
      angularDifference < -180 ? angularDifference + 360 : angularDifference;
    const rotationalThrust =
      (ship.thrustersEnergyAllocation / 100) *
      this.maxRotationalThrust *
      this.elapsedTimeFromLastFrame *
      Math.sign(correctionAngle);
    if (Math.abs(rotationalThrust) > Math.abs(correctionAngle)) {
      ship.heading = ship.targetHeading;
    } else {
      ship.heading = (ship.heading + (rotationalThrust % 360) + 360) % 360;
    }
    // Movement
    const xVelocity =
      Math.sin(degreesToRadians(ship.trajectory)) * ship.velocity;
    const yVelocity =
      Math.cos(degreesToRadians(ship.trajectory)) * ship.velocity * -1;
    const xThrust = Math.sin(degreesToRadians(ship.heading)) * ship.thruster;
    const yThrust =
      Math.cos(degreesToRadians(ship.heading)) * ship.thruster * -1;
    const acceleratedXVelocity = xVelocity + xThrust;
    const acceleratedYVelocity = yVelocity + yThrust;

    ship.velocity =
      Math.sqrt(
        Math.pow(acceleratedXVelocity, 2) + Math.pow(acceleratedYVelocity, 2),
      ) || 0;
    if (ship.velocity) {
      if (acceleratedXVelocity >= 0 && acceleratedYVelocity < 0) {
        ship.trajectory = radiansToDegrees(
          Math.asin(acceleratedXVelocity / ship.velocity),
        );
      }
      if (acceleratedXVelocity >= 0 && acceleratedYVelocity >= 0) {
        ship.trajectory =
          180 -
          radiansToDegrees(Math.asin(acceleratedXVelocity / ship.velocity));
      }
      if (acceleratedXVelocity < 0 && acceleratedYVelocity >= 0) {
        ship.trajectory =
          180 -
          radiansToDegrees(Math.asin(acceleratedXVelocity / ship.velocity));
      }
      if (acceleratedXVelocity < 0 && acceleratedYVelocity < 0) {
        ship.trajectory =
          360 +
          radiansToDegrees(Math.asin(acceleratedXVelocity / ship.velocity));
      }
      ship.xPosition += acceleratedXVelocity * this.elapsedTimeFromLastFrame;
      ship.yPosition += acceleratedYVelocity * this.elapsedTimeFromLastFrame;

      if (
        ship.xPosition < 0 - this.shipSize ||
        ship.xPosition > this.context.canvas.width + this.shipSize ||
        ship.yPosition < 0 - this.shipSize ||
        ship.yPosition > this.context.canvas.height + this.shipSize
      ) {
        ship.hullIntegrity = 0;
      }
    }
  }

  nextFrame() {
    const time = new Date().getTime();
    this.elapsedTimeFromLastFrame = (time - this.timestamp) / 1000;
    this.timestamp = time;
    this.totalElapsedTime = (time - this.startTime) / 1000;

    commandScript(this.blueFleetCommandController);
    commandScript(this.redFleetCommandController);

    this.ships.forEach((ship) => this.transferShipPower(ship));
    this.ships.forEach((ship) => this.maneuverShip(ship));

    this.clear();

    this.drawEllapsedTime();
    this.ships.forEach((ship) => this.drawShipConsole(ship));
    this.ships.forEach((ship) => this.drawShip(ship));
    window.requestAnimationFrame(() => this.nextFrame());
  }
}
