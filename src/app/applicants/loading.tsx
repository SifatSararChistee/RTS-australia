// app/applicants/loading.tsx  (same folder as your page)

function SkeletonRow({
  widthName,
  widthType,
  delay,
}: {
  widthName: string;
  widthType: string;
  delay: string;
}) {
  return (
    <div
      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse shrink-0" />
        <div>
          <div
            className="h-3.5 bg-gray-100 rounded animate-pulse mb-2"
            style={{ width: widthName }}
          />
          <div
            className="h-2.5 bg-gray-100 rounded animate-pulse"
            style={{ width: widthType }}
          />
        </div>
      </div>
      <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
    </div>
  );
}

export default function Loading() {
  const rows = [
    { widthName: "160px", widthType: "100px", delay: "0ms" },
    { widthName: "130px", widthType: "110px", delay: "75ms" },
    { widthName: "190px", widthType: "85px", delay: "150ms" },
    { widthName: "145px", widthType: "120px", delay: "225ms" },
    { widthName: "170px", widthType: "95px", delay: "300ms" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="h-2.5 w-20 bg-gray-100 rounded animate-pulse mb-3" />
          <div className="h-9 w-56 bg-gray-100 rounded animate-pulse mb-3" />
          <div className="h-3.5 w-80 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mb-5" />
        <div className="space-y-3">
          {rows.map((row, i) => (
            <SkeletonRow key={i} {...row} />
          ))}
        </div>
      </div>
    </main>
  );
}
