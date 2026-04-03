export default function Head() {
  return (
    <>
      {/* Modern browsers: SVG favicon with gradient design */}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      {/* Legacy browsers: ICO fallback */}
      <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="shortcut icon" href="/favicon.ico" />
      {/* Apple devices */}
      <link rel="apple-touch-icon" href="/favicon.svg" />
      {/* Android devices */}
      <link rel="manifest" href="/site.webmanifest" />
    </>
  );
}
