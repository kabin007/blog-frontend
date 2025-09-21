const TableOfContents = ({ tocItems, scrollToSection }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-64 p-4">
    <h3 className="font-bold text-lg mb-2">Table of Contents</h3>
    <div className="space-y-1 max-h-96 overflow-y-auto">
      {tocItems.length > 0 ? (
        tocItems.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer text-gray-700 hover:text-blue-600"
            style={{ paddingLeft: (item.level - 2) * 16 }}
            onClick={() => scrollToSection(item.id)}
          >
            {item.text}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No headings found</p>
      )}
    </div>
  </div>
);

export default TableOfContents;
