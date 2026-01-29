import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { CheckCircle2, Download, Maximize2, FileText } from "lucide-react";

interface CreativePreviewCardProps {
  creativeFileUrl?: string | null;
  creativeFileName?: string | null;
  creativeFileSize?: number | null;
  width?: number;
  height?: number;
  dimensionUnit?: string;
}

export function CreativePreviewCard({
  creativeFileUrl,
  creativeFileName,
  creativeFileSize,
  width,
  height,
  dimensionUnit,
}: CreativePreviewCardProps) {
  const formatFileSize = (bytes?: number | null): string => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleDownload = () => {
    if (creativeFileUrl) {
      window.open(creativeFileUrl, "_blank");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Creative File</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Preview/Icon */}
        <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>

        {/* File Info */}
        {creativeFileName && (
          <div className="space-y-1">
            <p className="font-medium">{creativeFileName}</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(creativeFileSize)}
              {width && height && dimensionUnit && (
                <> • {width}×{height} {dimensionUnit}</>
              )}
            </p>
          </div>
        )}

        {/* Validation Status */}
        {creativeFileUrl && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Specs validated
            </Badge>
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              File approved
            </Badge>
          </div>
        )}

        {/* Actions */}
        {creativeFileUrl && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download File
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Maximize2 className="mr-2 h-4 w-4" />
              View Full Size
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
