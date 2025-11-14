// components/products/StarFilter.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import StarFilter from "./StarFilter";

describe("StarFilter", () => {
  const setup = (selectedRating: number | null = null) => {
    const updateRating = jest.fn();
    const clearRating = jest.fn();

    render(
      <StarFilter
        selectedRating={selectedRating}
        updateRating={updateRating}
        clearRating={clearRating}
      />
    );

    return { updateRating, clearRating };
  };

  it("renders heading correctly", () => {
    setup();
    expect(screen.getByText("คะแนนรีวิว")).toBeInTheDocument();
  });

  it("renders all rating options", () => {
    setup();
    expect(screen.getByLabelText("5 ดาวเท่านั้น")).toBeInTheDocument();
    expect(screen.getByLabelText("4 ดาวขึ้นไป")).toBeInTheDocument();
    expect(screen.getByLabelText("3 ดาวขึ้นไป")).toBeInTheDocument();
    expect(screen.getByLabelText("2 ดาวขึ้นไป")).toBeInTheDocument();
    expect(screen.getByLabelText("1 ดาวขึ้นไป")).toBeInTheDocument();
  });

  it("calls updateRating when a rating is selected", () => {
    const { updateRating } = setup();
    const radio = screen.getByLabelText("4 ดาวขึ้นไป");
    fireEvent.click(radio);
    expect(updateRating).toHaveBeenCalledWith(4);
  });

  it("shows clear button when selectedRating is not null", () => {
    const { clearRating } = setup(3);
    const clearBtn = screen.getByText("ล้าง");
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(clearRating).toHaveBeenCalled();
  });

  it("does not show clear button when selectedRating is null", () => {
    setup(null);
    expect(screen.queryByText("ล้าง")).not.toBeInTheDocument();
  });

  it("marks the correct radio as checked when selectedRating is set", () => {
    setup(5);
    const radio = screen.getByLabelText("5 ดาวเท่านั้น") as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });
});
