import { Ship } from './ship';

const clipEnergyAllocation = (value: number) =>
  Math.max(Math.min(value, 100), 0);

export class ShipController {
  private readonly ship: Ship;

  constructor(ship: Ship) {
    this.ship = ship;
  }

  get totalEnergyAllocation() {
    return this.ship.totalEnergyAllocation;
  }

  get totalTargetEnergyAllocation() {
    return this.ship.totalTargetEnergyAllocation;
  }

  private extrapolateReserveEnergyAllocation() {
    this.ship.reserveTargetEnergyAllocation = Math.max(
      100 - this.totalTargetEnergyAllocation,
      0,
    );
  }

  get id() {
    return this.ship.id;
  }

  // hull integrity contols
  get repairsEnergyAllocation() {
    return this.ship.repairsEnergyAllocation;
  }
  get repairsTargetEnergyAllocation() {
    return this.ship.repairsTargetEnergyAllocation;
  }
  get hullIntegrity() {
    return this.ship.hullIntegrity;
  }
  set repairsTargetEnergyAllocation(value) {
    this.ship.repairsTargetEnergyAllocation = clipEnergyAllocation(value);
    this.extrapolateReserveEnergyAllocation();
  }

  // shield controls
  get shieldsEnergyAllocation() {
    return this.ship.shieldsEnergyAllocation;
  }
  get shieldsTargetEnergyAllocation() {
    return this.ship.shieldsTargetEnergyAllocation;
  }
  get shieldCharge() {
    return this.ship.shieldCharge;
  }
  set shieldsTargetEnergyAllocation(value) {
    this.ship.shieldsTargetEnergyAllocation = clipEnergyAllocation(value);
    this.extrapolateReserveEnergyAllocation();
  }

  // weapon controls
  get weaponsEnergyAllocation() {
    return this.ship.weaponsEnergyAllocation;
  }
  get weaponsTargetEnergyAllocation() {
    return this.ship.weaponsTargetEnergyAllocation;
  }
  get weaponCharge() {
    return this.ship.weaponCharge;
  }
  set weaponsTargetEnergyAllocation(value) {
    this.ship.weaponsTargetEnergyAllocation = clipEnergyAllocation(value);
    this.extrapolateReserveEnergyAllocation();
  }

  // thruster controls
  get thrustersEnergyAllocation() {
    return this.ship.thrustersEnergyAllocation;
  }
  get thrustersTargetEnergyAllocation() {
    return this.ship.thrustersTargetEnergyAllocation;
  }
  get xPosition() {
    return this.ship.xPosition;
  }
  get yPosition() {
    return this.ship.yPosition;
  }
  get heading() {
    return this.ship.heading;
  }
  get targetHeading() {
    return this.ship.targetHeading;
  }
  get trajectory() {
    return this.ship.trajectory;
  }
  get velocity() {
    return this.ship.velocity;
  }
  get maxThrust() {
    return this.ship.maxThrust;
  }
  set thrustersTargetEnergyAllocation(value) {
    this.ship.thrustersTargetEnergyAllocation = clipEnergyAllocation(value);
    this.extrapolateReserveEnergyAllocation();
  }
  set thruster(value: number) {
    this.ship.thruster = Math.min(Math.max(value, 0), this.maxThrust);
  }
  set heading(value: number) {
    this.ship.targetHeading = ((value % 360) + 360) % 360;
  }

  // sensor controls
  get sensorsEnergyAllocation() {
    return this.ship.sensorsEnergyAllocation;
  }
  get sensorsTargetEnergyAllocation() {
    return this.ship.sensorsTargetEnergyAllocation;
  }
  set sensorsTargetEnergyAllocation(value) {
    this.ship.sensorsTargetEnergyAllocation = clipEnergyAllocation(value);
    this.extrapolateReserveEnergyAllocation();
  }

  // energy reserves controls
  get reserveEnergyAllocation() {
    return this.ship.reserveEnergyAllocation;
  }
  get reserveTargetEnergyAllocation() {
    return this.ship.reserveTargetEnergyAllocation;
  }
  get energyReserves() {
    return this.ship.energyReserves;
  }
}
