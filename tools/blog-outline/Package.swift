// swift-tools-version: 6.4
import PackageDescription
let package = Package(
    name: "RelayProbe",
    platforms: [.macOS(.v26)],
    dependencies: [.package(url: "https://github.com/Juanpe/ModelRelay.git", exact: "0.2.0", traits: [])],
    targets: [.executableTarget(name: "RelayProbe", dependencies: [.product(name: "ModelRelay", package: "ModelRelay")])]
)
