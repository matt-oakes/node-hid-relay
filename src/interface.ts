import HID from "node-hid";
import { isDCTTechRelay } from "./utils.js";
import { HidRelayBoard, ListHidRelayBoardsOptions } from "./types.js";

/**
 * List all HID USB relay boards available on the system along with the state they are currently in.
 */
export const listHidRelayBoards = async ({
  fetchState = true,
}: ListHidRelayBoardsOptions = {}): Promise<HidRelayBoard[]> => {
  // Get the devices from node-hid and filter out to only those which are known USB relay boards
  // TODO: Add support for other relay types
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
              relay = device.path
                ? await HID.HIDAsync.open(device.path)
                : await HID.HIDAsync.open(device.vendorId, device.productId);
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
