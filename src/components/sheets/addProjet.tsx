/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { PropsWithChildren, useState, useRef } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

export function AddProjetSheet({ children, onListAdded }: PropsWithChildren<{ onListAdded?: () => void }>) {
    const [user] = useCurrentUser();
    const [ProjetName, setProjetName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);

    // Fonction pour créer la liste dans Firebase
    const createList = async () => {
        if (!ProjetName.trim()) {
            toast({
                title: "Erreur",
                description: "Le nom de la liste est requis",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        if (!user) {
            toast({
                title: "Erreur",
                description: "Vous devez être connecté pour créer une liste",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        try {
            setIsCreating(true);

            // Créer un document dans la collection "lists"
            const listData = {
                name: ProjetName.trim(),
                size: 0,
                owner: user.displayName || "Utilisateur inconnu",
                uid: user.uid, // Stocker l'UID de l'utilisateur pour les requêtes futures
                lastUpdated: serverTimestamp(),
                createdAt: serverTimestamp(),
            };

            // Ajout du document à Firestore
            await addDoc(collection(db, "lists"), listData);

            // Réinitialiser le formulaire
            setProjetName("");

            // Fermer la feuille
            closeRef.current?.click();

            // Notification de succès
            toast({
                title: "Liste créée",
                description: `La liste "${ProjetName}" a été créée avec succès.`,
                duration: 3000,
            });

            // Appeler le callback si fourni
            if (onListAdded) {
                onListAdded();
            }
        } catch (error) {
            console.error("Erreur lors de la création de la liste:", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la création de la liste",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Create Project</SheetTitle>
                    <SheetDescription>
                        Create your a new project here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-grow flex flex-col gap-6 py-4 mt-2">
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm">Project name *</span>
                        <Input
                            id="ProjetName"
                            type="text"
                            placeholder="Project no1"
                            value={ProjetName}
                            onChange={(e) => setProjetName(e.target.value)}
                        />
                    </div>
                </div>

                <SheetFooter>
                    <Button
                        onClick={createList}
                        disabled={isCreating || !ProjetName.trim()}
                    >
                        {isCreating ? "Creating..." : "Create list"}
                    </Button>
                    <SheetClose ref={closeRef}>
                        <Button
                            variant="ghost"
                            className="border border-red-500 text-red-500 hover:text-red-500"
                        >
                            Cancel
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}