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
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { getUid } from "@/lib/helpers/getUid";

interface ContactFormData {
  firstname: string;
  lastname: string;
  email: string;
  jobtitle: string;
  company: string;
  location: string;
}

export function AddContactSheet({ children, onContactAdded }: PropsWithChildren<{ onContactAdded?: () => void }>) {
  const [user] = useCurrentUser();
  const [isCreating, setIsCreating] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // État du formulaire
  const [formData, setFormData] = useState<ContactFormData>({
    firstname: "",
    lastname: "",
    email: "",
    jobtitle: "",
    company: "",
    location: ""
  });

  // Validation du formulaire
  const isFormValid = () => {
    return formData.firstname.trim() !== "" &&
      formData.lastname.trim() !== "" &&
      formData.email.trim() !== "";
  };

  // Gestion des changements de champs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Création d'un ID personnalisé à partir du nom d'utilisateur et de l'UID
  const createCustomId = () => {
    if (!user || !user.displayName) return null;

    // Remplacer les espaces par des tirets et concaténer avec l'UID
    const formattedName = user.displayName.replace(/\s+/g, '-').toLowerCase();
    return `${formattedName}-${getUid()}-${Date.now()}`;
  };

  // Création du contact dans Firebase
  const createContact = async () => {
    if (!isFormValid()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un contact",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setIsCreating(true);

      // Créer un ID personnalisé
      const customId = createCustomId();

      if (!customId) {
        throw new Error("Impossible de créer un ID personnalisé");
      }

      // Données du contact
      const contactData = {
        ...formData,
        uid: getUid(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Ajouter le document avec l'ID personnalisé
      const profilesRef = collection(db, "profiles");
      await setDoc(doc(profilesRef, customId), contactData);

      // Réinitialiser le formulaire
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        jobtitle: "",
        company: "",
        location: ""
      });

      // Fermer la feuille
      closeRef.current?.click();

      // Notification de succès
      toast({
        title: "Contact créé",
        description: `${formData.firstname} ${formData.lastname} a été ajouté avec succès.`,
        duration: 3000,
      });

      // Appeler le callback si fourni
      if (onContactAdded) {
        onContactAdded();
      }
    } catch (error: any) {
      console.error("Erreur lors de la création du contact:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du contact",
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
          <SheetTitle>Create contact</SheetTitle>
          <SheetDescription>
            Add a new contact to your collection. Fields marked with * are required.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-grow flex flex-col gap-6 py-4 mt-2">
          <div className="flex flex-col space-y-1">
            <span className="text-sm">Firstname *</span>
            <Input
              id="firstname"
              type="text"
              placeholder="Christian"
              value={formData.firstname}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-sm">Lastname *</span>
            <Input
              id="lastname"
              type="text"
              placeholder="Doe"
              value={formData.lastname}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-sm">Email Address *</span>
            <Input
              id="email"
              type="email"
              placeholder="doe@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-sm">Job title</span>
            <Input
              id="jobtitle"
              type="text"
              placeholder="Software Developer"
              value={formData.jobtitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-sm">Company</span>
            <Input
              id="company"
              type="text"
              placeholder="Microsoft"
              value={formData.company}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-sm">Location</span>
            <Input
              id="location"
              type="text"
              placeholder="UK, London"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <SheetFooter>
          <Button
            onClick={createContact}
            disabled={isCreating || !isFormValid()}
          >
            {isCreating ? "Creating..." : "Create contact"}
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