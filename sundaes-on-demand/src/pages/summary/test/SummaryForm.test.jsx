import SummaryForm from "../SummaryForm";
import userEvent from "@testing-library/user-event";
import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";

test("initial conditions", () => {
    render(<SummaryForm />);

    const confirmButton = screen.getByRole("button", { name: "Confirm order" });
    const checkbox = screen.getByRole("checkbox", {
        name: /terms and conditions/i,
    });

    // button starts out disabled and checkbox starts out unchecked;
    expect(confirmButton).toBeDisabled();
    expect(checkbox).not.toBeChecked();
});

test("checkbox ables confirm button", () => {
    render(<SummaryForm />);

    const confirmButton = screen.getByRole("button", { name: "Confirm order" });
    const checkbox = screen.getByRole("checkbox", {
        name: /terms and conditions/i,
    });

    userEvent.click(checkbox);
    expect(confirmButton).toBeEnabled();

    userEvent.click(checkbox);
    expect(confirmButton).toBeDisabled();
});

test("popover responds to hover", async () => {
    render(<SummaryForm />);

    // popover starts out hidden
    const nullPopover = screen.queryByText(
        /no ice cream will actually be delivered/i
    );
    expect(nullPopover).not.toBeInTheDocument();

    // popover appears upon mouseover of checkbox label
    const termsAndConditions = screen.getByText(/terms and conditions/i);
    userEvent.hover(termsAndConditions);

    const popover = screen.getByText(
        /no ice cream will actually be delivered/i
    );
    expect(popover).toBeInTheDocument();

    // popover disappears when we mouse out
    userEvent.unhover(termsAndConditions);
    await waitForElementToBeRemoved(() =>
        screen.queryByText(/no ice cream will actually be delivered/i)
    );
});
