# `node-hid-relay`

A Node.JS library which can control a USB relay device using the HID interface.

## Supported Devices

- DCTTech.com USB Relay Modules (2,4,6, or 8 relays)
  - Vendor ID: `0x16c0`
  - Product ID: `0x05df`

## Usage

### List all relay boards

```ts
import { listHidRelayBoards } from "node-hid-relay";

// Get the relay boards
const relayBoards = await listHidRelayBoards();

// Log the serial number of each relay board
for (const board of relayBoards) {
  console.log(`Relay board with serial number: ${board.serialNumber}`);
}
```

### Set the state of a relay

```ts
import { listHidRelayBoards, setHidRelayState } from "node-hid-relay";

// Get the relay boards
const relayBoards = await listHidRelayBoards();

// Turn the first relay on the first board on
await setHidRelayState(relayBoards[0], 0, true);

// Turn the first relay on the first board off
await setHidRelayState(relayBoards[0], 0, false);
```

## See Also

- [`usbrelay`](https://github.com/darrylb123/usbrelay) - This project is inspired by that project
- [`node-hid`](https://github.com/node-hid/node-hid) - The Node.JS HID library this project uses

## License

MIT
