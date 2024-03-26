import { AccessChildrenProps } from "@/lib/types/access";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AccessTable from "./table";
import { Label } from "@/components/ui/label";

export default function LinkAccess({
  accessMeta,
  saveAccessMeta,
}: AccessChildrenProps) {
  const [emails, setEmails] = useState<string[]>(
    accessMeta ? JSON.parse(accessMeta) : []
  );

  useEffect(() => {
    setEmails(accessMeta ? JSON.parse(accessMeta) : []);
  }, [accessMeta]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <LinkInput
          addEmail={(email) => {
            if (emails.includes(email)) {
              return;
            }

            const newEmails = [...emails, email];
            setEmails(newEmails);
            saveAccessMeta(JSON.stringify(newEmails));
          }}
        />
      </div>
      {emails.length > 0 && (
        <div className="space-y-2">
          <AccessTable
            header="Emails autorisés"
            labelFn={(email) => email}
            items={emails}
            removeItem={(email) => {
              const newEmails = emails.filter((e) => e != email);
              setEmails(newEmails);
              saveAccessMeta(JSON.stringify(newEmails));
            }}
          />
        </div>
      )}
    </div>
  );
}

function LinkInput({ addEmail }: { addEmail: (email: string) => void }) {
  const [email, setEmail] = useState<string>("");

  return (
    <div className="space-y-2">
      <Label htmlFor="email">Addresse email</Label>
      <div className="flex space-x-2">
        <Input
          className="w-[300px]"
          type="email"
          id="email"
          name="email"
          value={email}
          autoFocus={true}
          autoComplete="off"
          placeholder="L'addresse email de l'utilisateur"
          onInput={(e) => {
            const value = e.currentTarget.value;
            setEmail(value);
          }}
        />
        <Button
          onClick={() => {
            addEmail(email);
            setEmail("");
          }}
        >
          Ajouter
        </Button>
      </div>
      <p className="text-[0.8rem] text-muted-foreground">
        Un email lui sera directement envoyé
      </p>
    </div>
  );
}
