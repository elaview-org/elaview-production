import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";

function PaymentSummary() {
  // In a real-world scenario, these would come from props or context
  const breakdown = [
    { label: "Base Price", value: 500 },
    { label: "Tax", value: 50 },
    { label: "Platform Fee", value: 20 },
  ];

  const total = breakdown.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle className="text-lg">Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="divide-y px-2 pb-2">
        <div className="flex flex-col gap-3">
          {breakdown.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span>
                $
                {item.value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <span className="text-base font-semibold">Total Paid</span>
        <span className="text-base font-bold">
          ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      </CardFooter>
    </Card>
  );
}

export default PaymentSummary;
