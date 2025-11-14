// components/products/PriceFilter.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import PriceFilter from "./PriceFilter";

describe("PriceFilter", () => {
  const setup = (minPrice = 1000, maxPrice = 5000) => {
    const setMinPrice = jest.fn();
    const setMaxPrice = jest.fn();

    render(
      <PriceFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
      />
    );

    return { setMinPrice, setMaxPrice };
  };

  it("renders headings and price range correctly", () => {
    setup(1000, 5000);
    expect(screen.getByText("ช่วงราคา")).toBeInTheDocument();
    expect(screen.getByText("฿1,000")).toBeInTheDocument();
    expect(screen.getByText("฿5,000")).toBeInTheDocument();
  });

  it("calls setMinPrice when min slider changes", () => {
    const { setMinPrice } = setup(1000, 5000);
    const slider = screen.getByLabelText(/ราคาต่ำสุด/i);
    fireEvent.change(slider, { target: { value: "2000" } });
    expect(setMinPrice).toHaveBeenCalledWith(2000);
  });

  it("calls setMaxPrice when max slider changes", () => {
    const { setMaxPrice } = setup(1000, 5000);
    const slider = screen.getByLabelText(/ราคาสูงสุด/i);
    fireEvent.change(slider, { target: { value: "8000" } });
    expect(setMaxPrice).toHaveBeenCalledWith(8000);
  });

  it("calls setMinPrice when min input changes", () => {
    const { setMinPrice } = setup(1000, 5000);
    const input = screen.getByLabelText("ต่ำสุด");
    fireEvent.change(input, { target: { value: "1500" } });
    expect(setMinPrice).toHaveBeenCalledWith(1500);
  });

  it("calls setMaxPrice when max input changes", () => {
    const { setMaxPrice } = setup(1000, 5000);
    const input = screen.getByLabelText("สูงสุด");
    fireEvent.change(input, { target: { value: "9000" } });
    expect(setMaxPrice).toHaveBeenCalledWith(9000);
  });
});
