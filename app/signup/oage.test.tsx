import { render, screen } from "@testing-library/react";
import SignupPage from "./page";

// Mock SignupForm component เพื่อไม่ต้องทดสอบ logic ภายใน
jest.mock("@/app/components/auth/SignupForm", () => () => (
  <div data-testid="signup-form">Mocked SignupForm</div>
));

describe("SignupPage", () => {
  it("should render the main container with correct classes", () => {
    render(<SignupPage />);
    const main = screen.getByRole("main");
    expect(main).toHaveClass("min-h-[50vh]");
    expect(main).toHaveClass("flex");
    expect(main).toHaveClass("items-center");
    expect(main).toHaveClass("justify-center");
    expect(main).toHaveClass("bg-gray-100");
  });

  it("should render the SignupForm component", () => {
    render(<SignupPage />);
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
    expect(screen.getByText("Mocked SignupForm")).toBeInTheDocument();
  });
});
