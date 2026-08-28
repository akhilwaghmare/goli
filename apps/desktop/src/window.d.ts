import type { GoliBridge } from "./shared/contracts";
declare global { interface Window { goliBridge: GoliBridge; } }
export {};
