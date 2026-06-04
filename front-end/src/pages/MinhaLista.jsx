import Card from "../components/Card";

export default function MinhaLista({ items = [] }) {
  return (
    <main className="content standalone-page">
      <h1 className="simple-page-heading">Minha lista</h1>

      {items.length ? (
        <div className="grid-page">
          {items.map((item) => (
            <Card key={item.id} item={item} large />
          ))}
        </div>
      ) : (
        <p className="empty-list-message">Sua lista ainda está vazia.</p>
      )}
    </main>
  );
}
