import { listHidRelayBoards, setHidRelayState } from "../src/interface.js";

const boards = await listHidRelayBoards();

for (const board of boards) {
  console.log(`Board with serial number: ${board.serialNumber}`);
  console.log(`\tRelay count: ${board.relayCount}`);
  if (typeof board.relayCount === "number" && board.relayCount > 0) {
    for (let i = 0; i < board.relayCount; i++) {
      const currentState = board.relayStates?.[i] ?? false;
      console.log(`\tRelay ${i}: ${currentState ? "ON" : "OFF"}`);
      // Delay for a bit
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Toggle the relay
      await setHidRelayState(board, i, !currentState);
      console.log(`\t\tToggled relay`);
      // Delay for a bit
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Toggle the relay back
      await setHidRelayState(board, i, currentState);
      console.log(`\t\tToggled relay back`);
    }
  }
}
