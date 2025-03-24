/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NotFoundData } from "@/components/request/NotFoundData";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Export } from "iconsax-react";

import { useEffect, useMemo, useState } from "react";
import { TableLoadingSkeleton } from "@/components/dashboard/TableSkeleton";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";
import { AddContactSheet } from "@/components/sheets/addContact";
import { ContactDetailSheet } from "@/components/sheets/contactDetails";
import { db } from "@/firebase/config";
import { getUid } from "@/lib/helpers/getUid";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [isRealTimeUpdating, setIsRealTimeUpdating] = useState(true);
  const pageSize = 10;

  // Écouteur en temps réel avec onSnapshot
  useEffect(() => {
    const uid = getUid();

    if (!uid) return;

    setIsRealTimeUpdating(true);

    const profilesRef = collection(db, "profiles");
    const q = query(
      profilesRef,
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    // Créer un écouteur qui se déclenchera à chaque modification
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updatedProfiles: any[] = [];

        snapshot.forEach((doc) => {
          updatedProfiles.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        console.log("Profiles mis à jour depuis Firebase:", updatedProfiles);
        setContacts(updatedProfiles);
        setIsRealTimeUpdating(false);

        // Notification pour informer l'utilisateur (uniquement après le chargement initial)
        if (contacts.length > 0 && updatedProfiles.length !== contacts.length) {
          toast({
            title: "Contacts mis à jour",
            description: `${updatedProfiles.length} contacts sont maintenant disponibles.`,
            duration: 3000,
          });
        }
      },
      (error) => {
        console.error("Erreur lors de l'écoute des mises à jour:", error);
        setIsRealTimeUpdating(false);

        toast({
          title: "Erreur",
          description: "Impossible de recevoir les mises à jour en temps réel.",
          variant: "destructive",
          duration: 5000,
        });
      }
    );

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, [contacts.length]); // Dépendance sur contacts.length pour éviter les notifications lors du chargement initial

  // Fonction de callback pour le rafraîchissement après ajout d'un contact
  const handleContactAdded = () => {
    // Pas besoin d'implémentation spécifique car onSnapshot se déclenchera automatiquement
    console.log("Contact ajouté, en attente de la mise à jour automatique...");
  };

  // Filtrer et paginer les données côté client
  const filteredProfiles = useMemo(() => {
    if (!contacts || contacts.length === 0) return [];

    return contacts.filter((profile: any) => {
      if (!searchQuery) return true;

      // Recherche dans plusieurs champs
      const searchLower = searchQuery.toLowerCase();
      return (
        (profile.firstname &&
          profile.firstname.toLowerCase().includes(searchLower)) ||
        (profile.lastname &&
          profile.lastname.toLowerCase().includes(searchLower)) ||
        (profile.email && profile.email.toLowerCase().includes(searchLower)) ||
        (profile.jobtitle &&
          profile.jobtitle.toLowerCase().includes(searchLower)) ||
        (profile.company &&
          profile.company.toLowerCase().includes(searchLower)) ||
        (profile.location &&
          profile.location.toLowerCase().includes(searchLower))
      );
    });
  }, [contacts, searchQuery]);

  // Calculer les métadonnées de pagination
  const paginationMeta = useMemo(() => {
    const totalItems = filteredProfiles.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }, [filteredProfiles, page, pageSize]);

  // Obtenir les données pour la page actuelle
  const currentPageData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProfiles.slice(startIndex, endIndex);
  }, [filteredProfiles, page, pageSize]);

  // Fonction pour exporter les données au format CSV
  const getPostCsv = async () => {
    try {
      if (!contacts || contacts.length === 0) {
        toast({
          title: "Aucune donnée",
          description: "Il n'y a aucun contact à exporter.",
          duration: 3000,
        });
        return;
      }

      // Collecte de toutes les données
      const profiles = contacts;

      // Conversion en CSV
      const allKeys = new Set<string>();
      profiles.forEach((profile: any) => {
        Object.keys(profile).forEach((key) => allKeys.add(key));
      });

      const headers = Array.from(allKeys).join(",");
      const csvData = profiles
        .map((profile: any) => {
          return Array.from(allKeys)
            .map((key) => {
              const value = profile[key];
              if (typeof value === "string" && value.includes(",")) {
                return `"${value}"`;
              }
              return value !== undefined ? value : "";
            })
            .join(",");
        })
        .join("\n");

      const csv = `${headers}\n${csvData}`;

      // Création et téléchargement du fichier
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const csvUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = csvUrl;
      link.setAttribute("download", "leads.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(csvUrl);

      toast({
        title: "Export réussi",
        description: `${profiles.length} contacts ont été exportés au format CSV.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors de l'exportation des données:", error);
      toast({
        title: "Erreur d'exportation",
        description:
          "Une erreur est survenue lors de l'exportation des contacts.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // État de chargement
  const isLoading = contacts.length === 0 && isRealTimeUpdating;

  // Fonction pour afficher une cellule de table personnalisée
  const CustomTableCell = ({ value }: { value: any }) => {
    return (
      <TableCell className="hidden md:table-cell relative py-4 w-[20%] border-r cursor-pointer">
        <span className="w-full flex-shrink-0 line-clamp-2">{value}</span>
      </TableCell>
    );
  };

  return (
    <DashboardLayout title="My Contacts">
      <div className="h-full flex flex-col py-5 px-4 space-y-5 overflow-hidden">
        <div className="self-end flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // Revenir à la première page lors d'une recherche
              }}
            />
          </div>

          <Button
            variant="ghost"
            onClick={getPostCsv}
            disabled={!contacts?.length}
            className="gap-2 flex items-center border"
          >
            <Export size={18} /> Export
          </Button>

          <AddContactSheet onContactAdded={handleContactAdded}>
            <Button className="gap-2 flex items-center">Create contact</Button>
          </AddContactSheet>
        </div>

        <div className="flex-1 flex flex-col w-full overflow-x-hidden overflow-auto">
          <Tabs defaultValue="week" className="flex flex-col">
            <TabsContent value="week" className="flex-1 flex flex-col mt-0">
              <Card className="rounded-none flex-1 flex flex-col py-0 my-0">
                <CardContent className="flex-1 flex flex-col p-0">
                  <div className="flex-1 flex flex-col min-h-0">
                    <Table>
                      <TableHeader className="sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="hidden md:table-cell py-4 w-[20%] border-r">
                            Username
                          </TableHead>
                          <TableHead className="hidden md:table-cell py-4 w-[20%] border-r">
                            Email
                          </TableHead>
                          <TableHead className="hidden md:table-cell py-4 w-[20%] border-r">
                            Job title
                          </TableHead>
                          <TableHead className="py-4 w-[20%] border-r">
                            Company name
                          </TableHead>
                          <TableHead className="py-4 w-[16%] border-r">
                            Location
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="overflow-auto">
                        {isLoading &&
                          Array(6)
                            .fill(null)
                            .map((_, index) => (
                              <TableLoadingSkeleton key={index} rowCount={5} />
                            ))}

                        {!isLoading && currentPageData.length > 0
                          ? currentPageData.map(
                              (contact: any, index: number) => (
                                <ContactDetailSheet
                                  key={contact.id || index}
                                  contact={contact}
                                >
                                  <TableRow key={contact.id || index}>
                                    <CustomTableCell
                                      value={
                                        contact?.firstname +
                                        " " +
                                        contact?.lastname
                                      }
                                    />
                                    <CustomTableCell
                                      value={contact?.email ?? "N/A"}
                                    />
                                    <CustomTableCell
                                      value={contact?.jobtitle}
                                    />
                                    <CustomTableCell
                                      value={contact?.company ?? "N/A"}
                                    />
                                    <CustomTableCell
                                      value={contact?.location}
                                    />
                                  </TableRow>
                                </ContactDetailSheet>
                              )
                            )
                          : null}
                      </TableBody>
                    </Table>

                    {!isLoading &&
                      (!currentPageData || currentPageData.length === 0) && (
                        <NotFoundData
                          error="Start a new search"
                          description="Search and collect leads from linkedin"
                        />
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {paginationMeta.totalPages > 1 && (
          <CardFooter className="border p-0 py-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem className="cursor-pointer">
                  <Button
                    variant="ghost"
                    className="cursor-pointer gap-2"
                    disabled={!paginationMeta.hasPrevPage}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    <ChevronLeft size={18} /> Previous
                  </Button>
                </PaginationItem>

                {paginationMeta.hasPrevPage && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem className="border border-gray-400 rounded-sm size-8 flex flex-col items-center justify-center bg-primary">
                  <span className="text-white font-medium">{page}</span>
                </PaginationItem>

                {paginationMeta.hasNextPage && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem className="cursor-pointer">
                  <Button
                    variant="ghost"
                    className="cursor-pointer gap-2"
                    disabled={!paginationMeta.hasNextPage}
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(paginationMeta.totalPages, prev + 1)
                      )
                    }
                  >
                    Next <ChevronRight size={18} />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </div>
    </DashboardLayout>
  );
}
