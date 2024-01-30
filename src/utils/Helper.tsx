// React
import { useRef, useCallback } from 'react';

import { ChangeYear, ChangeYearData } from '../utils/Types';

// Function from https://www.typescriptlang.org/play?ssl=26&ssc=3&pln=26&pc=62#code/JYWwDg9gTgLgBAJQKYEMDGMA0cDecCuAzksgGbZFIDCKANrQEboDWcAvnKVBCHAORRUGPgG4AUKEixccJAA8wSDABUAnovaduvPjEIATPmLEB6AFRmxcM3ACCaNEjB64KOAHNgANyQA7OGh0jCzYKL76cGDcXsD6SISucL5IAO4BQUxorCnAMAAWiYQwKAy0SHCCpEiCvo6YVjYpecBoBTn0cLnEtKSutCkoqgmBHfnltCgw8fA+UITAEP4QvWOR0bFIESPBWQB0DXAAqsSk+LSc0HBxdMC+7nA5+XD5wFARYCiwqgE8kMm+LnykwIxDgRTo5TQtAghHwgkI+2sJjEp1qMAW-koAGViqVqBkWAAeWxQdwJeRTcIJfC+Zi+CApXwAbQAuthkDA4b4AHwACm2mWYAC44LzduLPmSRSSyQBKOAAXm5iCQnKgvnlOCsP18RXS9EFZEVIJISFI-IJWVl4jg+p2zDIuzQcJq8AVdsF4m1aEWevBeJoBpYxsogftvLFEtJhGl0flStw2ttgjV-gFLEdzqgrsju0lhGt2rY2FZhe1Ka5YNxZTDnrEbGMqIwGLgADEIBBeZrtU30YsCLrq-ig1leSBCO4RUUoLd3NgfTSYCLfPgQAxqrKpzAZ3dE7bbSYTFcIFX8KRenlqkgkxVVZWAAYrtfVToJAAkOAXAI4YQi4-uwAxnAH7-mw942uwxi2j6g5ViUNaWqw7rYkOtYsLyNL+ghI7MGWB5HighDELALakJcqx5B2rAVuqzzqEgQravIigqPRhJjhOW47nOPyLsuq7rlA8bKtOs58lhw72nhcCHnA94SWhWT3uk-j0mk66RIRxARDAJ5MFsvyLH4gJ5MClBwWUATQrC8JQbeqZwIS+jeNyLwJIBzyXhcJ4+uARkAoSJjOV43L1mIQA
export function useStableCallback<Args extends unknown[], Return>(callback: (...args: Args) => Return) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
  
    const stableCallback = useCallback((...args: Args) => {
      return callbackRef.current(...args);
    }, []);
  
    return stableCallback;
}

export function filterPollSummaryByChangeYear(changeYearData: ChangeYearData[], changeYear: ChangeYear) {
  // console.log(changeYearData);
  return changeYearData.find((d: any) => d.changeYear === changeYear.changeYear)?.pollSummary;
}
