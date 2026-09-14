import { getServiceAreas } from "@/lib/content";
import { SERVICES } from "@/lib/services";

const BASE_URL = "https://gotaxiutrecht.nl";

export default async function sitemap() {
  const areas = await getServiceAreas();

  const staticRoutes = ["", "/diensten", "/gebied", "/contact"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceRoutes = SERVICES.map((s) => ({
    url: `${BASE_URL}/diensten/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const areaRoutes = areas.map((a) => ({
    url: `${BASE_URL}/gebied/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...areaRoutes];
}
