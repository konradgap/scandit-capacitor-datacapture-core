// swift-tools-version: 5.9
import PackageDescription

// Version is set during release process
// When developing locally in monorepo, the version is read from package.json/info.json
// When published to GitHub, the version must be hardcoded
let version = "7.6.1"

let package = Package(
    name: "ScanditCapacitorDatacaptureCore",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "ScanditCapacitorDatacaptureCore",
            targets: ["ScanditCapacitorDatacaptureCore"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0"),
        .package(url: "https://github.com/konradgap/scandit-datacapture-frameworks-core.git", exact: Version(stringLiteral: version))
    ],
    targets: [
        // Objective-C target for VolumeButtonObserver
        .target(
            name: "ScanditCapacitorDatacaptureCoreObjC",
            dependencies: [
                .product(name: "ScanditFrameworksCore", package: "scandit-datacapture-frameworks-core")
            ],
            path: "ios/Sources/ScanditCapacitorCoreObjC",
            publicHeadersPath: "."),
        // Swift target that depends on the Objective-C target
        .target(
            name: "ScanditCapacitorDatacaptureCore",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "ScanditFrameworksCore", package: "scandit-datacapture-frameworks-core"),
                "ScanditCapacitorDatacaptureCoreObjC"
            ],
            path: "ios/Sources/ScanditCapacitorCore"),
        .testTarget(
            name: "ScanditCapacitorDatacaptureCoreTests",
            dependencies: ["ScanditCapacitorDatacaptureCore"],
            path: "ios/Tests/ScanditCapacitorCoreTests")
    ]
)
