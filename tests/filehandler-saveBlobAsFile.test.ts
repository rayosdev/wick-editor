import { afterEach, describe, expect, it, vi } from "vitest";
import { saveBlobAsFile } from "../src/files/filehandler";

describe("saveBlobAsFile", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("creates a temporary download anchor and revokes object URL", () => {
    vi.useFakeTimers();

    if (!("createObjectURL" in URL)) {
      Object.defineProperty(URL, "createObjectURL", {
        writable: true,
        configurable: true,
        value: () => "",
      });
    }
    if (!("revokeObjectURL" in URL)) {
      Object.defineProperty(URL, "revokeObjectURL", {
        writable: true,
        configurable: true,
        value: () => undefined,
      });
    }

    const createObjectURLSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:test-url");
    const revokeObjectURLSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const appendSpy = vi.spyOn(document.body, "appendChild");
    const removeSpy = vi.spyOn(document.body, "removeChild");

    saveBlobAsFile(new Blob(["abc"], { type: "text/plain" }), "demo.txt");

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).not.toHaveBeenCalled();

    vi.runAllTimers();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:test-url");
  });
});
