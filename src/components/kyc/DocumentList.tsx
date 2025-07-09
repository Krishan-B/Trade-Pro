import { FileText, Trash2, Eye, Calendar } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import type { KYCDocument } from "@/types/kyc";

interface DocumentListProps {
  documents: KYCDocument[];
  onRefresh?: () => Promise<void>;
}

const DocumentList = ({ documents, onRefresh }: DocumentListProps) => {
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-6 h-6" />
                <div>
                  <h4 className="font-medium">{doc.fileName}</h4>
                  <p className="text-sm text-muted-foreground">{doc.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={doc.status === "verified" ? "secondary" : "default"}
                >
                  {doc.status}
                </Badge>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Document Details</DialogTitle>
                      <DialogDescription>
                        Details for {doc.fileName}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <p>
                        <Calendar className="inline mr-2" /> Uploaded:{" "}
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                      {doc.expiryDate && (
                        <p>
                          <Calendar className="inline mr-2" /> Expires:{" "}
                          {new Date(doc.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                      {doc.verificationDate && (
                        <p>
                          <Calendar className="inline mr-2" /> Verified:{" "}
                          {new Date(doc.verificationDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Document</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this document? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onRefresh}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentList;
