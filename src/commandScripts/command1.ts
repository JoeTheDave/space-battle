import { random } from 'lodash';
import { CommandController } from '../commandController';

const commandScript = (command: CommandController) => {
  command.ships.forEach((ship) => {
    ship.thrustersTargetEnergyAllocation = 100;
    if (ship.velocity <= 400 && command.elapsedTimeFromLastFrame < 2) {
      ship.thruster = ship.maxThrust;
    } else {
      if (!command.log[`ship-${ship.id}-heading`]) {
        command.log[`ship-${ship.id}-heading`] = (ship.heading + 180) % 360;
      }
      ship.thruster = 0;
      ship.heading = command.log[`ship-${ship.id}-heading`];
    }
    if (
      command.log[`ship-${ship.id}-heading`] &&
      ship.heading === command.log[`ship-${ship.id}-heading`]
    ) {
      ship.thruster = ship.maxThrust;
    }
  });
};

export default commandScript;
