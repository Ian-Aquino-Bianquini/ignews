import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Post from "../../pages/posts/preview/[slug]";

const post = {
  slug: "fake-slug",
  title: "Ian",
  content: "<p>Fake excerpt</p>",
  updatedAt: "01-01-2022",
};

jest.mock("next-auth/react");
jest.mock("next/router");
jest.mock("../../services/prismic");

describe("Post preview Page", () => {
  it("should render the Post preview page", async () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false] as any);

    render(<Post post={post} />);

    expect(screen.getByText("Ian")).toBeInTheDocument();
    expect(screen.getByText("Fake excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("Redirects user to full Post when user is subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-subscription",
        expires: null,
      },
      status: "authenticated",
    });

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/fake-slug");
  });

  // it("Loads initial data", async () => {
  //   const getSessionMocked = mocked(getSession);
  //   const getPrismicClientMocked = mocked(getPrismicClient);

  //   getPrismicClientMocked.mockReturnValueOnce({
  //     getByUID: jest.fn().mockResolvedValueOnce({
  //       data: {
  //         Title: [
  //           {
  //             type: "heading",
  //             text: "Fake title 1",
  //           },
  //         ],
  //         content: [
  //           {
  //             type: "paragraph",
  //             text: "Fake excerpt 1",
  //           },
  //         ],
  //       },
  //       last_publication_date: "01-01-2022",
  //     }),
  //   } as any);
  //   getSessionMocked.mockResolvedValueOnce({
  //     activeSubscription: "fake-active-subscription",
  //   } as any);

  //   const response = await getStaticProps({
  //     req: { cookies: {} },
  //     params: { slug: "my-new-post" },
  //   } as any);

  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       props: {
  //         post: {
  //           slug: "my-new-post",
  //           title: "Fake title 1",
  //           content: "<p>Fake excerpt 1</p>",
  //           updatedAt: "01 de janeiro de 2022",
  //         },
  //       },
  //     })
  //   );
  // });
});
