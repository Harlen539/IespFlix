import Card from "./Card";

export default function Row({ title, items = [] }) {
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

      <div className="card-scroller">
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
