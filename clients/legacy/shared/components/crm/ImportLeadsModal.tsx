// src/components/crm/ImportLeadsModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
// import { api } from "../../../../elaview-mvp/src/trpc/react";
import {
  X,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import {
  downloadTemplate,
  downloadExcelTemplate,
} from "@/shared/lib/import-utils";
import * as XLSX from "xlsx";

type BusinessType = any;
interface ImportLeadsModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type ColumnMapping = Record<
  string,
  | "name"
  | "email"
  | "phone"
  | "website"
  | "location"
  | "businessType"
  | "hasInventory"
  | "hasInstallCapability"
  | "estimatedSpaces"
  | "notes"
  | "skip"
>;

type ParsedData = {
  headers: string[];
  rows: string[][];
};

const BUSINESS_TYPE_OPTIONS = [
  { label: "Billboard Company", value: "BILLBOARD_OPERATOR" },
  { label: "Sign Company", value: "SIGN_COMPANY" },
  { label: "Wrap/Vehicle Installer", value: "WRAP_INSTALLER" },
  { label: "Property Manager", value: "PROPERTY_MANAGER" },
  { label: "Print Shop", value: "PRINT_SHOP" },
  { label: "Agency", value: "AGENCY" },
  { label: "Other", value: "OTHER" },
];

export function ImportLeadsModal({
  onClose,
  onSuccess,
}: ImportLeadsModalProps) {
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [businessType, setBusinessType] = useState<BusinessType>("OTHER");
  const [importSource, setImportSource] = useState("");
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  // Excel-specific state
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [currentWorkbook, setCurrentWorkbook] = useState<XLSX.WorkBook | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to get header name for a field
  const getHeaderForField = (field: string): string | undefined => {
    return Object.keys(columnMapping).find(
      (header) => columnMapping[header] === field
    );
  };

  // Helper to get value from row by field
  const getValueForField = (
    row: string[],
    field: string
  ): string | undefined => {
    const header = getHeaderForField(field);
    if (!header) return undefined;
    const headerIndex = parsedData?.headers.indexOf(header);
    if (headerIndex === undefined || headerIndex === -1) return undefined;
    return row[headerIndex];
  };

  // Check if name field is mapped
  const hasNameField = Object.values(columnMapping).includes("name");

  // tRPC mutations - using mutation for preview to handle large payloads via POST
  // const previewMutation = api.crm.previewImport.useMutation();
  const previewMutation = () => {};
  // Auto-trigger preview when data is ready
  useEffect(() => {
    if (parsedData && hasNameField && parsedData.rows.length > 0) {
      console.log("🔄 Triggering preview for", parsedData.rows.length, "leads");
      const leadsToPreview = parsedData.rows.map((row) => ({
        name: getValueForField(row, "name") || "Unknown",
        email: getValueForField(row, "email") || undefined,
        phone: getValueForField(row, "phone") || undefined,
        website: getValueForField(row, "website") || undefined,
      }));
      console.log("📤 Sending leads to preview:", leadsToPreview.length);
      previewMutation.mutate({ leads: leadsToPreview });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedData, hasNameField]);

  // const importMutation = api.crm.importLeads.useMutation({
  //   onSuccess: (results) => {
  //     setImportResults(results);
  //     toast.success(
  //       `Import complete: ${results.created} created, ${results.updated} updated, ${results.skipped} skipped`
  //     );
  //     if (results.errors.length > 0) {
  //       toast.error(`${results.errors.length} errors occurred`);
  //     }
  //   },
  //   onError: (error) => {
  //     toast.error(error.message || "Import failed");
  //   },
  // });

  const importMutation = ()=>{}
  // CSV Parsing
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const parseCSV = (text: string): ParsedData => {
    const lines = text
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    const headers = parseCSVLine(lines[0]!);
    const rows = lines
      .slice(1)
      .map(parseCSVLine)
      .filter((row) => row.some((cell) => cell.trim()));
    return { headers, rows };
  };

  const parseTSV = (text: string): ParsedData => {
    const lines = text
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    const headers = lines[0]!.split("\t").map((h) => h.trim());
    const rows = lines
      .slice(1)
      .map((line) => line.split("\t").map((cell) => cell.trim()));
    return { headers, rows };
  };

  // File upload handler - supports CSV and XLSX
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    setImportSource(file.name);

    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      // Parse Excel file
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);

        setCurrentWorkbook(workbook);
        setAvailableSheets(workbook.SheetNames);

        // Auto-select first sheet
        if (workbook.SheetNames.length > 0) {
          const firstSheet = workbook.SheetNames[0]!;
          setSelectedSheet(firstSheet);
          parseExcelSheet(workbook, firstSheet);
        }
      } catch (error) {
        toast.error("Failed to parse Excel file");
        console.error(error);
      }
    } else {
      // Parse CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        setParsedData(parsed);
        autoMapColumns(parsed.headers);
      };
      reader.readAsText(file);

      // Reset Excel state
      setAvailableSheets([]);
      setSelectedSheet("");
      setCurrentWorkbook(null);
    }
  };

  // Parse a specific sheet from Excel workbook
  const parseExcelSheet = (workbook: XLSX.WorkBook, sheetName: string) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;

    // Convert to array of arrays
    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log("📊 XLSX parsed rows:", rows.length);
    console.log("📋 First 5 rows:", rows.slice(0, 5));

    if (rows.length > 0) {
      const headers = rows[0]!.map((h) => {
        // Handle rich text or object cells
        if (h === null || h === undefined) return "";
        if (typeof h === "object" && "v" in h) return String(h.v).trim();
        if (typeof h === "object" && "text" in h) return String(h.text).trim();
        return String(h).trim();
      });

      console.log("📌 Headers:", headers);

      // Process data rows - convert cells to strings
      const dataRows = rows
        .slice(1)
        .map((row, idx) => {
          const processedRow = row.map((cell) => {
            // Handle null/undefined
            if (cell === null || cell === undefined) return "";

            // Handle rich text or object cells
            if (typeof cell === "object") {
              if ("v" in cell) return String(cell.v).trim();
              if ("text" in cell) return String(cell.text).trim();
              if ("w" in cell) return String(cell.w).trim(); // formatted value
              return String(cell).trim();
            }

            return String(cell).trim();
          });

          // Debug first few rows
          if (idx < 3) {
            console.log(`Row ${idx + 1}:`, processedRow);
          }

          return processedRow;
        })
        // Filter out completely empty rows (no data in any cell)
        .filter((row) => {
          const hasData = row.some((cell) => cell && cell.trim() !== "");
          return hasData;
        });

      console.log("✅ Data rows after filtering:", dataRows.length);
      console.log("Sample data row:", dataRows[0]);

      const parsed: ParsedData = { headers, rows: dataRows };
      setParsedData(parsed);
      autoMapColumns(parsed.headers);
    }
  };

  // Handle sheet selection change
  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (currentWorkbook) {
      parseExcelSheet(currentWorkbook, sheetName);
    }
  };

  // Paste handler
  const handlePaste = () => {
    const text = textAreaRef.current?.value;
    if (!text) return;

    // Detect if TSV or CSV
    const isTSV = text.includes("\t");
    const parsed = isTSV ? parseTSV(text) : parseCSV(text);
    setParsedData(parsed);
    autoMapColumns(parsed.headers);
  };

  // Auto-detect column mappings
  const autoMapColumns = (headers: string[]) => {
    const mapping: ColumnMapping = {};

    headers.forEach((header) => {
      const lower = header.toLowerCase();
      if (lower.includes("name") || lower.includes("company")) {
        mapping[header] = "name";
      } else if (lower.includes("email") || lower.includes("mail")) {
        mapping[header] = "email";
      } else if (lower.includes("phone") || lower.includes("tel")) {
        mapping[header] = "phone";
      } else if (lower.includes("website") || lower.includes("url")) {
        mapping[header] = "website";
      } else if (
        lower.includes("location") ||
        lower.includes("city") ||
        lower.includes("address")
      ) {
        mapping[header] = "location";
      } else if (lower.includes("business") && lower.includes("type")) {
        mapping[header] = "businessType";
      } else if (
        lower.includes("inventory") ||
        lower.includes("has inventory")
      ) {
        mapping[header] = "hasInventory";
      } else if (lower.includes("install") || lower.includes("does install")) {
        mapping[header] = "hasInstallCapability";
      } else if (lower.includes("spaces") || lower.includes("estimated")) {
        mapping[header] = "estimatedSpaces";
      } else if (lower.includes("note")) {
        mapping[header] = "notes";
      } else {
        mapping[header] = "skip";
      }
    });

    setColumnMapping(mapping);
  };

  // Execute import
  const handleImport = () => {
    if (!parsedData || !hasNameField) {
      toast.error("Please map the Company Name column");
      return;
    }

    console.log("🚀 Starting import...");
    console.log("Column mapping:", columnMapping);
    console.log("Headers:", parsedData.headers);
    console.log("Total rows:", parsedData.rows.length);

    // Find which column is mapped to 'name'
    const nameHeader = Object.keys(columnMapping).find(
      (header) => columnMapping[header] === "name"
    );
    console.log("Name column header:", nameHeader);

    const leads = parsedData.rows
      .map((row, idx) => {
        const lead: any = {};

        Object.keys(columnMapping).forEach((header) => {
          const field = columnMapping[header];
          if (field && field !== "skip") {
            const headerIndex = parsedData.headers.indexOf(header);
            if (headerIndex !== -1) {
              const value = row[headerIndex];
              // Don't skip if value is empty string - let the backend validation handle it
              if (value !== undefined && value !== null) {
                lead[field] = value;
              }
            }
          }
        });

        // Debug first few leads
        if (idx < 3) {
          console.log(`Lead ${idx + 1}:`, lead);
        }

        return lead;
      })
      .filter((lead) => {
        const hasName = lead.name && String(lead.name).trim() !== "";
        if (!hasName && parsedData.rows.length < 10) {
          console.log("Filtered out lead (no name):", lead);
        }
        return hasName;
      });

    console.log("📤 Leads to import:", leads.length);
    console.log("Sample lead:", leads[0]);

    if (leads.length === 0) {
      toast.error(
        "No valid leads found. Make sure the Company Name column is mapped and has data."
      );
      return;
    }

    importMutation.mutate({
      leads,
      importSource: importSource || "CSV Import",
      defaultBusinessType: businessType,
    });
  };

  const preview = previewMutation.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Import Leads</h2>
            <p className="text-sm text-slate-400 mt-1">
              Upload CSV or paste data to batch import leads
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!importResults ? (
            <>
              {/* Template Download Section */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">
                      Need a template?
                    </h4>
                    <p className="text-xs text-slate-400">
                      Download a template with all available fields and example
                      data.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={downloadExcelTemplate}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors"
                      title="Download Excel template"
                    >
                      <Download className="w-4 h-4" />
                      Excel
                    </button>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                      title="Download CSV template"
                    >
                      <Download className="w-4 h-4" />
                      CSV
                    </button>
                  </div>
                </div>

                {/* Field Reference */}
                <details className="mt-3">
                  <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                    View field descriptions
                  </summary>
                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    <p>
                      <span className="text-slate-300">Company Name</span> —
                      Required. Business name.
                    </p>
                    <p>
                      <span className="text-slate-300">Email</span> — Contact
                      email address.
                    </p>
                    <p>
                      <span className="text-slate-300">Phone</span> — Any
                      format, will be normalized.
                    </p>
                    <p>
                      <span className="text-slate-300">Website</span> — Company
                      website URL.
                    </p>
                    <p>
                      <span className="text-slate-300">Location</span> — City,
                      State or full address.
                    </p>
                    <p>
                      <span className="text-slate-300">Business Type</span> —
                      SIGN_COMPANY, BILLBOARD_OPERATOR, WRAP_INSTALLER,
                      PROPERTY_MANAGER, PRINT_SHOP, AGENCY, or OTHER
                    </p>
                    <p>
                      <span className="text-slate-300">Has Inventory</span> —
                      YES, NO, or UNKNOWN (for Phase 1 qualification)
                    </p>
                    <p>
                      <span className="text-slate-300">Does Installs</span> —
                      YES, NO, or UNKNOWN (for Phase 1 qualification)
                    </p>
                    <p>
                      <span className="text-slate-300">Estimated Spaces</span> —
                      Approximate number of ad spaces they have.
                    </p>
                    <p>
                      <span className="text-slate-300">Notes</span> — Any
                      additional context.
                    </p>
                  </div>
                </details>
              </div>

              {/* Input Mode Selector */}
              <div className="flex gap-2 p-1 bg-slate-800 rounded-lg w-fit">
                <button
                  onClick={() => setInputMode("upload")}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    inputMode === "upload"
                      ? "bg-purple-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  Upload CSV
                </button>
                <button
                  onClick={() => setInputMode("paste")}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    inputMode === "paste"
                      ? "bg-purple-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Paste Data
                </button>
              </div>

              {/* Upload/Paste Area */}
              {inputMode === "upload" ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-700 rounded-lg p-8 hover:border-purple-500 transition-colors flex flex-col items-center gap-3"
                  >
                    <Upload className="h-12 w-12 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">
                        Click to upload CSV or Excel file
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        .csv, .xlsx, or .xls files accepted
                      </p>
                    </div>
                  </button>

                  {/* Sheet Selector for Excel files with multiple sheets */}
                  {availableSheets.length > 1 && (
                    <div className="mt-4 p-3 bg-slate-800 border border-slate-700 rounded-lg">
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Multiple sheets detected - Select sheet to import:
                      </label>
                      <select
                        value={selectedSheet}
                        onChange={(e) => handleSheetChange(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {availableSheets.map((sheet) => (
                          <option key={sheet} value={sheet}>
                            {sheet}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <textarea
                    ref={textAreaRef}
                    placeholder="Paste your CSV or tab-separated data here..."
                    className="w-full h-32 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  />
                  <button
                    onClick={handlePaste}
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Parse Data
                  </button>
                </div>
              )}

              {/* Column Mapping */}
              {parsedData && (
                <>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">
                      Column Mapping
                    </h3>
                    <p className="text-sm text-slate-400">
                      Map your CSV columns to lead fields
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {parsedData.headers.map((header, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm truncate">
                            {header}
                          </div>
                          <span className="text-slate-500">→</span>
                          <select
                            value={columnMapping[header] || "skip"}
                            onChange={(e) =>
                              setColumnMapping({
                                ...columnMapping,
                                [header]: e.target.value as any,
                              })
                            }
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="skip">(Skip this column)</option>
                            <option value="name">
                              Company Name ⭐ Required
                            </option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="website">Website</option>
                            <option value="location">Location</option>
                            <option value="businessType">Business Type</option>
                            <option value="hasInventory">Has Inventory</option>
                            <option value="hasInstallCapability">
                              Does Installs
                            </option>
                            <option value="estimatedSpaces">
                              Estimated Spaces
                            </option>
                            <option value="notes">Notes</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Import Settings */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">
                      Import Settings
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                          Default Business Type
                        </label>
                        <select
                          value={businessType}
                          onChange={(e) =>
                            setBusinessType(e.target.value as BusinessType)
                          }
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {BUSINESS_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                          Import Source (optional)
                        </label>
                        <input
                          type="text"
                          value={importSource}
                          onChange={(e) => setImportSource(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g., Billboard companies USA.csv"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  {preview && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white">
                        Import Preview
                      </h3>

                      <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                          <p className="text-sm text-slate-400">Total Rows</p>
                          <p className="text-2xl font-bold text-white">
                            {preview.total}
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-700 bg-emerald-900/20 p-4">
                          <p className="text-sm text-emerald-400">
                            Will Create
                          </p>
                          <p className="text-2xl font-bold text-emerald-400">
                            {preview.willCreate}
                          </p>
                        </div>
                        <div className="rounded-lg border border-blue-700 bg-blue-900/20 p-4">
                          <p className="text-sm text-blue-400">Will Update</p>
                          <p className="text-2xl font-bold text-blue-400">
                            {preview.willUpdate}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                          <p className="text-sm text-slate-400">Will Skip</p>
                          <p className="text-2xl font-bold text-slate-400">
                            {preview.willSkip}
                          </p>
                        </div>
                      </div>

                      {preview.duplicates.length > 0 && (
                        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                          <button
                            onClick={() => setShowDuplicates(!showDuplicates)}
                            className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
                          >
                            {showDuplicates ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                              {preview.duplicates.length} Duplicates Detected
                            </span>
                          </button>

                          {showDuplicates && (
                            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                              {preview.duplicates.map((dup, idx) => (
                                <div
                                  key={idx}
                                  className="text-sm text-slate-400 flex items-center gap-2"
                                >
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                                  <span className="text-white">{dup.name}</span>
                                  <span className="text-slate-500">-</span>
                                  <span>{dup.reason}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            /* Import Results */
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Import Complete!
                  </h3>
                  <p className="text-slate-400">
                    Your leads have been imported successfully
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-emerald-700 bg-emerald-900/20 p-4">
                  <p className="text-sm text-emerald-400">Created</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {importResults.created}
                  </p>
                </div>
                <div className="rounded-lg border border-blue-700 bg-blue-900/20 p-4">
                  <p className="text-sm text-blue-400">Updated</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {importResults.updated}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                  <p className="text-sm text-slate-400">Skipped</p>
                  <p className="text-3xl font-bold text-slate-400">
                    {importResults.skipped}
                  </p>
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
                  <h4 className="font-semibold text-red-400 mb-2">
                    Errors ({importResults.errors.length})
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {importResults.errors.map((error: string, idx: number) => (
                      <p key={idx} className="text-sm text-red-300">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!importResults && parsedData && (
          <div className="flex items-center justify-between p-6 border-t border-slate-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!hasNameField || importMutation.isPending}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>Import {preview?.total || 0} Leads</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
