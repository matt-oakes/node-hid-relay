import {
  listHidRelayBoards,
  setHidRelaySerialNumber,
} from "../src/interface.js";

const boards = await listHidRelayBoards();

for (const [index, board] of boards.entries()) {
  console.log(
    `Board ${index + 1} with existing serial number: ${board.serialNumber}`,
  );
  const newSerialNumber = `BRD${(index + 1).toString().padStart(2, "0")}`;
  console.log(`\tNew serial number: ${newSerialNumber}`);
  await setHidRelaySerialNumber(board, newSerialNumber);
  console.log(`\tSet!`);
}
