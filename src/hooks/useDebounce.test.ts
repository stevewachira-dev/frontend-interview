import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("does not update the debounced value before the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } }
    );

    // change the value
    rerender({ value: "updated", delay: 300 });

    // advance only partway — should still be stale
    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current).toBe("initial");
  });

  it("updates the debounced value after the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } }
    );

    rerender({ value: "updated", delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("updated");
  });

  it("resets the timer when value changes before the delay finishes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    );

    // first change
    rerender({ value: "b", delay: 300 });
    act(() => {
      jest.advanceTimersByTime(200); // not enough
    });
    expect(result.current).toBe("a");

    // second change before the first timer fires
    rerender({ value: "c", delay: 300 });
    act(() => {
      jest.advanceTimersByTime(200); // still not 300 from second change
    });
    expect(result.current).toBe("a");

    // now finish the timer for "c"
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe("c");
  });

  it("works with non-string generic types", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useDebounce(value, 200),
      { initialProps: { value: 1 } }
    );

    rerender({ value: 42 });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe(42);
  });

  it("cleans up the pending timer on unmount (no act warning)", () => {
    const { rerender, unmount } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: "start" } }
    );

    rerender({ value: "pending" });

    // unmount before the timer fires — should not throw or warn
    unmount();

    // advancing time after unmount should be safe
    act(() => {
      jest.advanceTimersByTime(300);
    });
  });
});
