export function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-sm font-bold tracking-wide text-cordoba-mid">{kicker}</p>
      <div className="gold-line mt-2" />
      <h2 className="mt-4 text-3xl font-extrabold text-ink md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
    </div>
  );
}
