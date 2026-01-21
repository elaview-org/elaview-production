import { Card, CardContent, CardTitle } from "@/components/card";

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
        <div className="mb-2 font-medium">Owner’s Verification Photos</div>
        <div className="flex gap-4 max-w-full overflow-hidden">
          {verificationImages.map((img, idx) => (
            <div
              key={idx}
              className="bg-muted flex w-32 flex-col items-center rounded border p-2"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="mb-2 h-20 w-full rounded object-cover"
                loading="lazy"
              />
              <span className="text-xs text-gray-600">{img.alt}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
