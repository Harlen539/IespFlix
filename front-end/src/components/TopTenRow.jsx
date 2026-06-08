import Card from "./Card";
import ScrollableRow from "./ScrollableRow";

export default function TopTenRow({ title, items = [] }) {
  if (!items.length) return null;

  return (
    <section className="row top-row">
      <div className="row-header">
        <h2>{title}</h2>
        <div className="row-indicators">
          <span />
          <span />
        </div>
      </div>

      <ScrollableRow className="top-scroller" label={title}>
        {items.slice(0, 10).map((item, index) => (
          <article
            className={index === 9 ? "top-card-wrap top-card-wrap-wide" : "top-card-wrap"}
            key={item.id}
          >
            <span className="top-number">{index + 1}</span>
            <Card item={item} variant="top10" />
          </article>
        ))}
      </ScrollableRow>
    </section>
  );
}
