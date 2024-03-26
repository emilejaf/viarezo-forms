"use client";

import { Button } from "@/components/ui/button";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import { checkAccess } from "./action";
import { APIError } from "@/lib/exceptions";
import { toast } from "sonner";

export default function Scanner({
  id,
  ...props
}: React.ComponentProps<"video"> & { id: string }) {
  const videoRef = useRef(null);

  const [scanStarted, setScanStarted] = useState(false);

  const [scanner, setScanner] = useState<QrScanner | null>(null);

  const [scanResult, setScanResult] = useState<{
    login: string;
    result: boolean;
  } | null>(null);

  useEffect(() => {
    if (videoRef.current != null && scanStarted) {
      const scanner = new QrScanner(
        videoRef.current,
        async (result) => {
          const login = result.data;
          scanner.pause();

          const checkResult = await checkAccess({ id, login });

          if (checkResult.result == null) {
            toast.error("Erreur lors de la vérification de l'accès");
            return;
          }

          setScanResult({
            login,
            result: checkResult.result,
          });
        },
        {
          returnDetailedScanResult: true,
        }
      );
      scanner.start();

      setScanner(scanner);
    }
  }, [videoRef, scanStarted, id]);

  if (!scanStarted) {
    return <Button onClick={() => setScanStarted(true)}>Lancer le scan</Button>;
  }

  return (
    <>
      {scanResult && (
        <div className="text-center space-y-4">
          <p>
            {scanResult.login} -{" "}
            {scanResult.result ? "Accès autorisé" : "Accès refusé"}
          </p>
          <Button
            onClick={() => {
              setScanResult(null);
              scanner?.start();
            }}
          >
            Continuer
          </Button>
        </div>
      )}
      <video ref={videoRef} {...props} />
    </>
  );
}
