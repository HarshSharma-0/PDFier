import { useState, useEffect } from 'react';

export function useMidHook() {
  const [ShowMid, setValue] = useState(false);

  useEffect(() => {
   console.log('valueChanged');
  }, [ShowMid]);

  const setShowMid = (newValue) => {
    setValue(newValue);
  };

  return {
    ShowMid,
    setShowMid,
  };
}
