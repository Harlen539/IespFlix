import Card from "./Card";

export default function TopTenRow({ title, items = [] }) {
  return (
    <section className="row top-row">
      <div className="row-header">
        <h2>{title}</h2>
        <div className="row-indicators">
          <span />
          <span />
        </div>
      </div>

      <div className="top-scroller">
        {items.slice(0, 10).map((item, index) => (
          <article
            className={index === 9 ? "top-card-wrap top-card-wrap-wide" : "top-card-wrap"}
            key={item.id}
          >
            <span className="top-number">{index + 1}</span>
            <Card item={item} variant="top10" />
          </article>
        ))}
      </div>
    </section>
  );
}
