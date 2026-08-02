import { invitations as seedInvitations, type Invitation } from "@/data/invitations";
import publicInvitations from "../../public/invitations.json";

const STORAGE_KEY = "royal_invitations";

export async function getInvitations(): Promise<Invitation[]> {
  const baseInvitations = Array.isArray(publicInvitations) && publicInvitations.length > 0
    ? (publicInvitations as Invitation[])
    : seedInvitations;

  // Server-side safety: return static base config immediately during SSR
  if (typeof window === "undefined") {
    return baseInvitations;
  }

  // Client-side: Dynamic fetch to stay in sync with server-side public/invitations.json edits
  try {
    const res = await fetch("/invitations.json");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        if (typeof localStorage !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch (e) {}
        }
        return data;
      }
    }
  } catch (e) {
    console.debug("No static invitations.json found or fetch failed, using local storage:", e);
  }

  // Client-side fallback: load from localStorage
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as Invitation[];
      } catch (e) {
        console.error("Failed to parse stored invitations:", e);
      }
    }
  }

  // Client-side deep fallback: seed localStorage and return base
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(baseInvitations));
    } catch (e) {}
  }
  return baseInvitations;
}

export async function getInvitationBySlug(slug: string): Promise<Invitation | undefined> {
  const list = await getInvitations();
  return list.find((i) => i.slug === slug);
}

export async function saveInvitation(inv: Invitation): Promise<Invitation> {
  const list = await getInvitations();
  const index = list.findIndex((i) => i.id === inv.id);
  let updatedList: Invitation[];
  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = inv;
  } else {
    updatedList = [inv, ...list];
  }
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {}
  }
  return inv;
}

export async function deleteInvitation(id: string): Promise<void> {
  const list = await getInvitations();
  const updatedList = list.filter((i) => i.id !== id);
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {}
  }
}
