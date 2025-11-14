import { render, screen, fireEvent } from "@testing-library/react";
import SignupForm from "./SignupForm";

// mock useSignupForm
jest.mock("@/app/hooks/useSignupForm", () => ({
  useSignupForm: () => ({
    email: "",
    setEmail: jest.fn(),
    password: "",
    setPassword: jest.fn(),
    name: "",
    setName: jest.fn(),
    loading: false,
    error: "Signup failed",
    handleSubmit: jest.fn((e) => e.preventDefault()),
  }),
}));

describe("SignupForm", () => {
  it("renders form fields and error message", () => {
    render(<SignupForm />);
    expect(screen.getByLabelText("ชื่อ")).toBeInTheDocument();
    expect(screen.getByLabelText("อีเมล")).toBeInTheDocument();
    expect(screen.getByLabelText("รหัสผ่าน")).toBeInTheDocument();
    expect(screen.getByText("Signup failed")).toBeInTheDocument();
  });

  it("renders submit button with correct text", () => {
    render(<SignupForm />);
    expect(screen.getByRole("button", { name: "สมัครสมาชิก" })).toBeInTheDocument();
  });

  it("calls handleSubmit on form submit", () => {
    const { useSignupForm } = require("@/app/hooks/useSignupForm");
    render(<SignupForm />);
    fireEvent.submit(screen.getByRole("form"));
    expect(useSignupForm().handleSubmit).toHaveBeenCalled();
  });
});
