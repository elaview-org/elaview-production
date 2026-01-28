import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/primitives/card";

const verificationImages = [
  { src: "/images/verification1.jpg", alt: "Verification Photo 1" },
  { src: "/images/verification2.jpg", alt: "Verification Photo 2" },
  { src: "/images/verification3.jpg", alt: "Verification Photo 3" },
];

export default function InstallationReviews() {
  return (
    <Card>
      <CardContent>
        <CardTitle>Installation Review</CardTitle>
        <div className="mb-2 font-medium">Owner&apos;s Verification Photos</div>
        <div className="flex max-w-full gap-4 overflow-hidden">
          {verificationImages.map((img, idx) => (
            <div
              key={idx}
              className="bg-muted flex w-32 flex-col items-center rounded border p-2"
            >
              <div className="relative mb-2 h-20 w-full overflow-hidden rounded">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-gray-600">{img.alt}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
