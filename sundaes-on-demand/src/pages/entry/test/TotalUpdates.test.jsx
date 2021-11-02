import { render, screen } from "../../../test-utils/testing-library-utils";

import Options from "../Options";
import OrderEntry from "../OrderEntry";
import userEvent from "@testing-library/user-event";

test("update scoop subtotal when scoops change", async () => {
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubTotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubTotal).toHaveTextContent("0.00");

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");
  expect(scoopsSubTotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");
  expect(scoopsSubTotal).toHaveTextContent("6.00");
});

test("update topping subtotal when topping change", async () => {
  render(<Options optionType="toppings" />);

  const toppingsSubTotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubTotal).toHaveTextContent("0.00");

  // add cherries and check subtotal
  const cherriesCheckbox = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  expect(cherriesCheckbox).not.toBeChecked();
  userEvent.click(cherriesCheckbox);
  expect(toppingsSubTotal).toHaveTextContent("1.50");

  // add hot fudge and check subtotal
  const fudgeCheckbox = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });
  expect(fudgeCheckbox).not.toBeChecked();
  userEvent.click(fudgeCheckbox);
  expect(toppingsSubTotal).toHaveTextContent("3.00");

  // remove hot fudge and check subtotal
  userEvent.click(fudgeCheckbox);
  expect(toppingsSubTotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test.only("grand total starts at $0.00", async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    expect(grandTotal).toHaveTextContent("0.00");
  });
  test("grand total updates properly if scoop is added first", async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");
    expect(grandTotal).toHaveTextContent("4.00");

    const cherriesTopping = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    expect(cherriesTopping).not.toBeChecked();
    userEvent.click(cherriesTopping);
    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if topping is added first", async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });

    const cherriesTopping = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    expect(cherriesTopping).not.toBeChecked();
    userEvent.click(cherriesTopping);
    expect(grandTotal).toHaveTextContent("1.50");

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");
    expect(grandTotal).toHaveTextContent("5.50");
  });

  test("grand total updates properly if item is removed", async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });
    const cherriesTopping = await screen.findByRole("checkbox", {
      name: "Cherries",
    });

    expect(cherriesTopping).not.toBeChecked();
    userEvent.click(cherriesTopping);

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");

    expect(grandTotal).toHaveTextContent("5.50");

    userEvent.click(cherriesTopping);
    expect(grandTotal).toHaveTextContent("4.00");
    userEvent.type(vanillaInput, "1");
    expect(grandTotal).toHaveTextContent("2.00");
  });
});
