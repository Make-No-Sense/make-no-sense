interface GoogleMapsEmbedProps {
  address: string;
  apiKey?: string;
}

export function GoogleMapsEmbed({ address, apiKey }: GoogleMapsEmbedProps) {
  // If no API key, show placeholder
  if (!apiKey) {
    return (
      <div className="bg-navy-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <p className="text-warm-cream/30 text-sm">
          Google Maps API key required
        </p>
      </div>
    );
  }

  const encodedAddress = encodeURIComponent(address);
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;

  return (
    <div className="bg-navy-black rounded-lg overflow-hidden">
      <iframe
        src={src}
        width="100%"
        height={600}
        style={{ border: "none" }}
        allowFullScreen
        loading="lazy"
        title={`Make No Sense Location: ${address}`}
      />
    </div>
  );
}
