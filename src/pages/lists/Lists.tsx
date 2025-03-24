/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AddListSheet } from "@/components/sheets/addList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Search } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/firebase/config";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { NotFoundData } from "@/components/request/NotFoundData";
import { TableLoadingSkeleton } from "@/components/dashboard/TableSkeleton";

// Interface pour le type de liste
interface List {
  id: string;
  name: string;
  size: number;
  owner: string;
  lastUpdated: Timestamp;
  createdAt: Timestamp;
  uid: string;
}
export function ListPage() {
  const [user] = useCurrentUser();
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fonction pour formater les timestamps Firestore
  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return "Date inconnue";

    const date = timestamp.toDate();

    // Vérifier si c'est aujourd'hui
    const today = new Date();
    const isToday = date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return `Today at ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
    }

    // Retourner la date formatée
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

   // Récupérer les listes depuis Firebase avec un écouteur en temps réel
   useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    
    const listsRef = collection(db, "lists");
    const q = query(listsRef, where("uid", "==", user.uid));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedLists: List[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedLists.push({
            id: doc.id,
            name: data.name || "Sans nom",
            size: data.size || 0,
            owner: data.owner || "Inconnu",
            lastUpdated: data.lastUpdated,
            createdAt: data.createdAt,
            uid: data.uid
          });
        });
        
        // Trier par date de mise à jour (la plus récente en premier)
        fetchedLists.sort((a, b) => {
          if (!a.lastUpdated || !b.lastUpdated) return 0;
          return b.lastUpdated.seconds - a.lastUpdated.seconds;
        });
        
        setLists(fetchedLists);
        setIsLoading(false);
      },
      (error) => {
        console.error("Erreur lors de la récupération des listes:", error);
        setIsLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [user]);

   // Filtrer les listes en fonction de la recherche
   const filteredLists = useMemo(() => {
    if (!searchQuery) return lists;
    
    const query = searchQuery.toLowerCase();
    return lists.filter(list => 
      list.name.toLowerCase().includes(query) || 
      list.owner.toLowerCase().includes(query)
    );
  }, [lists, searchQuery]);

  // Fonction pour rafraîchir la liste (utilisée par AddListSheet)
  const refreshLists = () => {
    // Pas besoin d'implémentation spécifique ici car onSnapshot se déclenche automatiquement
    console.log("Rafraîchissement des listes...");
  };
  return (
    <DashboardLayout title="My Lists">
      <div className="h-full flex flex-col py-5 px-4 space-y-5 overflow-hidden">
        <div className="self-end flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AddListSheet onListAdded={refreshLists}>
            <Button className="gap-2 flex items-center">Create List</Button>
          </AddListSheet>
        </div>

        <div className="flex flex-col w-full overflow-x-hidden">
          <Tabs defaultValue="week" className="h-full flex flex-col">
            <TabsContent value="week" className="flex-1 flex flex-col mt-0">
              <Card className="rounded-none flex-1 flex flex-col py-0 my-0">
                <CardContent className="flex-1 flex flex-col p-0">
                  <div className="flex-1 flex flex-col min-h-0">
                    <Table>
                      <TableHeader className="sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="hidden md:table-cell py-4 w-[20%] border-r">
                            Name
                          </TableHead>
                          <TableHead className="hidden md:table-cell py-4 w-[20%] border-r">
                            Size
                          </TableHead>
                          <TableHead className="py-4 w-[16%] border-r">
                            Owner
                          </TableHead>
                          <TableHead className="hidden md:table-cell py-4 w-[20%] border-r">
                            Last updated
                          </TableHead>
                          <TableHead className="py-4 w-[16%] border-r">
                            Created at
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="overflow-auto">
                        {isLoading && (
                          <TableLoadingSkeleton rowCount={5} />
                        )}

                        {!isLoading && filteredLists.length > 0 && filteredLists.map((list) => (
                          <TableRow key={list.id}>
                            <TableCell className="hidden md:table-cell relative w-[20%] border-r cursor-pointer">
                              <Link
                                to={`/list/${list.id}`}
                                className="truncate block w-full py-2 text-primary font-medium"
                              >
                                {list.name}
                              </Link>
                            </TableCell>
                            <CustomTableCell value={list.size} />
                            <CustomTableCell value={list.owner} />
                            <CustomTableCell value={formatTimestamp(list.lastUpdated)} />
                            <CustomTableCell value={formatTimestamp(list.createdAt)} />
                          </TableRow>
                        ))}

                        {!isLoading && filteredLists.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <NotFoundData
                                error="No lists found"
                                description={searchQuery ? "Try a different search term" : "Create your first list to get started"}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

const CustomTableCell = ({ value }: { value: any }) => {
  return (
    <TableCell className="hidden md:table-cell relative py-4 w-[20%] border-r cursor-pointer">
      <span className="truncate block w-full">{value}</span>
    </TableCell>
  );
};