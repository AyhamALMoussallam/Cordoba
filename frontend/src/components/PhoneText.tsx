export function PhoneText({ value, className = "" }: { value: string; className?: string }) {
  if (!value) return null;

  return (
    <bdi dir="ltr" className={`inline-block ${className}`.trim()}>
      {value}
    </bdi>
  );
}
