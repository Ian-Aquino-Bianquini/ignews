import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "fake-slug",
  title: "Ian",
  content: "<p>Fake excerpt</p>",
  updatedAt: "01-01-2022",
};

jest.mock("next-auth/react");
jest.mock("../../services/prismic");

describe("Post Page", () => {
  it("should render the Post page", async () => {
    render(<Post post={post} />);

    expect(screen.getByText("Ian")).toBeInTheDocument();
    expect(screen.getByText("Fake excerpt")).toBeInTheDocument();
  });

  it("Redirects user if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      req: { cookies: {} },
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: "/posts/preview/my-new-post",
          permanent: false,
        },
      })
    );
  });

  it("Loads initial data", async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          Title: [
            {
              type: "heading",
              text: "Fake title 1",
            },
          ],
          content: [
            {
              type: "paragraph",
              text: "Fake excerpt 1",
            },
          ],
        },
        last_publication_date: "01-01-2022",
      }),
    } as any);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    const response = await getServerSideProps({
      req: { cookies: {} },
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "Fake title 1",
            content: "<p>Fake excerpt 1</p>",
            updatedAt: "01 de janeiro de 2022",
          },
        },
      })
    );
  });
});
