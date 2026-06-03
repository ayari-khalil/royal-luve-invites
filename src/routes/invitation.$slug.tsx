import { createFileRoute, notFound } from "@tanstack/react-router";
import type { Invitation } from "@/data/invitations";
import { RoyalOrTemplate } from "@/components/templates/RoyalOrTemplate";
import { NoirEmeraudeTemplate } from "@/components/templates/NoirEmeraudeTemplate";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Route = createFileRoute("/invitation/$slug")({
  loader: async ({ params }) => {
    const res = await fetch(`${API_URL}/api/invitations/${params.slug}`);

    if (!res.ok) {
      throw notFound();
    }

    const inv = (await res.json()) as Invitation;
    return inv;
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

    case "royal-or":
    case "jardin-rose":
    default:
      return <RoyalOrTemplate inv={inv} />;
  }
}