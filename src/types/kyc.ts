export type DocumentType =
  | "ID_PASSPORT"
  | "ID_FRONT"
  | "ID_BACK"
  | "DRIVERS_LICENSE"
  | "UTILITY_BILL"
  | "BANK_STATEMENT"
  | "CREDIT_CARD_STATEMENT"
  | "TAX_BILL"
  | "OTHER_ID"
  | "OTHER_ADDRESS"
  | "OTHER_DOC";

export type DocumentCategory =
  | "ID_VERIFICATION"
  | "ADDRESS_VERIFICATION"
  | "OTHER_DOCUMENTATION";

export type KYCStatus = "PENDING" | "APPROVED" | "REJECTED";

export type DocumentStatus = "pending" | "verified" | "rejected";

export interface KYCDocument {
  id: string;
  fileName: string;
  type: DocumentType;
  status: DocumentStatus;
  uploadDate: string;
  expiryDate?: string;
  verificationDate?: string;
  category: DocumentCategory;
  metadata?: {
    fileSize: number;
    mimeType: string;
    [key: string]: unknown;
  };
}

export interface DocumentTypeInfo {
  value: DocumentType;
  label: string;
  required: boolean;
}

export interface DocumentCategoryInfo {
  category: DocumentCategory;
  title: string;
  description: string;
  required: boolean;
  documentTypes: DocumentTypeInfo[];
}

export interface DocumentUploadProps {
  onSuccess: () => Promise<void>;
}

export interface DocumentListProps {
  documents: KYCDocument[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}
