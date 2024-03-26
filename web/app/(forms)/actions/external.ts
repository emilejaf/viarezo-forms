"use server";

import { queryAPI } from "@/lib/api";
import { CotizAsso, LinkCSAsso, LinkCSUser } from "@/lib/types/access";

export async function getAsso(id: string) {
  const asso = await queryAPI<LinkCSAsso>("/viarezo/asso?id=" + id, {
    next: { revalidate: 3600 },
  });

  if (asso instanceof Error) {
    throw asso;
  }

  return asso;
}

export async function searchAssos(query: string) {
  const result = await queryAPI<LinkCSAsso[]>(
    `/viarezo/search-assos?search=${query}`
  );

  if (result instanceof Error) {
    throw result;
  }

  return result;
}

export async function getUsers(logins: string[]) {
  const result = await queryAPI<LinkCSUser[]>(
    "/viarezo/users?logins=" + logins.join(",")
  );

  if (result instanceof Error) {
    throw result;
  }

  return result;
}

export async function searchUsers(query: string) {
  const result = await queryAPI<LinkCSUser[]>(
    `/viarezo/search-users?search=${query}`
  );

  if (result instanceof Error) {
    throw result;
  }

  return result;
}

export async function getCotizAssos() {
  const result = await queryAPI<CotizAsso[]>("/viarezo/cotiz-assos", {
    next: { revalidate: 3600 },
  });

  if (result instanceof Error) {
    throw result;
  }

  return result;
}
