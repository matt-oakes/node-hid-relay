import { Device } from "node-hid";

/**
 * Options to be passed in when listing HID relay boards
 */
export interface ListHidRelayBoardsOptions {
  /**
   * If true, we will connect to each of the HID relay boards and get the full state. This is needed
   * to get the serial number of some devices.
   * @default true
   */
  fetchState?: boolean;
}

/**
 * Options needed to connect to a HID relay board
 */
export type HidRelayBoardConnectionOptions = Pick<
  Device,
  "path" | "vendorId" | "productId"
>;

/**
 * The description of a HID relay board, including all of the known state
 */
export interface HidRelayBoard extends Device {
  /**
   * The serial number of the relay board. Will be undefined if unknown
   */
  serialNumber?: string;

  /**
   * The number of relays on the board. Will be undefined if unknown
   */
  relayCount?: number;

  /**
   * Relay states. Will be undefined if the board does not support reporting relay states
   */
  relayStates?: boolean[];
}
