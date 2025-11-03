import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import mockProducts from "../libs/products";

type SuggestionItem = {
  text: string;
  type: "name" | "tag";
  score: number;
};

export const useSuggestion = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 1) {
        const fuse = new Fuse(mockProducts, {
          keys: ["name", "tags"],
          threshold: 0.6,
          includeScore: true,
          minMatchCharLength: 2,
          distance: 1000,
        });

        const results = fuse.search(query);

        // กรองเฉพาะที่ score ต่ำพอ (match ดี)
        const filtered = results.filter(
          (r) => r.score !== undefined && r.score < 0.5
        );

        // แปลงเป็น SuggestionItem[]
        const raw: SuggestionItem[] = filtered.flatMap((r) => {
          const nameMatch: SuggestionItem = {
            text: r.item.name,
            type: "name",
            score: r.score ?? 0.4,
          };

          const tagMatches: SuggestionItem[] = Array.isArray(r.item.tags)
            ? r.item.tags.map((tag) => ({
                text: tag,
                type: "tag",
                score: r.score ?? 0.4,
              }))
            : [];

          return [nameMatch, ...tagMatches];
        });

        // ลบคำซ้ำแบบฉลาด โดยใช้ score ต่ำสุด
        const dedupedMap = new Map<string, SuggestionItem>();
        for (const item of raw) {
          const key = item.text.toLowerCase();
          if (!dedupedMap.has(key) || item.score < dedupedMap.get(key)!.score) {
            dedupedMap.set(key, item);
          }
        }

        // ✅ เรียงตาม score จากน้อยไปมาก (แม่นที่สุดอยู่บนสุด)
        const ranked = Array.from(dedupedMap.values()).sort(
          (a, b) => a.score - b.score
        );

        setSuggestions(ranked.slice(0, 6));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return { query, setQuery, suggestions };
};
