import Loader from '../Loader';

const GridLayout = ({ items, renderItem, loading, columns = 3, emptyMessage = "No items found" }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="large" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6`}>
      {items.map((item, index) => (
        <div key={item.id || index}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

export default GridLayout;