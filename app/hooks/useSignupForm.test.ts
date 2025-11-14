// hooks/useSignupForm.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useSignupForm } from "./useSignupForm";

// mock useRouter จาก next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// mock fetch
global.fetch = jest.fn();

describe("useSignupForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with empty fields", () => {
    const { result } = renderHook(() => useSignupForm());
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.name).toBe("");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
  });

  it("should signup successfully and redirect", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useSignupForm());

    await act(async () => {
      result.current.setEmail("test@example.com");
      result.current.setPassword("password123");
      result.current.setName("Tester");
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(mockPush).toHaveBeenCalledWith("/login");
    expect(result.current.error).toBe("");
    expect(result.current.loading).toBe(false);
  });

  it("should set error if signup fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email already exists" }),
    });

    const { result } = renderHook(() => useSignupForm());

    await act(async () => {
      result.current.setEmail("duplicate@example.com");
      result.current.setPassword("password123");
      result.current.setName("Dup");
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(result.current.error).toBe("Email already exists");
    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("should handle network error gracefully", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useSignupForm());

    await act(async () => {
      result.current.setEmail("net@example.com");
      result.current.setPassword("pass");
      result.current.setName("Net");
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(result.current.error).toBe("Network error");
    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });
});
