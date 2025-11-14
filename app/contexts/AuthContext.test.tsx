// __tests__/AuthContext.test.tsx
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import "@testing-library/jest-dom";

// mock useRouter จาก next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// สร้าง component สำหรับทดสอบการใช้ useAuth
const TestComponent = () => {
  const { token, userRole, isAuthenticated, setToken, logout } = useAuth();

  return (
    <div>
      <div data-testid="token">{token}</div>
      <div data-testid="role">{userRole}</div>
      <div data-testid="auth">{isAuthenticated ? "yes" : "no"}</div>
      <button onClick={() => setToken("fake.jwt.token")}>SetToken</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthProvider & useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should throw error if useAuth used outside provider", () => {
    const Broken = () => {
      expect(() => useAuth()).toThrow();
      return null;
    };
    render(<Broken />);
  });

  it("should provide default values", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId("token")).toHaveTextContent("");
    expect(screen.getByTestId("auth")).toHaveTextContent("no");
  });

  it("should set token and derive role from payload", () => {
    // สร้าง JWT ปลอมที่ payload มี role
    const payload = { role: "admin" };
    const fakeToken =
      "header." + btoa(JSON.stringify(payload)) + ".signature";

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("SetToken").click();
    });

    // setToken ถูกเรียกด้วย fake.jwt.token
    expect(screen.getByTestId("token")).toHaveTextContent("fake.jwt.token");

    // ลอง setToken ด้วย token ที่มี role จริง
    act(() => {
      const { setToken } = useAuth();
      setToken(fakeToken);
    });

    expect(screen.getByTestId("role")).toHaveTextContent("admin");
    expect(screen.getByTestId("auth")).toHaveTextContent("yes");
  });

  it("should logout and clear localStorage", () => {
    const { push } = require("next/navigation").useRouter();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Logout").click();
    });

    expect(screen.getByTestId("token")).toHaveTextContent("");
    expect(screen.getByTestId("auth")).toHaveTextContent("no");
    expect(push).toHaveBeenCalledWith("/login");
  });
});
