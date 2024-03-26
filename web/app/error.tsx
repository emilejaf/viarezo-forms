"use client";

export default function Error() {
  return (
    <div className="flex h-screen flex-col items-center py-16">
      <h1 className="text-3xl font-bold">Erreur</h1>
      <p className="text-center text-lg">
        Une erreur est survenue, veuillez réessayer plus tard.
      </p>
    </div>
  );
}
