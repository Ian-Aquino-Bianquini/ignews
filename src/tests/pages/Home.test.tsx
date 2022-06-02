import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next/router");
jest.mock("next-auth/react", () => {
  return {
    useSession: () => [null, false],
  };
});

jest.mock("../../services/stripe.ts");

describe("Home Page", () => {
  it("should render the home page", async () => {
    render(<Home product={{ priceId: "fake-priceId", amount: "R$10,00" }} />);

    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument();
  });

  it("Loads the initial data", async () => {
    const retrivesStripeMocked = mocked(stripe.prices.retrieve);

    retrivesStripeMocked.mockResolvedValueOnce({
      id: "fake-priceId",
      unit_amount: "1000",
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-priceId",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
