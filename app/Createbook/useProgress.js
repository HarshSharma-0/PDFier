import { useState } from "react";

export function useProgress () {

 const [Progress, setProgress] = useState(null);

  return {
    Progress,
    resetProgress: (int_pro) => setProgress(int_pro),
  };
}
