// components/products/TagFilter.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import TagFilter from "./TagFilter";

describe("TagFilter", () => {
  const tags = ["Electronics", "Fashion", "Books", "Sports", "Toys"];

  const setup = (selectedTags: string[] = [], showAll = false) => {
    const toggleTag = jest.fn();
    const toggleShowAll = jest.fn();

    render(
      <TagFilter
        visibleTags={tags.slice(0, 3)}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        showAll={showAll}
        toggleShowAll={toggleShowAll}
        totalTagCount={tags.length}
      />
    );

    return { toggleTag, toggleShowAll };
  };

  it("renders heading correctly", () => {
    setup();
    expect(screen.getByText("หมวดหมู่สินค้า")).toBeInTheDocument();
  });

  it("renders visible tags as checkboxes", () => {
    setup();
    expect(screen.getByLabelText("Electronics")).toBeInTheDocument();
    expect(screen.getByLabelText("Fashion")).toBeInTheDocument();
    expect(screen.getByLabelText("Books")).toBeInTheDocument();
    // ไม่ควรเห็น tag ที่อยู่นอก visibleTags
    expect(screen.queryByLabelText("Sports")).not.toBeInTheDocument();
  });

  it("calls toggleTag when a tag checkbox is clicked", () => {
    const { toggleTag } = setup();
    const checkbox = screen.getByLabelText("Electronics");
    fireEvent.click(checkbox);
    expect(toggleTag).toHaveBeenCalledWith("Electronics");
  });

  it("shows clear button when selectedTags is not empty", () => {
    const { toggleTag } = setup(["Fashion"]);
    const clearBtn = screen.getByText("ล้างทั้งหมด");
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    // ควรเรียก toggleTag สำหรับทุก tag ที่เลือก
    expect(toggleTag).toHaveBeenCalledWith("Fashion");
  });

  it("does not show clear button when selectedTags is empty", () => {
    setup([]);
    expect(screen.queryByText("ล้างทั้งหมด")).not.toBeInTheDocument();
  });

  it("shows 'ดูเพิ่มเติม' button when totalTagCount > visibleTags.length", () => {
    const { toggleShowAll } = setup([], false);
    const showMoreBtn = screen.getByText(/ดูเพิ่มเติม/);
    expect(showMoreBtn).toBeInTheDocument();

    fireEvent.click(showMoreBtn);
    expect(toggleShowAll).toHaveBeenCalled();
  });

  it("shows 'แสดงน้อยลง' button when showAll is true", () => {
    setup([], true);
    expect(screen.getByText("แสดงน้อยลง ↑")).toBeInTheDocument();
  });
});
