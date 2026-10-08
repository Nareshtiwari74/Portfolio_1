import type { Metadata } from "next";

import { Article, Figure, Prose, Section } from "@/components/Blogs/Article";
import { postBySlug } from "@/components/Blogs/postsData";
import { ogImage, ogImageUrl } from "@/lib/og";
import { absoluteUrl, siteConfig } from "@/lib/site";

const slug = "behind-the-pay-button";
const post = postBySlug(slug)!;
const og = {
  title: post.title,
  description: post.description,
  path: `blogs/${slug}`,
  tags: post.tags,
};

export const metadata: Metadata = {
  title: `${post.title} | ${siteConfig.name}`,
  description: post.description,
  authors: [{ name: siteConfig.name }],
  alternates: { canonical: `/blogs/${slug}` },
  openGraph: {
    type: "article",
    title: post.title,
    description: post.description,
    url: absoluteUrl(`/blogs/${slug}`),
    publishedTime: post.publishedAt,
    authors: [siteConfig.name],
    images: [ogImage(og)],
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.description,
    images: [ogImageUrl(og)],
  },
};

export default function PaymentRoutingArticle() {
  return (
    <Article slug={slug}>
      <Prose>
        <p>
          You click <strong>Pay</strong>, wait a few seconds, and see “Payment
          failed.”
        </p>
        <p>
          Sometimes the problem is a temporary issue with the payment provider.
          For a business, that can mean losing a customer who was ready to buy.
        </p>
        <p>
          This is where <strong>payment routing and orchestration</strong>{" "}
          become interesting: they give businesses more control over how
          payments are processed.
        </p>
      </Prose>

      <Section title="What is payment orchestration?">
        <Prose>
          <p>
            Payment orchestration connects multiple payment providers through a
            unified software layer. It coordinates payment operations, including
            routing, authorisation, and related workflows.
          </p>
          <p>
            <strong>Routing</strong> is one decision within that process:
            choosing which provider should handle a particular transaction.
          </p>
          <p>
            A useful analogy is navigation. Routing chooses a suitable road;
            orchestration manages the wider journey.
          </p>
        </Prose>
      </Section>

      <Section title="How does payment routing work?">
        <Prose>
          <p>
            A routing engine can first identify eligible providers, then apply
            business rules and consider current provider performance. The exact
            sequence depends on the implementation.
          </p>
        </Prose>
        <Figure
          src="/blog-img/payment-routing/routing-flow.png"
          alt="Customer clicks Pay, enters an orchestration layer, finds eligible providers and applies merchant rules. Dynamic routing considers current performance; otherwise the configured order is used. The selected provider receives the payment."
          width={1074}
          height={1506}
          caption="Figure 1: A simplified routing flow. Eligibility and configuration determine which providers can be considered. The supplied diagram names Juspay as its example orchestration layer; the exact sequence depends on the implementation."
        />
        <Prose>
          <p>
            For example, a provider might support the right payment method and
            currency, but currently be experiencing technical problems. Another
            eligible provider could be a better choice.
          </p>
          <p>
            Routing can also account for processing costs and commercial
            commitments. The cheapest route and the route with the strongest
            acceptance rate may differ, so the business must decide what to
            prioritise.
          </p>
        </Prose>
      </Section>

      <Section title="What happens when a payment fails?">
        <Prose>
          <p>
            Some failures can be recovered by an eligible retry through another
            provider. However, retry decisions must consider the failure reason.
          </p>
        </Prose>
        <Figure
          src="/blog-img/payment-routing/failure-handling.png"
          alt="A successful payment is confirmed. A confirmed failure is retried through an alternative provider only if eligible. Pending or unknown results require resolving the payment status before another charge is attempted."
          width={1200}
          height={1562}
          caption="Figure 2: A conceptual failure-handling flow. An unknown result needs investigation before another charge is attempted."
        />
      </Section>

      <Section title="Why can this be useful?">
        <Prose>
          <p>
            Consider a hypothetical batch of <strong>1,000 payments</strong>:
          </p>
          <ul>
            <li>900 payments succeed initially.</li>
            <li>Eligible fallback attempts recover another 60.</li>
            <li>The final total becomes 960 successful payments.</li>
          </ul>
          <p>
            This illustrates the potential benefit of fallback.{" "}
            <strong>
              It is example data, not a measured industry result or a guaranteed
              improvement.
            </strong>
          </p>
        </Prose>
        <Figure
          src="/blog-img/payment-routing/illustrative-fallback.svg"
          alt="Illustrative graph with a zero-based axis: 900 successful initial attempts and 960 successful payments after eligible fallback, from a hypothetical batch of 1,000."
          width={1280}
          height={720}
          caption="Illustrative example: Initial attempts: 900 / After fallback: 960. Example data only; not a measured industry result or a guaranteed improvement."
        />
        <Prose>
          <p>
            The advantage is having alternatives when one provider struggles.
            Routing can help businesses pursue better acceptance rates, manage
            processing costs, and distribute traffic according to their
            requirements.
          </p>
        </Prose>
      </Section>

      <Section title="Why I find the technology interesting">
        <Prose>
          <p>
            From a developer’s perspective, payment orchestration brings several
            difficult engineering problems together.
          </p>
          <p>
            <strong>Decisions change with live conditions.</strong> A provider
            that worked well earlier may become unreliable. Routing introduces a
            feedback loop: observe performance, make a decision, and evaluate
            the result.
          </p>
          <p>
            <strong>Failure handling affects real money.</strong> A timeout
            raises a difficult question: did the payment fail, or did the
            response fail to arrive? Correct state management matters as much as
            choosing a provider.
          </p>
          <p>
            <strong>Retries need safeguards.</strong> Idempotency keys help
            prevent repeated API requests from creating duplicate transactions.
            They are one part of payment correctness, alongside reliable status
            handling.
          </p>
          <p>
            <strong>
              Technical decisions have visible business consequences.
            </strong>{" "}
            A routing decision can affect whether a customer completes an order,
            how much processing costs, and how smoothly checkout works.
          </p>
          <p>
            My assessment is that orchestration becomes especially valuable when
            a business has multiple providers, significant payment volume, or
            complex routing requirements. A smaller application may find one
            gateway sufficient.
          </p>
          <p>
            What makes this technology compelling is the combination of
            decision-making, distributed systems, and financial correctness—all
            hidden behind a single <strong>Pay</strong> button.
          </p>
        </Prose>
      </Section>
    </Article>
  );
}
