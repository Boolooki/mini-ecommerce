import { render, screen } from "@testing-library/react";
import DashboardSummary from "./DashboardSummary";

describe("DashboardSummary", () => {
  it("renders sales, orders, and products correctly", () => {
    render(<DashboardSummary />);

    // ตรวจสอบหัวข้อ
    expect(screen.getByText("Total Sales")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();

    // ตรวจสอบค่าที่แสดง
    expect(screen.getByText("฿128,900")).toBeInTheDocument();
    expect(screen.getByText("342")).toBeInTheDocument();
    expect(screen.getByText("58")).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(<DashboardSummary />);
    const salesBox = screen.getByText("Total Sales").closest("div");
    expect(salesBox).toHaveClass("bg-white", "shadow", "p-4", "rounded");
  });
});
