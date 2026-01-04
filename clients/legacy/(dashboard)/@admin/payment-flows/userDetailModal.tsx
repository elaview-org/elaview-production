export default function UserDetailModal({
  user,
  onClose,
}: {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone?: string | null;
    role: "advertiser" | "owner";
  };
  onClose: () => void;
}) {
  const openWhatsApp = () => {
    if (user.phone) {
      const cleanPhone = user.phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    } else {
      alert("No phone number available for this user");
    }
  };

  const sendEmail = () => {
    window.location.href = `mailto:${user.email}`;
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-8">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user.name ?? "User Details"}
            </h2>
            <p className="text-sm text-gray-600 capitalize">{user.role}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 px-6 py-4">
          {/* Email */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              Email
            </label>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              Phone
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {user.phone ?? "Not provided"}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-4">
            <button
              onClick={sendEmail}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              📧 Send Email
            </button>

            {user.phone && (
              <button
                onClick={openWhatsApp}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
              >
                💬 Open WhatsApp
              </button>
            )}

            <button
              onClick={() =>
                window.open(`/users?search=${user.email}`, "_blank")
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
            >
              👤 View Full Profile
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
