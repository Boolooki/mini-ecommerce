//app/components/admin/DashboardSummary.tsx
export default function DashboardSummary() {
  // mock data — later fetch from Supabase
  const stats = {
    totalSales: 128900,
    totalOrders: 342,
    totalProducts: 58,
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Total Sales</h2>
        <p className="text-2xl font-bold text-green-600">฿{stats.totalSales.toLocaleString()}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Orders</h2>
        <p className="text-2xl font-bold">{stats.totalOrders}</p>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold">Products</h2>
        <p className="text-2xl font-bold">{stats.totalProducts}</p>
      </div>
    </div>
  );
}
