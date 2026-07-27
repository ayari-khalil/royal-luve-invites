import { invitations as seedInvitations, type Invitation } from "@/data/invitations";

const STORAGE_KEY = "royal_invitations";

export async function getInvitations(): Promise<Invitation[]> {
  // 1. Try to fetch static JSON from public folder
  try {
    const res = await fetch("/invitations.json");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Synchronize with localStorage for admin editing fallback
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    console.debug("No static invitations.json found, loading from storage/seed:", e);
  }

  // 2. Try to get from localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Invitation[];
    } catch (e) {
      console.error("Failed to parse stored invitations:", e);
    }
  }

  // 3. Fallback to seed data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedInvitations));
  return seedInvitations;
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  return inv;
}

export async function deleteInvitation(id: string): Promise<void> {
  const list = await getInvitations();
  const updatedList = list.filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
}
