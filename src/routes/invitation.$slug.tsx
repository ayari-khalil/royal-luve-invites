import { createFileRoute, notFound } from "@tanstack/react-router";
import { type Invitation } from "@/data/invitations";
import { getInvitationBySlug } from "@/lib/storage";
import { RoyalOrTemplate } from "@/components/templates/RoyalOrTemplate";
import { NoirEmeraudeTemplate } from "@/components/templates/NoirEmeraudeTemplate";
import { VeloursRougeTemplate } from "@/components/templates/VeloursRougeTemplate";

export const Route = createFileRoute("/invitation/$slug")({
  loader: async ({ params }) => {
    const inv = await getInvitationBySlug(params.slug);
    if (inv) {
      return inv;
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
    case "rideau-imperial":
      return <VeloursRougeTemplate inv={inv} />;

    case "royal-or":
    case "jardin-rose":
    default:
      return <RoyalOrTemplate inv={inv} />;
  }
}