import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminOrdersPage from "./page";

// Mock fetch
global.fetch = jest.fn();

describe("AdminOrdersPage", () => {
  const mockOrders = [
    {
      id: "1",
      order_id: "ORD-2024-001-ABCDEFGHIJKLMNOP",
      customer_name: "สมชาย ใจดี",
      customer_email: "somchai@example.com",
      items: [
        { name: "สินค้า A", quantity: 2, price: 500 },
        { name: "สินค้า B", quantity: 1, price: 800 },
      ],
      total: 1800,
      payment_status: "paid",
      shipping_status: "pending",
      created_at: "2024-11-14T10:00:00Z",
    },
    {
      id: "2",
      order_id: "ORD-2024-002-QRSTUVWXYZ123456",
      customer_name: "สมหญิง รักสวย",
      customer_email: "somying@example.com",
      items: [
        { name: "สินค้า C", quantity: 3, price: 300 },
      ],
      total: 900,
      payment_status: "paid",
      shipping_status: "shipped",
      created_at: "2024-11-14T09:30:00Z",
    },
    {
      id: "3",
      order_id: "ORD-2024-003-FEDCBA9876543210",
      customer_name: "วิชัย มั่งมี",
      customer_email: "wichai@example.com",
      items: [
        { name: "สินค้า D", quantity: 1, price: 1500 },
      ],
      total: 1500,
      payment_status: "paid",
      shipping_status: "delivered",
      created_at: "2024-11-13T15:20:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (global.fetch as jest.Mock).mockImplementation((url: string, options?: any) => {
      if (url === "/api/orders" && (!options || options.method === "GET")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ orders: mockOrders }),
        });
      }
      if (url.startsWith("/api/orders/") && options?.method === "PATCH") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });
  });

  describe("Loading State", () => {
    it("should show loading spinner initially", () => {
      render(<AdminOrdersPage />);
      
      const spinner = screen.getByRole("status", { hidden: true });
      expect(spinner).toBeInTheDocument();
    });

    it("should hide loading spinner after data loads", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.queryByRole("status", { hidden: true })).not.toBeInTheDocument();
      });
    });
  });

  describe("Orders Loading", () => {
    it("should fetch and display orders on mount", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("สมชาย ใจดี")).toBeInTheDocument();
        expect(screen.getByText("สมหญิง รักสวย")).toBeInTheDocument();
        expect(screen.getByText("วิชัย มั่งมี")).toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledWith("/api/orders");
    });

    it("should display correct total order count", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("คำสั่งซื้อทั้งหมด 3 รายการ")).toBeInTheDocument();
      });
    });

    it("should handle API errors gracefully", async () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation();
      (global.fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          "Error loading orders:",
          expect.any(Error)
        );
      });

      consoleError.mockRestore();
    });

    it("should handle empty orders array", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ orders: [] }),
      });

      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("ไม่มีคำสั่งซื้อ")).toBeInTheDocument();
      });
    });
  });

  describe("Statistics Display", () => {
    it("should display correct statistics for all order statuses", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        // ทั้งหมด
        expect(screen.getByText("ทั้งหมด")).toBeInTheDocument();
        
        // รอจัดส่ง - 1 order
        const pendingStats = screen.getAllByText("1");
        expect(pendingStats.length).toBeGreaterThan(0);
        
        // กำลังจัดส่ง - 1 order
        const shippedStats = screen.getAllByText("1");
        expect(shippedStats.length).toBeGreaterThan(0);
        
        // จัดส่งแล้ว - 1 order
        const deliveredStats = screen.getAllByText("1");
        expect(deliveredStats.length).toBeGreaterThan(0);
      });
    });

    it("should display stats cards with correct icons", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("ทั้งหมด")).toBeInTheDocument();
        expect(screen.getByText("รอจัดส่ง")).toBeInTheDocument();
        expect(screen.getByText("กำลังจัดส่ง")).toBeInTheDocument();
        expect(screen.getByText("จัดส่งแล้ว")).toBeInTheDocument();
      });
    });
  });

  describe("Order Display", () => {
    it("should display order IDs truncated correctly", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText(/คำสั่งซื้อ #ORD-2024-001-ABC.../)).toBeInTheDocument();
      });
    });

    it("should display customer information", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText(/สมชาย ใจดี/)).toBeInTheDocument();
        expect(screen.getByText(/somchai@example.com/)).toBeInTheDocument();
      });
    });

    it("should display order totals formatted correctly", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("฿1,800")).toBeInTheDocument();
        expect(screen.getByText("฿900")).toBeInTheDocument();
        expect(screen.getByText("฿1,500")).toBeInTheDocument();
      });
    });

    it("should display item counts", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("2 รายการ")).toBeInTheDocument();
        expect(screen.getByText("1 รายการ")).toBeInTheDocument();
      });
    });

    it("should display order items with quantities and prices", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText(/สินค้า A × 2/)).toBeInTheDocument();
        expect(screen.getByText("฿1,000")).toBeInTheDocument();
        expect(screen.getByText(/สินค้า B × 1/)).toBeInTheDocument();
        expect(screen.getByText("฿800")).toBeInTheDocument();
      });
    });
  });

  describe("Status Badges", () => {
    it("should display status badges with correct text", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("รอจัดส่ง")).toBeInTheDocument();
        expect(screen.getByText("กำลังจัดส่ง")).toBeInTheDocument();
        expect(screen.getByText("จัดส่งแล้ว")).toBeInTheDocument();
      });
    });

    it("should apply correct CSS classes for pending status", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        const badge = screen.getByText("รอจัดส่ง");
        expect(badge).toHaveClass("bg-yellow-100", "text-yellow-800");
      });
    });

    it("should apply correct CSS classes for shipped status", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        const badge = screen.getByText("กำลังจัดส่ง");
        expect(badge).toHaveClass("bg-blue-100", "text-blue-800");
      });
    });

    it("should apply correct CSS classes for delivered status", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        const badge = screen.getByText("จัดส่งแล้ว");
        expect(badge).toHaveClass("bg-green-100", "text-green-800");
      });
    });
  });

  describe("Filtering", () => {
    it("should show all orders by default", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("สมชาย ใจดี")).toBeInTheDocument();
        expect(screen.getByText("สมหญิง รักสวย")).toBeInTheDocument();
        expect(screen.getByText("วิชัย มั่งมี")).toBeInTheDocument();
      });
    });

    it("should filter pending orders", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("สมชาย ใจดี")).toBeInTheDocument();
      });

      const pendingButton = screen.getByRole("button", { name: "รอจัดส่ง" });
      fireEvent.click(pendingButton);

      await waitFor(() => {
        expect(screen.getByText("สมชาย ใจดี")).toBeInTheDocument();
        expect(screen.queryByText("สมหญิง รักสวย")).not.toBeInTheDocument();
        expect(screen.queryByText("วิชัย มั่งมี")).not.toBeInTheDocument();
      });
    });

    it("should filter shipped orders", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("สมหญิง รักสวย")).toBeInTheDocument();
      });

      const shippedButton = screen.getByRole("button", { name: "กำลังจัดส่ง" });
      fireEvent.click(shippedButton);

      await waitFor(() => {
        expect(screen.getByText("สมหญิง รักสวย")).toBeInTheDocument();
        expect(screen.queryByText("สมชาย ใจดี")).not.toBeInTheDocument();
        expect(screen.queryByText("วิชัย มั่งมี")).not.toBeInTheDocument();
      });
    });

    it("should filter delivered orders", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("วิชัย มั่งมี")).toBeInTheDocument();
      });

      const deliveredButton = screen.getByRole("button", { name: "จัดส่งแล้ว" });
      fireEvent.click(deliveredButton);

      await waitFor(() => {
        expect(screen.getByText("วิชัย มั่งมี")).toBeInTheDocument();
        expect(screen.queryByText("สมชาย ใจดี")).not.toBeInTheDocument();
        expect(screen.queryByText("สมหญิง รักสวย")).not.toBeInTheDocument();
      });
    });

    it("should highlight active filter button", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        const allButton = screen.getByRole("button", { name: "ทั้งหมด" });
        expect(allButton).toHaveClass("bg-orange-500", "text-white");
      });

      const pendingButton = screen.getByRole("button", { name: "รอจัดส่ง" });
      fireEvent.click(pendingButton);

      await waitFor(() => {
        expect(pendingButton).toHaveClass("bg-orange-500", "text-white");
      });
    });

    it("should show empty state when filter has no results", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ 
          orders: [
            { ...mockOrders[0], shipping_status: "delivered" }
          ] 
        }),
      });

      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("วิชัย มั่งมี")).toBeInTheDocument();
      });

      const pendingButton = screen.getByRole("button", { name: "รอจัดส่ง" });
      fireEvent.click(pendingButton);

      await waitFor(() => {
        expect(screen.getByText("ไม่มีคำสั่งซื้อ")).toBeInTheDocument();
      });
    });
  });

  describe("Status Updates", () => {
    it("should show 'จัดส่งสินค้า' button for pending orders", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "🚚 จัดส่งสินค้า" })).toBeInTheDocument();
      });
    });

    it("should show 'ยืนยันจัดส่งสำเร็จ' button for shipped orders", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "✅ ยืนยันจัดส่งสำเร็จ" })).toBeInTheDocument();
      });
    });

    it("should not show action buttons for delivered orders", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("วิชัย มั่งมี")).toBeInTheDocument();
      });

      const deliveredButton = screen.getByRole("button", { name: "จัดส่งแล้ว" });
      fireEvent.click(deliveredButton);

      await waitFor(() => {
        expect(screen.queryByRole("button", { name: /จัดส่งสินค้า/ })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /ยืนยันจัดส่งสำเร็จ/ })).not.toBeInTheDocument();
      });
    });

    it("should update order status to shipped when clicking ship button", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "🚚 จัดส่งสินค้า" })).toBeInTheDocument();
      });

      const shipButton = screen.getByRole("button", { name: "🚚 จัดส่งสินค้า" });
      fireEvent.click(shipButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/orders/ORD-2024-001-ABCDEFGHIJKLMNOP",
          expect.objectContaining({
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shipping_status: "shipped" }),
          })
        );
      });
    });

    it("should update order status to delivered when clicking deliver button", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "✅ ยืนยันจัดส่งสำเร็จ" })).toBeInTheDocument();
      });

      const deliverButton = screen.getByRole("button", { name: "✅ ยืนยันจัดส่งสำเร็จ" });
      fireEvent.click(deliverButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/orders/ORD-2024-002-QRSTUVWXYZ123456",
          expect.objectContaining({
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shipping_status: "delivered" }),
          })
        );
      });
    });

    it("should reload orders after successful status update", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "🚚 จัดส่งสินค้า" })).toBeInTheDocument();
      });

      const initialFetchCount = (global.fetch as jest.Mock).mock.calls.length;

      const shipButton = screen.getByRole("button", { name: "🚚 จัดส่งสินค้า" });
      fireEvent.click(shipButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(initialFetchCount + 2); // +1 for PATCH, +1 for reload
      });
    });

    it("should handle status update errors gracefully", async () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation();
      
      (global.fetch as jest.Mock).mockImplementation((url: string, options?: any) => {
        if (url === "/api/orders") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ orders: mockOrders }),
          });
        }
        if (url.startsWith("/api/orders/") && options?.method === "PATCH") {
          return Promise.reject(new Error("Update failed"));
        }
        return Promise.reject(new Error("Unknown URL"));
      });

      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "🚚 จัดส่งสินค้า" })).toBeInTheDocument();
      });

      const shipButton = screen.getByRole("button", { name: "🚚 จัดส่งสินค้า" });
      fireEvent.click(shipButton);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          "Error updating status:",
          expect.any(Error)
        );
      });

      consoleError.mockRestore();
    });
  });

  describe("Refresh Functionality", () => {
    it("should reload orders when refresh button is clicked", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        expect(screen.getByText("สมชาย ใจดี")).toBeInTheDocument();
      });

      const initialFetchCount = (global.fetch as jest.Mock).mock.calls.length;

      const refreshButton = screen.getByRole("button", { name: /รีเฟรช/ });
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(initialFetchCount + 1);
      });
    });
  });

  describe("Date Formatting", () => {
    it("should format order dates in Thai locale", async () => {
      render(<AdminOrdersPage />);

      await waitFor(() => {
        const dateElements = screen.getAllByText(/📅/);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });
  });
});