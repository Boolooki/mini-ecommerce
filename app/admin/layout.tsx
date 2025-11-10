export default function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/products">Manage Products</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
