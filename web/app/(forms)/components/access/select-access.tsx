"use client";
import React, { startTransition, useOptimistic, useState } from "react";
import { AccessType, Form, Paps } from "@/lib/types/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import PromoAccess from "./promo";
import { AccessChildrenProps } from "@/lib/types/access";
import AssoAccess from "./asso";
import CotizAccess from "./cotiz";
import LinkAccess from "./link";
import RestrictedAccess from "./restricted";
import AdvancedAccess from "./advanced";
import QueryProvider from "../query-provider";
import { updateFormAction } from "../../actions/form";

interface AccessProps {
  label: string;
  description: string;
  children?: (props: AccessChildrenProps) => React.ReactNode;
}

const accessTypes: Record<AccessType, AccessProps> = {
  ALL: {
    label: "Tous",
    description: "Tous les utilisateurs peuvent accéder au formulaire.",
  },
  CS: {
    label: "CS",
    description: "Permet de donner l'accès aux étudiants de CS",
  },
  PROMO: {
    label: "Promotion",
    description: "Permet de donner l'accès aux étudiants d'une promotion",
    children: (props) => <PromoAccess {...props} />,
  },
  ASSO: {
    label: "Association",
    description: "Permet de donner l'accès aux membres d'une association",
    children: (props) => <AssoAccess {...props} />,
  },
  COTIZ: {
    label: "Cotiz",
    description:
      "Permet de donner l'accès aux étudiants ayant payé une cotisation",
    children: (props) => <CotizAccess {...props} />,
  },
  LINK: {
    label: "Lien",
    description:
      "Permet de donner l'accès aux personnes en envoyant un lien par email",
    children: (props) => <LinkAccess {...props} />,
  },
  RESTRICTED: {
    label: "Restreint",
    description: "Permet de donner l'accès à une liste de personnes",
    children: (props) => <RestrictedAccess {...props} />,
  },
  ADVANCED: {
    label: "Avancé",
    description: "Permet de combiner plusieurs accès",
    children: (props) => <AdvancedAccess {...props} />,
  },
};

export default function SelectAccess({
  form,
  allowedAccess,
}: {
  form: Form | Paps;
  allowedAccess?: AccessType[];
}) {
  const [access, setAccess] = useOptimistic<AccessType, AccessType>(
    form.access,
    (state, action) => action
  );
  const [accessMeta, setAccessMeta] = useState<string | undefined>(
    form.accessMeta || undefined
  );

  const childrenProps: AccessChildrenProps = {
    accessMeta,
    saveAccessMeta: async (accessMeta) => {
      await updateFormAction<Form | Paps>(form.id, form.type, {
        accessMeta: accessMeta || null,
      });
    },
  };

  return (
    <QueryProvider>
      {Object.entries(accessTypes)
        .filter(
          ([key, value]) =>
            !allowedAccess || allowedAccess.includes(key as AccessType)
        )
        .map(([key, value]) => (
          <Card
            key={key}
            className={cn({
              "border-foreground": access === key,
            })}
          >
            <CardHeader className="flex flex-row">
              <div className="flex-1">
                <CardTitle>{value.label}</CardTitle>
                <CardDescription>{value.description} </CardDescription>
              </div>

              {access === key ? (
                <span className="inline-flex items-center justify-center px-4 py-2">
                  Selectionné
                </span>
              ) : (
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    startTransition(() => {
                      setAccess(key as AccessType);
                      setAccessMeta(undefined);
                      updateFormAction<Form | Paps>(form.id, form.type, {
                        access: key as AccessType,
                        accessMeta: null,
                      });
                    });
                  }}
                >
                  Selectionner
                </Button>
              )}
            </CardHeader>
            {access === key && value.children && (
              <CardContent>{value.children(childrenProps)}</CardContent>
            )}
          </Card>
        ))}
    </QueryProvider>
  );
}
