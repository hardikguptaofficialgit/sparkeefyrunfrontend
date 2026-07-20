export function AmbientMesh() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#050505]" />
      <div
        className="absolute -left-[20%] top-[-10%] h-[55vh] w-[55vw] opacity-[0.14]"
        style={{
          background:
            "radial-gradient(ellipse at center, #ff4d91 0%, transparent 68%)",
        }}
      />
      <div
        className="absolute -right-[15%] top-[5%] h-[50vh] w-[50vw] opacity-[0.1]"
        style={{
          background:
            "radial-gradient(ellipse at center, #66c2c2 0%, transparent 68%)",
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[25%] h-[45vh] w-[45vw] opacity-[0.08]"
        style={{
          background:
            "radial-gradient(ellipse at center, #ff4d91 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
