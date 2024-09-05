import { ScanQrCode } from "lucide-react";
import { useRouter, usePathname } from "next/navigation"; // Assurez-vous que ce composant existe
import { Button } from "react-bootstrap"; // Assurez-vous d'importer le composant Button

export default function PresenceNavButton({ slug, courId }) {
  const router = useRouter();
  const pathname = usePathname();

  const presencesPath = `/presences/${slug}`;
  const listePresencesPath = `/presences/liste/${slug}`;

  const isPresencesPage = pathname === presencesPath;
  const isListePresencesPage = pathname === listePresencesPath;

  if (isPresencesPage || isListePresencesPage) {
    const targetPath = isPresencesPage ? listePresencesPath : presencesPath;
    const buttonText = isPresencesPage ? "Par liste" : "Par scène";

    return (
      <div className="p-4 flex gap-2">
        <button
          className="btn btn-outline btn-primary"
          onClick={() => router.push(targetPath)}
        >
          {isPresencesPage ? (
            buttonText
          ) : (
            <>
              <ScanQrCode />
              {buttonText}
            </>
          )}
        </button>
        <Button
          variant="primary"
          onClick={() => router.push(`/cour-info/${courId}`)}
        >
          Cours
        </Button>
      </div>
    );
  }

  return null;
}
