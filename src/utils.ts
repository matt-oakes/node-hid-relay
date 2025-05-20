import { Device } from "node-hid";

export const isDCTTechRelay = (device: Device) => {
  return (
    device.vendorId === 0x16c0 &&
    device.productId === 0x05df &&
    device.product?.startsWith("USBRelay")
  );
};
