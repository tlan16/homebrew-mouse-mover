class MouseMover < Formula
  desc "Mouse mover utility"
  homepage "https://github.com/tlan16/mouse-mover"
  url "https://github.com/tlan16/homebrew-mouse-mover.git", using: :git, branch: "main"
  version "1.0.0"

  depends_on "node@22" => :build
  depends_on "pnpm" => :build

  def install
    system "pnpm", "install"
    system "pnpm", "run", "build"
    bin.install "dist/amm"
  end

end
