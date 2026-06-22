type DocsMavenCentralBadgeProps = {
  href?: string;
  artifactId?: string;
  inline?: boolean;
};

const DEFAULT_MAVEN_CENTRAL_HREF = "https://search.maven.org/artifact/com.apihug/it-bom";

function getArtifactIdFromHref(href: string) {
  return href.match(/artifact\/com\.apihug\/([^/?#]+)/)?.[1] ?? "it-bom";
}

function getMavenCentralBadgeSrc(artifactId: string) {
  return `https://img.shields.io/maven-central/v/com.apihug/${artifactId}.svg?label=Maven%20Central`;
}

export function DocsMavenCentralBadge({
  href = DEFAULT_MAVEN_CENTRAL_HREF,
  artifactId = getArtifactIdFromHref(href),
  inline = false,
}: DocsMavenCentralBadgeProps) {
  const badge = (
    <a href={href} target="_blank" rel="noreferrer">
      <img src={getMavenCentralBadgeSrc(artifactId)} alt={`Maven Central version badge for com.apihug/${artifactId}`} />
    </a>
  );

  if (inline) {
    return badge;
  }

  return <div className="not-prose my-6">{badge}</div>;
}

export function DocsJetBrainsMarketplaceCard() {
  return (
    <div className="not-prose my-6">
      <iframe
        src="https://plugins.jetbrains.com/embeddable/card/23534"
        title="JetBrains Marketplace card for ApiHug - API design Copilot"
        frameBorder="0"
        height="319px"
        width="384px"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
