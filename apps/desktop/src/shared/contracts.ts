export type Link = {
  id: string;
  slug: string;
  destinationUrl: string;
  createdAt: string;
  updatedAt: string;
  visits: number;
};

export type LinkInput = Pick<Link, "slug" | "destinationUrl">;
export type Health = { status: "ok"; version: string };
export type SystemStatus = {
  service: "running" | "stopped" | "unknown";
  hostname: "managed" | "missing" | "conflict";
  certificates: "valid" | "missing" | "expiring";
  ports: "available" | "goli" | "conflict";
  serviceVersion: string | null;
  appVersion: string;
  logs: string[];
};

export type MaintenanceAction = "restart" | "repair" | "uninstall-keep" | "uninstall-delete";
export type UpdateState =
  | { status: "disabled"; message: string }
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available"; version: string; notesUrl: string }
  | { status: "downloading"; version: string; percent: number }
  | { status: "verified"; version: string; packagePath: string }
  | { status: "handoff"; version: string }
  | { status: "error"; message: string };

export type GoliBridge = {
  links: {
    list(): Promise<Link[]>;
    create(input: LinkInput): Promise<Link>;
    update(id: string, input: LinkInput): Promise<Link>;
    remove(id: string): Promise<void>;
    openDestination(destinationUrl: string): Promise<void>;
    export(): Promise<boolean>;
    import(): Promise<void>;
  };
  system: { status(): Promise<SystemStatus>; run(action: MaintenanceAction): Promise<string> };
  updates: { state(): Promise<UpdateState>; check(): Promise<UpdateState>; download(): Promise<UpdateState>; onState(listener: (state: UpdateState) => void): () => void };
};
