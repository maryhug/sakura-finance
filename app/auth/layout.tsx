export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center petal-bg relative overflow-hidden px-4 py-12">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-sakura-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-lavender-200/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-petal-100/20 blur-3xl pointer-events-none" />

      {/* Floating petals — purely decorative */}
      <div className="absolute top-16 left-[10%] text-3xl opacity-30 animate-float" style={{ animationDelay: "0s" }}>✿</div>
      <div className="absolute top-32 right-[15%] text-2xl opacity-20 animate-float" style={{ animationDelay: "0.8s" }}>❀</div>
      <div className="absolute bottom-24 left-[20%] text-2xl opacity-25 animate-float" style={{ animationDelay: "1.5s" }}>✾</div>
      <div className="absolute bottom-16 right-[10%] text-3xl opacity-20 animate-float" style={{ animationDelay: "0.4s" }}>✿</div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">{children}</div>
    </div>
  )
}
