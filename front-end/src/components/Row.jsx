import Card from "./Card";
import ScrollableRow from "./ScrollableRow";

export default function Row({ title, items = [] }) {
  if (!items.length) return null;

  return (
    <section className="row">
      <div className="row-header">
        <h2>{title}</h2>
        <div className="row-indicators">
          <span />
          <span />
          <span />
        </div>
      </div>

      <ScrollableRow className="card-scroller" label={title}>
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </ScrollableRow>
    </section>
  );
}
