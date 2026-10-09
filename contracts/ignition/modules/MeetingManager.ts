import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MeetingManagerModule", (m) => {
  const meetingManager = m.contract("MeetingManager");

  return { meetingManager };
});
