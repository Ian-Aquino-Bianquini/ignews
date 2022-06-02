import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Posts, { getStaticProps, Post } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

const posts = [
  {
    slug: "fake-slug",
    title: "Ian",
    excerpt: "Fake excerpt",
    updatedAt: "2020-01-01",
  },
] as Post[];

jest.mock("../../services/prismic");

describe("Posts Page", () => {
  it("should render the Posts page", async () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("Ian")).toBeInTheDocument();
  });

  it("Loads the initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      get: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "fake-slug",
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
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "fake-slug",
              title: "Fake title 1",
              excerpt: "Fake excerpt 1",
              updatedAt: "01 de janeiro de 2022",
            },
          ],
        },
      })
    );
  });
});
