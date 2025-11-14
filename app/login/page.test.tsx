import { render, screen } from "@testing-library/react";
import LoginPage from "./page";

// Mock LoginForm component เพื่อไม่ต้องทดสอบ logic ภายใน
jest.mock("../components/auth/LoginForm", () => () => (
  <div data-testid="login-form">Mocked LoginForm</div>
));

describe("LoginPage", () => {
  it("should render the main container with correct classes", () => {
    render(<LoginPage />);
    const main = screen.getByRole("main");
    expect(main).toHaveClass("min-h-[50vh]");
    expect(main).toHaveClass("flex");
    expect(main).toHaveClass("items-center");
    expect(main).toHaveClass("justify-center");
    expect(main).toHaveClass("bg-gray-100");
  });

  it("should render the LoginForm component", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByText("Mocked LoginForm")).toBeInTheDocument();
  });
});
