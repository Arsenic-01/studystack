"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import UploadNotesForm from "./UploadNotesForm";
import UploadYoutubeForm from "./UploadYoutubeForm";
import UploadLinkForm from "./UploadLinkForm";

export function AddContentModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0 w-full md:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Content
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="note" className="w-full mt-4 lg:mt-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="note">Note</TabsTrigger>
            <TabsTrigger value="youtube">YouTube Video</TabsTrigger>
            <TabsTrigger value="link">Link</TabsTrigger>
          </TabsList>
          <TabsContent value="note">
            <UploadNotesForm />
          </TabsContent>
          <TabsContent value="youtube">
            <UploadYoutubeForm />
          </TabsContent>
          <TabsContent value="link">
            <UploadLinkForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
