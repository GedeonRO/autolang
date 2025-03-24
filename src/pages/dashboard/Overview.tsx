/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import { TableLoadingSkeleton } from "@/components/dashboard/TableSkeleton";
import { ContactDetailSheet } from "@/components/sheets/contactDetails";
import { db } from "@/firebase/config";
import { getUid } from "@/lib/helpers/getUid";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AddProjetSheet } from "@/components/sheets/addProjet";
import { PlusCircle } from "lucide-react";

interface Contact extends DocumentData {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  jobtitle?: string;
  location?: string;
  createdAt?: any;
}

export function Overview() {
  // State definitions with proper typing
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingRecentContacts, setIsLoadingRecentContacts] = useState(true);
  const [listCount, setListCount] = useState<number | null>(null);
  const [contactCount, setContactCount] = useState<number | null>(null);

  // First useEffect for contact and list counts
  useEffect(() => {
    const uid = getUid();
    if (!uid) {
      // setIsLoadingContacts(false);
      // setContactCount(0);
      // setListCount(0);
      return;
    }

    // Store listener references directly
    let contactsListener: (() => void) | null = null;
    let listsListener: (() => void) | null = null;

    // Contact count listener
    try {
      const profilesRef = collection(db, "profiles");
      const q = query(profilesRef, where("uid", "==", uid));

      contactsListener = onSnapshot(
        q,
        (snapshot) => {
          setContactCount(snapshot.size);
          setIsLoadingContacts(false);
          console.log("Contact count updated:", snapshot.size);
        },
        (error) => {
          console.error("Error fetching contact count:", error);
          setIsLoadingContacts(false);
          setContactCount(0);
        }
      );
    } catch (error) {
      console.error("Error setting up contact listener:", error);
      setIsLoadingContacts(false);
      setContactCount(0);
    }

    // List count listener
    try {
      const listsRef = collection(db, "lists");
      const q = query(listsRef, where("uid", "==", uid));

      listsListener = onSnapshot(
        q,
        (snapshot) => {
          setListCount(snapshot.size);
          console.log("List count updated:", snapshot.size);
        },
        (error) => {
          console.error("Error fetching list count:", error);
          setListCount(0);
        }
      );
    } catch (error) {
      console.error("Error setting up list listener:", error);
      setListCount(0);
    }

    // Clean up function that directly calls the unsubscribe functions
    return () => {
      console.log("Dashboard: Cleaning up contact and list listeners");
      if (contactsListener) contactsListener();
      if (listsListener) listsListener();
    };
  }, []);

  // Second useEffect for recent contacts
  useEffect(() => {
    const uid = getUid();
    if (!uid) {
      // setIsLoadingRecentContacts(false);
      // setRecentContacts([]);
      return;
    }

    let recentContactsListener: (() => void) | null = null;

    try {
      const profilesRef = collection(db, "profiles");
      const q = query(
        profilesRef,
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      recentContactsListener = onSnapshot(
        q,
        (snapshot) => {
          const contactsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Contact[];

          console.log("Recent contacts updated:", contactsData.length);
          setRecentContacts(contactsData);
          setIsLoadingRecentContacts(false);
        },
        (error) => {
          console.error("Error fetching recent contacts:", error);
          setIsLoadingRecentContacts(false);
          setRecentContacts([]);
        }
      );
    } catch (error) {
      console.error("Error setting up recent contacts listener:", error);
      setIsLoadingRecentContacts(false);
      setRecentContacts([]);
    }

    // Clean up function that directly calls the unsubscribe function
    return () => {
      console.log("Dashboard: Cleaning up recent contacts listener");
      if (recentContactsListener) recentContactsListener();
    };
  }, []);

  return (
    <DashboardLayout title="Overview">
      <div className="flex flex-col gap-12 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
          <Card className="rounded-none border-b-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <span>Projets</span>
                <h1 className="text-2xl font-bold">
                  {isLoadingContacts
                    ? "..."
                    : contactCount === null
                    ? "..."
                    : contactCount}
                </h1>
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <h1 className="text-gray-500">
                Your saved or connected contacts
              </h1>
            </CardFooter>
          </Card>

          <Card className="rounded-none border-b-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <span>Langues</span>
                <h1 className="text-2xl font-bold">
                  {listCount === null ? "..." : listCount}
                </h1>
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <h1 className="text-gray-500">Custom groups of contacts.</h1>
            </CardFooter>
          </Card>

          <Card className="rounded-none border-b-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <span>Mots</span>
                <h1 className="text-2xl font-bold">100</h1>
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <h1 className="text-gray-500">Your current credit balance.</h1>
            </CardFooter>
          </Card>
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-5 ">
          <div className="col-span-1 ">
            <Tabs defaultValue="week" className="h-full flex flex-col">
              <TabsContent value="week" className="flex-1 flex flex-col mt-0 ">
                <Card className="rounded-none flex-1 flex flex-col py-0 my-0 shadow-none bg-transparent border-none ">
                  <CardContent className="flex-1 flex flex-col p-0 ">
                    <div className="flex flex-col w-full gap-10 ">
                      <div className="flex w-full justify-between items-center ">
                        <span className="text-2xl font-bold">Projets</span>
                        <AddProjetSheet>
                          <Button>Ajouter nouveau projet</Button>
                        </AddProjetSheet>
                      </div>
                      <AddProjetSheet>
                        <div className="w-full cursor-pointer h-[250px] border flex justify-center border-dashed items-center">
                          <PlusCircle size={25} />
                        </div>
                      </AddProjetSheet>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
