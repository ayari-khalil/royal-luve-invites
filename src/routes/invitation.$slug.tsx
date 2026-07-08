import { createFileRoute, notFound } from "@tanstack/react-router";
import { invitations, type Invitation } from "@/data/invitations";
import { RoyalOrTemplate } from "@/components/templates/RoyalOrTemplate";
import { NoirEmeraudeTemplate } from "@/components/templates/NoirEmeraudeTemplate";
import { VeloursRougeTemplate } from "@/components/templates/VeloursRougeTemplate";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Route = createFileRoute("/invitation/$slug")({
  loader: async ({ params }) => {
    try {
      const res = await fetch(`${API_URL}/api/invitations/${params.slug}`);
      if (res.ok) {
        return (await res.json()) as Invitation;
      }
    } catch (e) {
      console.warn("Backend fetch failed, falling back to static data:", e);
    }

    const localInv = invitations.find((i) => i.slug === params.slug);
    if (localInv) {
      return localInv;
    }

    throw notFound();
  },

  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          {
            title: `${loaderData.brideName} & ${loaderData.groomName} — Invitation`,
          },
          {
            name: "description",
            content: `Faire-part de mariage de ${loaderData.brideName} & ${loaderData.groomName}.`,
          },
          {
            property: "og:title",
            content: `${loaderData.brideName} & ${loaderData.groomName}`,
          },
          {
            property: "og:image",
            content: loaderData.photoUrl || "",
          },
        ]
      : [{ title: "Invitation" }],
  }),

  component: InvitationContent,
});

function InvitationContent() {
  const inv = Route.useLoaderData();

  switch (inv.template) {
    case "noir-emeraude":
      return <NoirEmeraudeTemplate inv={inv} />;

    case "velours-rouge":
      return <VeloursRougeTemplate inv={inv} />;

    case "royal-or":
    case "jardin-rose":
    default:
      return <RoyalOrTemplate inv={inv} />;
  }
}