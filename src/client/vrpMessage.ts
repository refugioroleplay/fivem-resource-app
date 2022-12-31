import { defineClientMessage } from "@/FivemResourcePlugin";

export default defineClientMessage(() => {
  let timer = 0;
  return {
    requestVrpId() {
      return {
        userId: 1,
      };
    },
    requestServerTimestamp() {
      return {
        timestamp: timer++,
      };
    },
  };
});
