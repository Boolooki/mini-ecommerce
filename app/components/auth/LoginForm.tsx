"use client";

import { useLoginForm } from "@/app/hooks/useLoginForm";
import { useRouter } from "next/navigation";


export default function LoginForm() {
  const router = useRouter();
  
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useLoginForm({ router });

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6 border border-orange-200"
    >
      <h2 className="text-3xl font-bold text-center text-orange-600">
        เข้าสู่ระบบ
      </h2>

      <div>
        <label className="block text-sm font-medium text-orange-700">
          อีเมล
        </label>
        <input
          type="email"
          autoFocus
          className="w-full border border-orange-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-orange-700">
          รหัสผ่าน
        </label>
        <input
          type="password"
          className="w-full border border-orange-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors duration-200"
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <p className="text-center text-sm text-gray-500">
        ยังไม่มีบัญชี?{" "}
        <a href="/signup" className="text-orange-600 hover:underline">
          สมัครสมาชิก
        </a>
      </p>
    </form>
  );
}
