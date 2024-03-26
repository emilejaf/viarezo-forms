import { FormType } from "@/lib/types/form";

const defaultNavItems = {
  general: {
    title: "Général",
    href: "/",
    mobileHref: "/general",
  },
  access: {
    title: "Accès",
    href: "/access",
  },
  moderators: {
    title: "Modérateurs",
    href: "/moderators",
  },
  fields: {
    title: "Questions",
    href: "/fields",
  },
  answers: {
    title: "Réponses",
    href: "/answers",
  },
};

export const navItems: Record<
  FormType,
  Record<string, { title: string; href: string; mobileHref?: string }>
> = {
  [FormType.FORM]: defaultNavItems,
  [FormType.PAPS]: {
    general: defaultNavItems.general,
    access: defaultNavItems.access,
    moderators: defaultNavItems.moderators,
    fields: defaultNavItems.fields,
    choices: { title: "Choix", href: "/choices" },
    answers: defaultNavItems.answers,
  },
  [FormType.VOTE]: {
    general: defaultNavItems.general,
    voters: { title: "Votants", href: "/voters" },
    fields: defaultNavItems.fields,
  },
};
