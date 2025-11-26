import { formatPrice } from "@/lib/utils";

export default function Price({
  amount,
}: {
  amount: number | null | undefined;
}) {
  if (!amount) return null;

  const formattedAmount = formatPrice(amount);

  return <p className="text-lg">{formattedAmount}</p>;
}
