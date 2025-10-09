

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-20 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center text-slate-400">
        <p>© {new Date().getFullYear()} John Doe. Built with React + TypeScript + Tailwind CSS</p>
      </div>
    </footer>
  );
}
