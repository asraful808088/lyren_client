interface PriceTagProps {
  price: number;
  discountPrice?: number;
  quantity?: number;
  className?: string;
  originalClassName?: string;
}

export function PriceTag({
  price,
  discountPrice,
  quantity = 1,
  className = '',
  originalClassName = 'text-gray-500 line-through text-[11px] font-light',
}: PriceTagProps) {
  const hasDiscount = discountPrice !== undefined && discountPrice < price;
  const effective = (hasDiscount ? discountPrice! : price) * quantity;
  const original = price * quantity;

  if (!hasDiscount) {
    return <span className={className}>${effective.toFixed(2)}</span>;
  }

  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span>${effective.toFixed(2)}</span>
      <span className={originalClassName}>${original.toFixed(2)}</span>
    </span>
  );
}