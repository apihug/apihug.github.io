import { permanentRedirect } from "next/navigation";

export default function DocsIndexPage() {
  permanentRedirect("/docs/start/what-is-apihug");
}
