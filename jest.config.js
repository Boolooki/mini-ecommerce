const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./", // path ไปยัง Next.js app
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // Handle module aliases (ตาม tsconfig.json)
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jest-environment-jsdom", // สำหรับ DOM testing
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Test Report",
        outputPath: "test-report.html", // ไฟล์ที่จะถูกสร้าง
        includeFailureMsg: true, // แสดงข้อความ error ใน report
        includeConsoleLog: true, // แสดง console.log ใน report
      },
    ],
  ],
};

// ให้ next/jest โหลด config แบบ async
module.exports = createJestConfig(customJestConfig);
