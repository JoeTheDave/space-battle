export class Ship {
  graphic: HTMLImageElement;
  squad: string;
  id: number;

  xPosition: number;
  yPosition: number;
  heading: number;
  targetHeading: number;
  trajectory: number;
  velocity: number = 0;
  thruster: number = 0;
  maxThrust: number = 0;

  energyReserves: number = 0;

  hullIntegrity: number = 100;
  shieldCharge: number = 0;
  weaponCharge: number = 0;

  repairsEnergyAllocation: number = 0;
  shieldsEnergyAllocation: number = 0;
  weaponsEnergyAllocation: number = 0;
  thrustersEnergyAllocation: number = 0;
  sensorsEnergyAllocation: number = 0;
  reserveEnergyAllocation: number = 100;

  repairsTargetEnergyAllocation: number = 0;
  shieldsTargetEnergyAllocation: number = 0;
  weaponsTargetEnergyAllocation: number = 0;
  thrustersTargetEnergyAllocation: number = 0;
  sensorsTargetEnergyAllocation: number = 0;
  reserveTargetEnergyAllocation: number = 100;

  get totalEnergyAllocation() {
    return (
      this.repairsEnergyAllocation +
      this.shieldsEnergyAllocation +
      this.weaponsEnergyAllocation +
      this.thrustersEnergyAllocation +
      this.sensorsEnergyAllocation
    );
  }

  get totalTargetEnergyAllocation() {
    return (
      this.repairsTargetEnergyAllocation +
      this.shieldsTargetEnergyAllocation +
      this.weaponsTargetEnergyAllocation +
      this.thrustersTargetEnergyAllocation +
      this.sensorsTargetEnergyAllocation
    );
  }

  constructor(
    image: string,
    squad: string,
    id: number,
    xPos: number,
    yPos: number,
    heading: number,
  ) {
    const shipImage = new Image();
    shipImage.src = image;
    this.graphic = shipImage;

    this.squad = squad;
    this.id = id;

    this.xPosition = xPos;
    this.yPosition = yPos;
    this.heading = heading;
    this.targetHeading = heading;
    this.trajectory = heading;
  }
}
