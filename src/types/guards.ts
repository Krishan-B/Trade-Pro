import { DocumentType } from "./kyc";

const DOCUMENT_TYPE_VALUES: DocumentType[] = [
  "ID_PASSPORT",
  "ID_FRONT",
  "ID_BACK",
  "DRIVERS_LICENSE",
  "UTILITY_BILL",
  "BANK_STATEMENT",
  "CREDIT_CARD_STATEMENT",
  "TAX_BILL",
  "OTHER_ID",
  "OTHER_ADDRESS",
  "OTHER_DOC",
];

export function isDocumentType(value: unknown): value is DocumentType {
  return (
    typeof value === "string" &&
    DOCUMENT_TYPE_VALUES.includes(value as DocumentType)
  );
}
