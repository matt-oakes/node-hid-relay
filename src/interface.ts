import HID from "node-hid";
import { isDCTTechRelay, openHidDevice } from "./utils.js";
import {
  HidRelayBoard,
  HidRelayBoardConnectionOptions,
  ListHidRelayBoardsOptions,
} from "./types.js";
import { COMMAND_ON, COMMAND_SET_SERIAL } from "./constants.js";
import { COMMAND_OFF } from "./constants.js";

/**
 * List all HID USB relay boards available on the system along with the state they are currently in.
 */
export const listHidRelayBoards = async ({
  fetchState = true,
}: ListHidRelayBoardsOptions = {}): Promise<HidRelayBoard[]> => {
  // Get the devices from node-hid and filter out to only those which are known USB relay boards
  const devices = await HID.devicesAsync();
  const relayDevices = devices.filter((device) => {
    // DCTTech.com USB Relay
    if (isDCTTechRelay(device)) {
      return true;
    }
    return false;
  });

  // Get the state of the relay devices
  const relayBoards = fetchState
    ? await Promise.all(
        relayDevices.map(async (device): Promise<HidRelayBoard | undefined> => {
          // DCTTech.com USB Relay
          if (isDCTTechRelay(device)) {
            let relay: HID.HIDAsync | undefined = undefined;
            try {
              // Get the relay count from the end of the product name. If this isn't in the correct format return undefined
              const relayCountString = device.product?.replace("USBRelay", "");
              const relayCount = relayCountString
                ? parseInt(relayCountString)
                : Number.NaN;
              if (Number.isNaN(relayCount) || !Number.isInteger(relayCount)) {
                // TODO: Log a warning
                return undefined;
              }

              // Open a connection to the relay and get the feature report to get the serial number and state
              relay = await openHidDevice(device);
              const featureReport = await relay.getFeatureReport(0x01, 0x08);
              const serialNumber = featureReport
                .subarray(0, 5)
                .toString("ascii");
              const relayStatesByte = featureReport.at(7) || 0;

              // Use a bitmask to get the state of each relay
              const relayStates = [];
              for (let i = 0; i < relayCount; i++) {
                relayStates.push((relayStatesByte & (1 << i)) !== 0);
              }

              return { ...device, serialNumber, relayCount, relayStates };
            } catch {
              // TODO: Log an error
              return undefined;
            } finally {
              // Make sure the connection is closed
              relay?.close();
            }
          }
          // TODO: Add support for other relay types
          // TODO: Log a warning
          return undefined;
        }),
      )
    : relayDevices;

  // Return the relay boards that were successfully opened and had state
  return relayBoards.filter((board) => !!board);
};

/**
 * Find a device by the serial number
 */
export const findHidRelayBoardBySerialNumber = async (
  serialNumber: string,
): Promise<HidRelayBoard | undefined> => {
  const boards = await listHidRelayBoards();
  return boards.find((board) => board.serialNumber === serialNumber);
};

/**
 * Set the state of a relay on a HID relay board
 * Note: This function will not check that the relay index is valid as some relays do not report the number of relays available
 */
export const setHidRelayState = async (
  boardConnectionOptions: HidRelayBoardConnectionOptions,
  relayIndex: number,
  state: boolean,
): Promise<void> => {
  let relay: HID.HIDAsync | undefined = undefined;
  try {
    const device =
      "serialNumber" in boardConnectionOptions
        ? await findHidRelayBoardBySerialNumber(
            boardConnectionOptions.serialNumber,
          )
        : boardConnectionOptions;
    if (!device) {
      throw new Error(`Unable to find board`);
    }
    relay = await openHidDevice(device);
    await relay.write([0x00, state ? COMMAND_ON : COMMAND_OFF, relayIndex + 1]);
  } finally {
    relay?.close();
  }
};

/**
 * Set the serial number of a HID relay board
 */
export const setHidRelaySerialNumber = async (
  boardConnectionOptions: HidRelayBoardConnectionOptions,
  serialNumber: string,
): Promise<void> => {
  let relay: HID.HIDAsync | undefined = undefined;
  try {
    const serialNumberBuffer = Buffer.from(serialNumber, "ascii");
    if (serialNumberBuffer.length > 5) {
      throw new Error("Serial number must be less than 5 characters");
    }

    const fixedLengthSerialNumberBuffer = Buffer.alloc(5);
    fixedLengthSerialNumberBuffer.fill(0);
    serialNumberBuffer.copy(fixedLengthSerialNumberBuffer, 0, 0);

    const device =
      "serialNumber" in boardConnectionOptions
        ? await findHidRelayBoardBySerialNumber(
            boardConnectionOptions.serialNumber,
          )
        : boardConnectionOptions;
    if (!device) {
      throw new Error(`Unable to find board`);
    }
    relay = await openHidDevice(device);
    await relay.write([
      0x0,
      COMMAND_SET_SERIAL,
      ...fixedLengthSerialNumberBuffer,
    ]);
  } finally {
    relay?.close();
  }
};
