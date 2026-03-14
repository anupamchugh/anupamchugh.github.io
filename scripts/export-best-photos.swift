#!/usr/bin/env swift

import Photos
import AppKit
import Foundation
import CoreLocation

// Export best photos from Apple Photos - travel, portraits, landscapes, dogs
// Usage: swift export-best-photos.swift [count] [output-dir]

let count = CommandLine.arguments.count > 1 ? Int(CommandLine.arguments[1]) ?? 50 : 50
let outputDir = CommandLine.arguments.count > 2
    ? CommandLine.arguments[2]
    : FileManager.default.currentDirectoryPath + "/best-photos"

try? FileManager.default.createDirectory(atPath: outputDir, withIntermediateDirectories: true)

let semaphore = DispatchSemaphore(value: 0)

PHPhotoLibrary.requestAuthorization(for: .readWrite) { status in
    guard status == .authorized else {
        print("ERROR: Photos access denied.")
        exit(1)
    }

    let fetchOptions = PHFetchOptions()
    fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
    fetchOptions.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.image.rawValue)

    let allPhotos = PHAsset.fetchAssets(with: fetchOptions)
    print("Total photos: \(allPhotos.count)")

    // Filter: last 6 years only (2020-2026)
    let calendar = Calendar.current
    let sixYearsAgo = calendar.date(byAdding: .year, value: -6, to: Date())!

    var candidates: [(PHAsset, Double, String)] = [] // asset, score, category

    allPhotos.enumerateObjects { asset, _, _ in
        // Skip screenshots
        if asset.mediaSubtypes.contains(.photoScreenshot) { return }

        // Last 6 years only
        guard let date = asset.creationDate, date >= sixYearsAgo else { return }

        // Skip tiny images (likely thumbnails/stickers)
        let mp = Double(asset.pixelWidth * asset.pixelHeight) / 1_000_000.0
        if mp < 1.5 { return }

        var score = 0.0
        var category = "general"

        // === FAVORITES get huge bonus ===
        if asset.isFavorite {
            score += 50
            category = "favorite"
        }

        // === Resolution bonus ===
        score += min(mp / 12.0, 1.0) * 15

        // === Location = travel/outdoor ===
        if let loc = asset.location {
            score += 20
            let lat = loc.coordinate.latitude
            let lon = loc.coordinate.longitude

            // Gangtok area (27.3, 88.6)
            if abs(lat - 27.33) < 0.5 && abs(lon - 88.61) < 0.5 {
                score += 30
                category = "gangtok"
            }
            // Kodaikanal area (10.23, 77.48)
            else if abs(lat - 10.23) < 0.5 && abs(lon - 77.48) < 0.5 {
                score += 30
                category = "kodaikanal"
            }
            // Goa area (15.4, 73.9)
            else if abs(lat - 15.4) < 1.0 && abs(lon - 73.9) < 1.0 {
                score += 20
                category = "goa"
            }
            // Rajasthan/Jaisalmer (26.9, 70.9)
            else if abs(lat - 26.9) < 2.0 && abs(lon - 70.9) < 2.0 {
                score += 25
                category = "rajasthan"
            }
            // Himachal/Manali/Mountains (32, 77)
            else if abs(lat - 32.0) < 2.0 && abs(lon - 77.0) < 2.0 {
                score += 25
                category = "himachal"
            }
            // Vietnam (10-21N, 105-109E)
            else if lat > 8 && lat < 23 && lon > 102 && lon < 110 {
                score += 30
                category = "vietnam"
            }
            // Udaipur (24.58, 73.68)
            else if abs(lat - 24.58) < 1.0 && abs(lon - 73.68) < 1.0 {
                score += 25
                category = "udaipur"
            }
            // Any other travel location
            else {
                category = "travel"
            }
        }

        // === Landscape orientation bonus for scenic ===
        if asset.pixelWidth > asset.pixelHeight {
            score += 3
        }

        // === HDR = more careful composition ===
        if asset.mediaSubtypes.contains(.photoHDR) { score += 5 }

        // === Portrait mode photos (depth) ===
        if asset.mediaSubtypes.contains(.photoDepthEffect) {
            score += 15
            if category == "general" || category == "favorite" {
                category = "portrait"
            }
        }

        // === Year bonuses ===
        let year = calendar.component(.year, from: asset.creationDate!)
        if year >= 2023 { score += 8 } // more recent = transformation pics

        candidates.append((asset, score, category))
    }

    // Sort by score
    candidates.sort { $0.1 > $1.1 }

    // Take top N but ensure category diversity
    var selected: [(PHAsset, Double, String)] = []
    var categoryCounts: [String: Int] = [:]
    let maxPerCategory = 10

    for c in candidates {
        let cat = c.2
        let current = categoryCounts[cat, default: 0]
        if current < maxPerCategory {
            selected.append(c)
            categoryCounts[cat] = current + 1
        }
        if selected.count >= count { break }
    }

    print("\nCategories found:")
    for (cat, cnt) in categoryCounts.sorted(by: { $0.value > $1.value }) {
        print("  \(cat): \(cnt)")
    }
    print("\nExporting \(selected.count) photos to: \(outputDir)\n")

    var exported = 0
    for (i, (asset, score, category)) in selected.enumerated() {
        let dateStr: String
        if let date = asset.creationDate {
            let fmt = DateFormatter()
            fmt.dateFormat = "yyyy-MM-dd"
            dateStr = fmt.string(from: date)
        } else {
            dateStr = "unknown"
        }

        let locStr: String
        if let loc = asset.location {
            locStr = String(format: "%.2f,%.2f", loc.coordinate.latitude, loc.coordinate.longitude)
        } else {
            locStr = "no-loc"
        }

        let filename = String(format: "%02d-%@-%@-%dx%d.jpeg", i + 1, category, dateStr, asset.pixelWidth, asset.pixelHeight)
        let outputPath = (outputDir as NSString).appendingPathComponent(filename)

        print("[\(i+1)/\(selected.count)] \(category) score=\(String(format: "%.0f", score)) \(dateStr) \(asset.pixelWidth)x\(asset.pixelHeight) fav=\(asset.isFavorite) \(locStr)")

        let resources = PHAssetResource.assetResources(for: asset)
        guard let resource = resources.first(where: { $0.type == .photo }) ?? resources.first else {
            print("  SKIP: No resource")
            continue
        }

        let innerSem = DispatchSemaphore(value: 0)
        var photoData = Data()

        let resOptions = PHAssetResourceRequestOptions()
        resOptions.isNetworkAccessAllowed = true

        PHAssetResourceManager.default().requestData(for: resource, options: resOptions, dataReceivedHandler: { chunk in
            photoData.append(chunk)
        }, completionHandler: { error in
            if let error = error {
                print("  ERROR: \(error.localizedDescription)")
                innerSem.signal()
                return
            }

            guard let source = CGImageSourceCreateWithData(photoData as CFData, nil),
                  let cgImage = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
                print("  SKIP: decode failed")
                innerSem.signal()
                return
            }

            let w = cgImage.width
            let h = cgImage.height
            let maxDim = 2000.0
            let scale = min(maxDim / Double(w), maxDim / Double(h), 1.0)
            let newW = Int(Double(w) * scale)
            let newH = Int(Double(h) * scale)

            let nsImage = NSImage(cgImage: cgImage, size: NSSize(width: newW, height: newH))
            guard let tiff = nsImage.tiffRepresentation,
                  let rep = NSBitmapImageRep(data: tiff),
                  let jpeg = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.82]) else {
                print("  SKIP: JPEG failed")
                innerSem.signal()
                return
            }

            do {
                try jpeg.write(to: URL(fileURLWithPath: outputPath))
                exported += 1
                print("  -> \(filename) (\(jpeg.count / 1024)KB)")
            } catch {
                print("  WRITE ERROR: \(error)")
            }
            innerSem.signal()
        })

        innerSem.wait()
    }

    print("\n Done! Exported \(exported)/\(selected.count) photos")
    print("Location: \(outputDir)")
    semaphore.signal()
}

semaphore.wait()
