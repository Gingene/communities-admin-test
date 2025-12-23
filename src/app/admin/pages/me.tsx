import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetIdentity } from "ra-core";

export function Me() {
  const { data: identity } = useGetIdentity();
  return (
    <Card>
      <CardHeader>
        <CardTitle>歡迎回來 {identity?.username} </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="overflow-auto rounded-md bg-muted p-4 text-sm">
          {JSON.stringify(identity, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
