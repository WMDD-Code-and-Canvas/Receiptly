const Menu = ({ selectedCategory, setSelectedCategory }) => {
    const categories = [
      "Financial",
      "Customer & Market",
      "Growth & Performance",
      "Operational Efficiency",
      "Investor-Specific",
    ];
  
    return (
      <div className="flex space-x-4 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1.5 rounded-md ${
              selectedCategory === category ? "bg-blue-200/50 text-blue-800" : "bg-white text-gray-500"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            <span className="text-sm font-medium">{category}</span>
          </button>
        ))}
      </div>
    );
  };
  
  export default Menu;
  