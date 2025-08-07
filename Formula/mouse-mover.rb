class MouseMover < Formula
  desc "Mouse mover utility"
  homepage "https://github.com/tlan16/mouse-mover"
  url "https://github.com/tlan16/homebrew-mouse-mover.git", using: :git, branch: "main"
  version "1.0.3"

  depends_on "node@22" => :build
  depends_on "oven-sh/bun/bun" => :build

  def install
    system "bun", "install"
    system "bun", "run", "build"
    bin.install "dist/amm"
  end

end
