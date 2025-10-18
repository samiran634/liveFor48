const MemoriesPanel = () => {
  const memories = [
    { id: "8A4F-001", text: "signal_lost" },
    { id: "9B1E-002", text: "data_err" },
    { id: "7C3D-003", text: "unreadable" },
    { id: "4F5A-004", text: "corrupt" },
  ];

  return (
    <>
    
     {/*just created it for symitry add any feature but make sure it is buggy*/}    
    
    <div>
        <img src="/dark_eye.png" alt="scary eye image" />
    </div>
    <div className="text-center text-green-400 font-mono p-8">
      <h1 className="font-press-start text-3xl mb-2">MEMORIES ARCHIVE</h1>
      <p className="text-gray-500 mb-6">// Fragments recovered from corrupted sectors</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {memories.map((m) => (
          <div
            key={m.id}
            className="relative group border border-green-700 bg-black rounded-lg overflow-hidden hover:scale-105 transition-transform"
          >
            <img src={`https://placehold.co/300x300/000000/333333?text=${m.text}`} alt={m.text} />
            <div className="absolute bottom-0 w-full bg-green-900/50 text-xs p-1 opacity-0 group-hover:opacity-100 transition">
              ID: {m.id}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default MemoriesPanel;
