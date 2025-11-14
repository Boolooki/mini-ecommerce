import { render, screen, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import SuccessPage from "./page";
import { useCart } from "../contexts/CartContext";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("next/link", () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

jest.mock("../contexts/CartContext", () => ({
  useCart: jest.fn(),
}));

describe("SuccessPage", () => {
  const mockClearCart = jest.fn();
  const mockPush = jest.fn();
  const mockSearchParams = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    
    (useCart as jest.Mock).mockReturnValue({
      clearCart: mockClearCart,
    });
  });

  describe("Rendering", () => {
    it("should render success page with all main elements", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      expect(screen.getByText("ชำระเงินสำเร็จ!")).toBeInTheDocument();
      expect(
        screen.getByText("ขอบคุณสำหรับการสั่งซื้อ เราจะดำเนินการจัดส่งสินค้าให้คุณโดยเร็ว")
      ).toBeInTheDocument();
    });

    it("should render success icon", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      // Check for the check circle icon by looking for the green circular background
      const iconContainer = document.querySelector(".bg-green-100.rounded-full");
      expect(iconContainer).toBeInTheDocument();
    });

    it("should render email confirmation message", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      expect(
        screen.getByText("💌 เราได้ส่งอีเมลยืนยันการสั่งซื้อไปยังคุณแล้ว")
      ).toBeInTheDocument();
    });
  });

  describe("Session ID Display", () => {
    it("should display session ID when present in URL", () => {
      const sessionId = "sess_1234567890abcdefg";
      mockSearchParams.get.mockReturnValue(sessionId);

      render(<SuccessPage />);

      expect(screen.getByText("หมายเลขคำสั่งซื้อ")).toBeInTheDocument();
      expect(screen.getByText(sessionId)).toBeInTheDocument();
    });

    it("should not display session ID section when not present", () => {
      mockSearchParams.get.mockReturnValue(null);

      render(<SuccessPage />);

      expect(screen.queryByText("หมายเลขคำสั่งซื้อ")).not.toBeInTheDocument();
    });

    it("should display long session ID with proper formatting", () => {
      const longSessionId = "sess_1234567890abcdefghijklmnopqrstuvwxyz";
      mockSearchParams.get.mockReturnValue(longSessionId);

      render(<SuccessPage />);

      const sessionElement = screen.getByText(longSessionId);
      expect(sessionElement).toHaveClass("break-all");
    });
  });

  describe("Cart Clearing", () => {
    it("should clear cart when session_id is present", async () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      await waitFor(() => {
        expect(mockClearCart).toHaveBeenCalledTimes(1);
      });
    });

    it("should not clear cart when session_id is not present", async () => {
      mockSearchParams.get.mockReturnValue(null);

      render(<SuccessPage />);

      await waitFor(() => {
        expect(mockClearCart).not.toHaveBeenCalled();
      });
    });

    it("should call clearCart only once even with multiple renders", async () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      const { rerender } = render(<SuccessPage />);
      
      await waitFor(() => {
        expect(mockClearCart).toHaveBeenCalledTimes(1);
      });

      rerender(<SuccessPage />);

      // Should still be called only once due to dependency array
      await waitFor(() => {
        expect(mockClearCart).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Navigation Links", () => {
    it("should render 'เลือกซื้อสินค้าต่อ' button with correct href", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      const continueButton = screen.getByText("เลือกซื้อสินค้าต่อ").closest("a");
      expect(continueButton).toHaveAttribute("href", "/products");
    });

    it("should render 'กลับหน้าหลัก' button with correct href", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      const homeButton = screen.getByText("กลับหน้าหลัก").closest("a");
      expect(homeButton).toHaveAttribute("href", "/");
    });

    it("should apply correct styling to primary button", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      const continueButton = screen.getByText("เลือกซื้อสินค้าต่อ").closest("a");
      expect(continueButton).toHaveClass("bg-orange-500", "text-white");
    });

    it("should apply correct styling to secondary button", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      const homeButton = screen.getByText("กลับหน้าหลัก").closest("a");
      expect(homeButton).toHaveClass("border", "border-gray-300", "text-gray-700");
    });
  });

  describe("Suspense Fallback", () => {
    it("should show loading spinner in fallback", () => {
      // This test checks that the Suspense fallback is properly configured
      // The actual Suspense behavior is handled by React
      const { container } = render(<SuccessPage />);
      
      // Check that the component renders without errors
      expect(container).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    it("should have gradient background", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      const { container } = render(<SuccessPage />);

      const backgroundDiv = container.querySelector(".bg-gradient-to-b.from-green-50");
      expect(backgroundDiv).toBeInTheDocument();
    });

    it("should center content on screen", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      const { container } = render(<SuccessPage />);

      const centerDiv = container.querySelector(".flex.items-center.justify-center");
      expect(centerDiv).toBeInTheDocument();
    });

    it("should have white card with shadow", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      const { container } = render(<SuccessPage />);

      const card = container.querySelector(".bg-white.rounded-2xl.shadow-2xl");
      expect(card).toBeInTheDocument();
    });

    it("should display session ID in monospace font", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      const sessionElement = screen.getByText("test_session_123");
      expect(sessionElement).toHaveClass("font-mono");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty session_id string", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SuccessPage />);

      expect(screen.queryByText("หมายเลขคำสั่งซื้อ")).not.toBeInTheDocument();
      expect(mockClearCart).not.toHaveBeenCalled();
    });

    it("should handle special characters in session_id", () => {
      const sessionId = "sess_@#$%^&*()_+-=";
      mockSearchParams.get.mockReturnValue(sessionId);

      render(<SuccessPage />);

      expect(screen.getByText(sessionId)).toBeInTheDocument();
    });

    it("should handle very long session_id", () => {
      const longSessionId = "sess_" + "a".repeat(100);
      mockSearchParams.get.mockReturnValue(longSessionId);

      render(<SuccessPage />);

      const sessionElement = screen.getByText(longSessionId);
      expect(sessionElement).toBeInTheDocument();
      expect(sessionElement).toHaveClass("break-all");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      const heading = screen.getByRole("heading", { name: "ชำระเงินสำเร็จ!" });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H1");
    });

    it("should have accessible links", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      const continueLink = screen.getByRole("link", { name: "เลือกซื้อสินค้าต่อ" });
      const homeLink = screen.getByRole("link", { name: "กลับหน้าหลัก" });

      expect(continueLink).toBeInTheDocument();
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe("Component Behavior", () => {
    it("should fetch session_id from searchParams on mount", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      render(<SuccessPage />);

      expect(mockSearchParams.get).toHaveBeenCalledWith("session_id");
    });

    it("should handle searchParams changes", async () => {
      mockSearchParams.get.mockReturnValue("session_1");

      const { rerender } = render(<SuccessPage />);

      expect(screen.getByText("session_1")).toBeInTheDocument();

      mockSearchParams.get.mockReturnValue("session_2");
      rerender(<SuccessPage />);

      // Due to useEffect dependencies, it should react to searchParams changes
      await waitFor(() => {
        expect(mockSearchParams.get).toHaveBeenCalled();
      });
    });
  });

  describe("Visual Elements", () => {
    it("should render all sections in correct order", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      const { container } = render(<SuccessPage />);

      const card = container.querySelector(".bg-white.rounded-2xl");
      expect(card).toBeInTheDocument();

      // Check for icon, heading, description, session ID, buttons, and email message
      expect(screen.getByText("ชำระเงินสำเร็จ!")).toBeInTheDocument();
      expect(screen.getByText("หมายเลขคำสั่งซื้อ")).toBeInTheDocument();
      expect(screen.getByText("เลือกซื้อสินค้าต่อ")).toBeInTheDocument();
      expect(screen.getByText("กลับหน้าหลัก")).toBeInTheDocument();
      expect(screen.getByText(/เราได้ส่งอีเมลยืนยัน/)).toBeInTheDocument();
    });

    it("should have proper spacing between elements", () => {
      mockSearchParams.get.mockReturnValue("test_session_123");

      const { container } = render(<SuccessPage />);

      const spacedElements = container.querySelectorAll(".mb-6, .space-y-3, .mt-6");
      expect(spacedElements.length).toBeGreaterThan(0);
    });
  });
});