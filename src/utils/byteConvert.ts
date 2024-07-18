export const bytesToKB = (b: number) => b * 0.001;
export const KBToMB = (kb: number) =>  kb * 0.001;
export const MBToGB = (mb: number) =>  mb * 0.001;
export const bytesToMB = (b: number) => KBToMB(bytesToKB(b));
export const bytesToGB = (b: number) => MBToGB(bytesToMB(b));
