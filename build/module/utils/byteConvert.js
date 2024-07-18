export const bytesToKB = (b) => b * 0.001;
export const KBToMB = (kb) => kb * 0.001;
export const MBToGB = (mb) => mb * 0.001;
export const bytesToMB = (b) => KBToMB(bytesToKB(b));
export const bytesToGB = (b) => MBToGB(bytesToMB(b));
