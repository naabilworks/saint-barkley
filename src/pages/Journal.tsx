import { Link, useParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatDate, getPost, posts, readMins, type Post } from "../data/journal";
import { formatPrice, getProduct } from "../data/products";
import { ProductImage } from "../components/shared/SizePicker";
import "./Journal.css";

function Cover({ post }: { post: Post }) {
  const product = getProduct(post.product);
  return (
    <span className="jr-cover">
      {product && <ProductImage src={product.image} alt="" className="jr-cover__img" />}
    </span>
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <span className="jr-meta">
      {post.topic}
      <span>{formatDate(post.date)}</span>
      <span>{readMins(post)} min read</span>
    </span>
  );
}

export function Journal() {
  const [lead, ...rest] = posts;

  return (
    <main className="jr">
      <header className="jr-head">
        <h1 className="jr-title">Journal</h1>
        <p className="jr-lede">
          Practical notes on caring for, sizing, and understanding the shoes you wear.
        </p>
      </header>

      <Link to={`/journal/${lead.slug}`} className="jr-lead">
        <Cover post={lead} />
        <span className="jr-lead__body">
          <Meta post={lead} />
          <span className="jr-lead__title">{lead.title}</span>
          <span className="jr-lead__excerpt">{lead.excerpt}</span>
          <span className="jr-read">
            Read article <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
          </span>
        </span>
      </Link>

      <ul className="jr-grid">
        {rest.map((p) => (
          <li key={p.slug}>
            <Link to={`/journal/${p.slug}`} className="jr-card">
              <Cover post={p} />
              <span className="jr-card__body">
                <Meta post={p} />
                <span className="jr-card__title">{p.title}</span>
                <span className="jr-card__excerpt">{p.excerpt}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export function JournalPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post)
    return (
      <main className="jr jr--center">
        <h1 className="jr-title">Article not found</h1>
        <p className="jr-lede">It may have been moved or removed.</p>
        <Link to="/journal" className="btn btn--solid">
          Back to the journal
        </Link>
      </main>
    );

  const product = getProduct(post.product);
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main className="jr">
      <nav className="jr-crumbs" aria-label="Breadcrumb">
        <Link to="/journal">Journal</Link>
        <span aria-current="page">{post.topic}</span>
      </nav>

      <article className="jr-post">
        <header className="jr-post__head">
          <h1 className="jr-post__title">{post.title}</h1>
          <p className="jr-post__excerpt">{post.excerpt}</p>
          <Meta post={post} />
        </header>

        <div className="jr-post__cover">
          <Cover post={post} />
        </div>

        <div className="jr-prose">
          {post.body.map((b, i) =>
            b.t === "h" ? (
              <h2 key={i}>{b.text}</h2>
            ) : b.t === "ul" ? (
              <ul key={i}>
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            ) : (
              <p key={i}>{b.text}</p>
            )
          )}
        </div>

        {product && (
          <aside className="jr-product" aria-label="Featured product">
            <Link to={`/product/${product.slug}`} className="jr-product__link">
              <span className="jr-product__img">
                <ProductImage src={product.image} alt={`${product.name}, ${product.color}`} />
              </span>
              <span className="jr-product__text">
                <span className="jr-product__label">Mentioned in this article</span>
                <span className="jr-product__name">{product.name}</span>
                <span className="jr-product__sub">
                  {product.category}, {product.color}
                </span>
              </span>
              <span className="jr-product__price">{formatPrice(product.price)}</span>
            </Link>
          </aside>
        )}
      </article>

      <section className="jr-more" aria-labelledby="jr-more-title">
        <h2 id="jr-more-title">More from the journal</h2>
        <ul className="jr-grid jr-grid--two">
          {more.map((p) => (
            <li key={p.slug}>
              <Link to={`/journal/${p.slug}`} className="jr-card">
                <Cover post={p} />
                <span className="jr-card__body">
                  <Meta post={p} />
                  <span className="jr-card__title">{p.title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}