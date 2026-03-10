export default function PaidFeatureGate({
  children,
}: {
  featureName: string;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
