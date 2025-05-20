import { listHidRelayBoards } from "../src/interface.js";

const boards = await listHidRelayBoards();

for (const board of boards) {
  console.log(`Board: ${JSON.stringify(board, null, 2)}`);
}
