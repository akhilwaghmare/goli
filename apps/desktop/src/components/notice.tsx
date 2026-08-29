import { Alert, AlertDescription } from "@go-links/ui/components/alert";

export function Notice({ message }: { message: string }) {
  return <Alert className="mb-5 border-amber-300 bg-amber-50 text-amber-950"><AlertDescription>{message}</AlertDescription></Alert>;
}
