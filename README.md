# `node-hid-relay`

A library which can control a USB relay device using the HID interface. It uses the [`node-hid`](https://github.com/node-hid/node-hid) library to communicate with the relay board so will work in Node.JS or Electron.

## Supported Devices

- DCTTech.com USB Relay Modules (2,4,6, or 8 relays)
  - Vendor ID: `0x16c0`
  - Product ID: `0x05df`

## Installation

Install the library using your package manager of choice:

```bash
npm install node-hid-relay
pnpm add node-hid-relay
yarn add node-hid-relay
```

Check the [`node-hid`](https://github.com/node-hid/node-hid) documentation for any additional setup you may need to do to use the library on your system. For example on Linux you may need to set udev rules to allow access to devices without root permissions.

You may also need to perform additional setup to make sure this library works in Electron.

## Usage

### List all relay boards

Return a list of all the currently connected HID USB Relay boards. By default, the state of each relay on the board is also fetched, but this can be turned off by setting the `fetchState` option to `false`.

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

Set the state of a relay on a HID USB Relay board. Note that this function will not check that the relay index is valid as some relays do not report the number of relays available.

```ts
import { listHidRelayBoards, setHidRelayState } from "node-hid-relay";

// Get the relay boards
const relayBoards = await listHidRelayBoards();

// Turn the first relay on the first board on
await setHidRelayState(relayBoards[0], 0, true);

// Turn the first relay on the first board off
await setHidRelayState(relayBoards[0], 0, false);
```

### Set the serial number of a relay board

Set the serial number of a HID USB Relay board. Note that the serial number must contain only ascii characters and must be 5 characters or less.

```ts
import { listHidRelayBoards, setHidRelaySerialNumber } from "node-hid-relay";

// Get the relay boards
const relayBoards = await listHidRelayBoards();

// Set the serial number of the first relay board
await setHidRelaySerialNumber(relayBoards[0], "BRD01");
```

## Development

- Run `pnpm install` to install the dependencies.
- Run `pnpm build` to build the library.
- Run `pnpm typecheck` to run the type checker.
- Run `pnpm lint` to run the linter.

## See Also

- [`usbrelay`](https://github.com/darrylb123/usbrelay) - This project is inspired by that project
- [`node-hid`](https://github.com/node-hid/node-hid) - The Node.JS HID library this project uses

## License

MIT
