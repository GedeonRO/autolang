import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/Project-card";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-navbar-bg">
      <Navbar />
      <div className="h-screen flex-1 mt-[68px]">
        <Tabs defaultValue="projects">
          <section className="flex items-center bg-section-bg border-foreground border-b ">
            <div className=" mx-[164px] h-[186px]  w-full">
              <div className="pt-[40px] flex flex-col h-full items-start justify-between">
                <div className="flex w-full items-center justify-between">
                  <div className="flex gap-2 items-center cursor-pointer ">
                    <span className="text-2xl roboto-bold">TEST</span>
                    <div className="bg-button px-3 py-1 rounded-full">
                      <span className="text-sm">FREE</span>
                    </div>
                    <ChevronDown size={15} />
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="shrink-0 bg-slate-600 size-11 rounded-full flex items-center justify-center">
                      <span className="roboto-medium text-xl">G</span>
                    </div>
                    <Button className="">
                      <Plus size={15} />
                      invite
                    </Button>
                  </div>
                </div>
                <TabsList
                  className="gap-8 bg-inherit text-base "
                  style={{ fontFamily: "Inter" }}>
                  <TabsTrigger className="hover:bg-button " value="projects">
                    Projects
                  </TabsTrigger>
                  <TabsTrigger className="hover:bg-button" value="members">
                    Members
                  </TabsTrigger>
                  <TabsTrigger className="hover:bg-button" value="usage">
                    Usage
                  </TabsTrigger>
                  <TabsTrigger className="hover:bg-button" value="biling">
                    Billing
                  </TabsTrigger>
                  <TabsTrigger className="hover:bg-button" value="settings">
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </section>
          <section className="bg-navbar-bg ">
            <div className="mx-[164px]">
              <TabsContent className="" value="projects">
                <div className="flex flex-col w-full items-center">
                  <div className="flex justify-between w-full items-center ">
                    <span className="text-2xl py-10 font-semibold">
                      Projects
                    </span>
                    <button className="bg-[#0C4185] flex gap-2 items-center hover:bg-[#0C4199] transition-all text-white ease-in-out duration-300 roboto-medium px-5 py-[10px] rounded-sm">
                      <Plus size={15} />
                      <span>Create project</span>
                    </button>
                  </div>
                  <div className="grid col-span-2 grid-cols-2 w-full gap-8">
                    <ProjectCard />
                    <ProjectCard />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="members">
                <div className="flex flex-col w-full items-center">
                  <div className="flex justify-between w-full items-center ">
                    <span className="text-2xl py-10 font-semibold">
                      Members
                    </span>
                    <Button disabled>
                      <Plus size={15} />
                      invite
                    </Button>
                  </div>
                  <div className="rounded-2xl bg-section-tabcontent p-5 w-full">
                    <table className="w-full  border-spacing-0">
                      <thead className="border-b">
                        <tr>
                          <th className="p-3 text-left border-b">NAME</th>
                          <th className="p-3 text-left border-b">EMAIL</th>
                          <th className="p-3 text-left border-b">ROLE</th>
                          <th className="p-3 text-left"> </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3">GedeonRO</td>
                          <td className="p-3">gedeonbenoit24@gmail.com</td>
                          <td className="p-3">owner</td>
                          <td className="p-3"> </td>
                        </tr>
                      </tbody>
                      <tfoot className="border-t">
                        <tr>
                          <td colSpan="4" className="p-3 text-center">
                            Upgrade your plan to add members to your
                            organization
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <div className="flex flex-col w-full items-center">
                  <div className="flex justify-between w-full items-center ">
                    <span className="text-2xl py-10 font-semibold">
                      Members
                    </span>
                    <Button disabled>
                      <Plus size={15} />
                      invite
                    </Button>
                  </div>
                  <div className="rounded-2xl bg-section-tabcontent p-5 w-full">
                    <table className="w-full  border-spacing-0">
                      <thead className="border-b">
                        <tr>
                          <th className="p-3 text-left border-b">NAME</th>
                          <th className="p-3 text-left border-b">EMAIL</th>
                          <th className="p-3 text-left border-b">ROLE</th>
                          <th className="p-3 text-left"> </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3">GedeonRO</td>
                          <td className="p-3">gedeonbenoit24@gmail.com</td>
                          <td className="p-3">owner</td>
                          <td className="p-3"> </td>
                        </tr>
                      </tbody>
                      <tfoot className="border-t">
                        <tr>
                          <td colSpan="4" className="p-3 text-center">
                            Upgrade your plan to add members to your
                            organization
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </div>
          </section>
        </Tabs>
        <Footer />
      </div>
    </div>
  );
}
