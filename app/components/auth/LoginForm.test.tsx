import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "./LoginForm";

// mock useLoginForm
jest.mock("@/app/hooks/useLoginForm", () => ({
  useLoginForm: () => ({
    email: "test@example.com",
    setEmail: jest.fn(),
    password: "password123",
    setPassword: jest.fn(),
    loading: false,
    error: "Invalid credentials",
    handleSubmit: jest.fn((e) => e.preventDefault()),
  }),
}));

describe("LoginForm", () => {
  it("renders form fields and error message", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("อีเมล")).toBeInTheDocument();
    expect(screen.getByLabelText("รหัสผ่าน")).toBeInTheDocument();
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("renders submit button with correct text", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: "เข้าสู่ระบบ" })).toBeInTheDocument();
  });

  it("calls handleSubmit on form submit", () => {
    const { useLoginForm } = require("@/app/hooks/useLoginForm");
    render(<LoginForm />);
    fireEvent.submit(screen.getByRole("form"));
    expect(useLoginForm().handleSubmit).toHaveBeenCalled();
  });
});
