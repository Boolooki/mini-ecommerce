import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminDashboardPage from "./page";
import { useAuth } from "../contexts/AuthContext";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/link", () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe("AdminDashboardPage", () => {
  const mockStats = {
    totalSales: 150000,
    totalOrders: 45,
    totalProducts: 120,
    pendingOrders: 8,
    shippedOrders: 12,
    deliveredOrders: 25,
    todaySales: 5000,
    monthlySales: 75000,
  };

  const mockRecentOrders = [
    {
      id: "1",
      order_id: "ORD-2024-001-ABCDEFGHIJKLMNOP",
      customer_name: "สมชาย ใจดี",
      customer_email: "somchai@example.com",
      total: 1500,
      shipping_status: "pending",
      created_at: "2024-11-14T10:00:00Z",
    },
    {
      id: "2",
      order_id: "ORD-2024-002-QRSTUVWXYZ123456",
      customer_name: "สมหญิง รักสวย",
      customer_email: "somying@example.com",
      total: 2800,
      shipping_status: "shipped",
      created_at: "2024-11-14T09:30:00Z",
    },
    {
      id: "3",
      order_id: "ORD-2024-003-FEDCBA9876543210",
      customer_name: "วิชัย มั่งมี",
      customer_email: "wichai@example.com",
      total: 950,
      shipping_status: "delivered",
      created_at: "2024-11-13T15:20:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ userRole: "admin" });
    
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === "/api/admin/stats") {
        return Promise.resolve({
          json: () => Promise.resolve({ stats: mockStats }),
        });
      }
      if (url === "/api/admin/recent-orders") {
        return Promise.resolve({
          json: () => Promise.resolve({ orders: mockRecentOrders }),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });
  });

  describe("Authorization", () => {
    it("should redirect to home if user is not admin", () => {
      const mockPush = jest.fn();
      delete (window as any).location;
      (window as any).location = { href: "" };

      (useAuth as jest.Mock).mockReturnValue({ userRole: "user" });

      render(<AdminDashboardPage />);

      expect(window.location.href).toBe("/");
    });

    it("should render dashboard for admin users", async () => {
      (useAuth as jest.Mock).mockReturnValue({ userRole: "admin" });

      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("แดชบอร์ดผู้ดูแลระบบ")).toBeInTheDocument();
      });
    });
  });

  describe("Loading State", () => {
    it("should show loading spinner initially", () => {
      render(<AdminDashboardPage />);

      expect(screen.getByRole("status", { hidden: true })).toBeInTheDocument();
    });
  });

  describe("Dashboard Data Loading", () => {
    it("should fetch and display stats correctly", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("ยอดขายทั้งหมด")).toBeInTheDocument();
        expect(screen.getByText("฿150,000")).toBeInTheDocument();
        expect(screen.getByText("45")).toBeInTheDocument();
        expect(screen.getByText("120")).toBeInTheDocument();
        expect(screen.getByText("8")).toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledWith("/api/admin/stats");
      expect(global.fetch).toHaveBeenCalledWith("/api/admin/recent-orders");
    });

    it("should display secondary stats", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("ยอดขายวันนี้")).toBeInTheDocument();
        expect(screen.getByText("฿5,000")).toBeInTheDocument();
        expect(screen.getByText("ยอดขายเดือนนี้")).toBeInTheDocument();
        expect(screen.getByText("฿75,000")).toBeInTheDocument();
      });
    });

    it("should display delivery progress stats", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("สถานะการจัดส่ง")).toBeInTheDocument();
        expect(screen.getByText("กำลังจัดส่ง")).toBeInTheDocument();
        expect(screen.getByText("12")).toBeInTheDocument();
        expect(screen.getByText("จัดส่งแล้ว")).toBeInTheDocument();
        expect(screen.getByText("25")).toBeInTheDocument();
      });
    });

    it("should handle API errors gracefully", async () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation();
      (global.fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          "Error loading dashboard:",
          expect.any(Error)
        );
      });

      consoleError.mockRestore();
    });
  });

  describe("Recent Orders Display", () => {
    it("should display recent orders correctly", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("คำสั่งซื้อล่าสุด")).toBeInTheDocument();
        expect(screen.getByText("สมชาย ใจดี")).toBeInTheDocument();
        expect(screen.getByText("สมหญิง รักสวย")).toBeInTheDocument();
        expect(screen.getByText("วิชัย มั่งมี")).toBeInTheDocument();
      });
    });

    it("should display order IDs truncated correctly", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/#ORD-2024-001-ABC.../)).toBeInTheDocument();
      });
    });

    it("should display order status badges with correct styling", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        const pendingBadge = screen.getByText("รอจัดส่ง");
        expect(pendingBadge).toHaveClass("bg-yellow-100", "text-yellow-800");

        const shippedBadge = screen.getByText("กำลังจัดส่ง");
        expect(shippedBadge).toHaveClass("bg-blue-100", "text-blue-800");

        const deliveredBadge = screen.getByText("จัดส่งแล้ว");
        expect(deliveredBadge).toHaveClass("bg-green-100", "text-green-800");
      });
    });

    it("should display order totals formatted correctly", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("฿1,500")).toBeInTheDocument();
        expect(screen.getByText("฿2,800")).toBeInTheDocument();
        expect(screen.getByText("฿950")).toBeInTheDocument();
      });
    });

    it("should show empty state when no orders exist", async () => {
      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url === "/api/admin/stats") {
          return Promise.resolve({
            json: () => Promise.resolve({ stats: mockStats }),
          });
        }
        if (url === "/api/admin/recent-orders") {
          return Promise.resolve({
            json: () => Promise.resolve({ orders: [] }),
          });
        }
        return Promise.reject(new Error("Unknown URL"));
      });

      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("ยังไม่มีคำสั่งซื้อ")).toBeInTheDocument();
      });
    });
  });

  describe("Refresh Functionality", () => {
    it("should reload data when refresh button is clicked", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("แดชบอร์ดผู้ดูแลระบบ")).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole("button", { name: /รีเฟรช/i });
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(4); // 2 initial + 2 refresh
      });
    });
  });

  describe("Navigation Links", () => {
    it("should render all quick action links", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("จัดการคำสั่งซื้อ")).toBeInTheDocument();
        expect(screen.getByText("จัดการสินค้า")).toBeInTheDocument();
        expect(screen.getByText("รายงานยอดขาย")).toBeInTheDocument();
      });
    });

    it("should have correct href for navigation links", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        const ordersLink = screen.getByText("จัดการคำสั่งซื้อ").closest("a");
        const productsLink = screen.getByText("จัดการสินค้า").closest("a");
        const customersLink = screen.getByText("รายงานยอดขาย").closest("a");

        expect(ordersLink).toHaveAttribute("href", "/admin/orders");
        expect(productsLink).toHaveAttribute("href", "/admin/products");
        expect(customersLink).toHaveAttribute("href", "/admin/customers");
      });
    });

    it("should have 'ดูทั้งหมด' link to orders page", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        const viewAllLink = screen.getByText("ดูทั้งหมด →").closest("a");
        expect(viewAllLink).toHaveAttribute("href", "/admin/orders");
      });
    });
  });

  describe("Date Formatting", () => {
    it("should format order dates correctly in Thai locale", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        const dateElements = screen.getAllByText(/📅/);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Responsive Layout", () => {
    it("should render all main stat cards", async () => {
      render(<AdminDashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("ยอดขายทั้งหมด")).toBeInTheDocument();
        expect(screen.getByText("คำสั่งซื้อทั้งหมด")).toBeInTheDocument();
        expect(screen.getByText("รอจัดส่ง")).toBeInTheDocument();
        expect(screen.getByText("สินค้าทั้งหมด")).toBeInTheDocument();
      });
    });
  });
});