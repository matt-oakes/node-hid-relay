import { Device, HIDAsync } from "node-hid";
import { HidDeviceConnectionOptions } from "./types.js";

/**
 * Opens an Async HID connection to the relay board
 */
export const openHidDevice = async (
  device: HidDeviceConnectionOptions,
): Promise<HIDAsync> => {
  return "path" in device
    ? await HIDAsync.open(device.path)
    : await HIDAsync.open(device.vendorId, device.productId);
};

/**
 * Returns true if the device is a DCTTech.com USB relay board
 */
export const isDCTTechRelay = (device: Device) => {
  return (
    device.vendorId === 0x16c0 &&
    device.productId === 0x05df &&
    device.product?.startsWith("USBRelay")
  );
};
