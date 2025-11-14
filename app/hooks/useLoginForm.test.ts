// hooks/useLoginForm.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useLoginForm } from "./useLoginForm";
import { useAuth } from "@/app/contexts/AuthContext";

// mock useAuth
jest.mock("@/app/contexts/AuthContext", () => ({
  useAuth: () => ({
    setToken: jest.fn(),
  }),
}));

// mock router
const mockPush = jest.fn();
const mockRouter = { push: mockPush } as any;

// mock fetch
global.fetch = jest.fn();

describe("useLoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should set error if validation fails", async () => {
    const { result } = renderHook(() => useLoginForm({ router: mockRouter }));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as any);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });

  it("should login successfully and store token", async () => {
    const fakeToken = "fake.jwt.token";
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: fakeToken }),
    });

    const { result } = renderHook(() => useLoginForm({ router: mockRouter }));

    await act(async () => {
      result.current.setEmail("test@example.com");
      result.current.setPassword("password123");
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(localStorage.getItem("token")).toBe(fakeToken);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should set error if login fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    });

    const { result } = renderHook(() => useLoginForm({ router: mockRouter }));

    await act(async () => {
      result.current.setEmail("wrong@example.com");
      result.current.setPassword("badpass");
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(result.current.error).toBe("Invalid credentials");
    expect(localStorage.getItem("token")).toBeNull();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
