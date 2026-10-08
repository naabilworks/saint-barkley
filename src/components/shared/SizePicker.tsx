import { useState } from "react";
import type { Product } from "../../data/products";

type Props = {
  product: Product;
  value: number | null;
  onChange: (size: number) => void;
  compact?: boolean;
};

export default function SizePicker({ product, value, onChange, compact }: Props) {
  return (
    <fieldset className={`sizes${compact ? " sizes--compact" : ""}`}>
      <legend className="sizes__legend">Size (EU)</legend>
      <div className="sizes__grid">
        {product.sizes.map((s) => {
          const out = product.soldOut?.includes(s);
          return (
            <label key={s} className="size" data-out={out || undefined}>
              <input
                type="radio"
                name={`size-${product.id}${compact ? "-c" : ""}`}
                value={s}
                checked={value === s}
                disabled={out}
                onChange={() => onChange(s)}
              />
              <span>{s}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ProductImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="ph">Photo coming soon</span>;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}