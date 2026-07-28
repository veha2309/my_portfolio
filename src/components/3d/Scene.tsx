export default function Scene({ isLightMode = false }: { isLightMode?: boolean }) {
  return (
    <div
      className="fixed inset-0 -z-10 h-screen w-screen pointer-events-none transition-colors duration-500"
      style={{
        backgroundColor: isLightMode ? '#f8f9fa' : '#08090d',
        backgroundImage: isLightMode
          ? 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.04), transparent 70%)'
          : 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.06), transparent 70%)',
      }}
    />
  );
}
